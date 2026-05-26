"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { propagateSatellite, LiveSatelliteData } from '@/lib/satellite-engine';

interface SatelliteContextType {
  satellites: LiveSatelliteData[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refreshRate: number;
}

const SatelliteContext = createContext<SatelliteContextType>({
  satellites: [],
  isLoading: true,
  error: null,
  lastUpdate: null,
  refreshRate: 5000
});

export const useSatellites = () => useContext(SatelliteContext);

export function SatelliteProvider({ children }: { children: React.ReactNode }) {
  const [rawCatalog, setRawCatalog] = useState<any[]>([]);
  const [satellites, setSatellites] = useState<LiveSatelliteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const refreshRate = 5000; // Update mechanics every 5 seconds

  // 1. Fetch raw TLE data from our backend proxy once
  useEffect(() => {
    async function fetchCatalog() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/satellites');
        if (!res.ok) throw new Error("Failed to fetch API");
        const json = await res.json();
        
        if (json.data && Array.isArray(json.data)) {
          setRawCatalog(json.data);
        } else {
          throw new Error("Invalid catalog format");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCatalog();
  }, []);

  // 2. Propagate orbits every `refreshRate` ms
  const computeOrbits = useCallback(() => {
    if (rawCatalog.length === 0) return;

    const now = new Date();
    const liveData: LiveSatelliteData[] = [];

    for (const raw of rawCatalog) {
      const live = propagateSatellite(raw.name, raw.noradId, raw.line1, raw.line2, raw.type, now);
      if (live) {
        liveData.push(live);
      }
    }

    setSatellites(liveData);
    setLastUpdate(now);
  }, [rawCatalog]);

  useEffect(() => {
    // Initial compute
    if (rawCatalog.length > 0) {
      computeOrbits();
    }
    
    // Set interval for continuous updates
    const interval = setInterval(computeOrbits, refreshRate);
    return () => clearInterval(interval);
  }, [rawCatalog, computeOrbits, refreshRate]);

  return (
    <SatelliteContext.Provider value={{ satellites, isLoading, error, lastUpdate, refreshRate }}>
      {children}
    </SatelliteContext.Provider>
  );
}
