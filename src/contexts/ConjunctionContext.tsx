"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WSAlert {
  id: string;
  primaryObject: string;
  primaryNorad: string;
  secondaryObject: string;
  secondaryNorad: string;
  missDistance: number;
  timeToImpact: number;
  probability: number;
  urgency: "CRITICAL" | "HIGH";
}

interface ConjunctionContextType {
  alerts: WSAlert[];
  isConnected: boolean;
}

const ConjunctionContext = createContext<ConjunctionContextType>({
  alerts: [],
  isConnected: false
});

export const useConjunctions = () => useContext(ConjunctionContext);

export function ConjunctionProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<WSAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;
    let hasNotifiedOnce = false;
    const notifiedAlerts = new Set<string>(); // Keep track of triggered notifications

    const connect = () => {
      ws = new WebSocket("ws://localhost:8000/ws/conjunctions");

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === "success" && Array.isArray(data.alerts)) {
            setAlerts(data.alerts);
            
            // Post critical alerts to database for historical logging and trigger notifications
            data.alerts.forEach((alert: WSAlert) => {
              if (alert.urgency === "CRITICAL" && !notifiedAlerts.has(alert.id)) {
                // Log to database
                fetch('/api/alerts', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(alert)
                }).catch(err => console.error("Failed to log alert:", err));
                
                // Trigger Desktop Notification based on user preference
                const pref = typeof window !== "undefined" ? (localStorage.getItem("notification_preference") || "once") : "once";
                
                if (pref !== "muted" && "Notification" in window && Notification.permission === "granted") {
                  if (pref === "all" || (pref === "once" && !hasNotifiedOnce)) {
                    new Notification("CRITICAL CONJUNCTION DETECTED", {
                      body: `${alert.primaryObject} vs ${alert.secondaryObject}\nMiss Distance: ${alert.missDistance}m`,
                      icon: "/favicon.ico"
                    });
                    hasNotifiedOnce = true;
                  }
                }
                
                // Mark as notified so we don't spam the user every 5 seconds
                notifiedAlerts.add(alert.id);
              }
            });
          }
        } catch (e) {
          console.error("Error parsing websocket message:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimer = setTimeout(connect, 3000);
      };
      
      ws.onerror = () => {
        ws.close();
      };
    };

    // Request notification permissions on initial load
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  return (
    <ConjunctionContext.Provider value={{ alerts, isConnected }}>
      {children}
    </ConjunctionContext.Provider>
  );
}
