"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, Wifi, WifiOff, BrainCircuit } from "lucide-react";
import { useConjunctions, WSAlert } from "@/contexts/ConjunctionContext";

export function AlertCenter() {
  const { alerts, isConnected } = useConjunctions();

  const formattedAlerts = useMemo(() => {
    return alerts.map((alert: WSAlert) => {
      const isCritical = alert.urgency === "CRITICAL";
      return {
        id: alert.id,
        type: alert.urgency,
        title: isCritical ? "High Collision Warning" : "Proximity Alert",
        desc: `TCA: ${Math.round(alert.timeToImpact / 60)}m. Object #${alert.secondaryNorad} in path of ${alert.primaryNorad}. Dist: ${alert.missDistance}m`,
        icon: isCritical ? ShieldAlert : AlertTriangle,
        color: isCritical ? "text-red-400" : "text-yellow-400",
        bg: isCritical ? "bg-red-500/10" : "bg-yellow-500/10",
        border: isCritical ? "border-red-500/30" : "border-yellow-500/30"
      };
    });
  }, [alerts]);

  const criticalCount = alerts.filter(a => a.urgency === "CRITICAL").length;

  return (
    <div className="cyber-panel p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2">
          <ShieldAlert size={18} />
          Priority Alerts
        </h2>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${isConnected ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-500 border-slate-500/30 bg-slate-500/10'}`}>
            {isConnected ? (
              <>
                <Wifi size={12} className="animate-pulse" />
                <span>LIVE FEED</span>
              </>
            ) : (
              <>
                <WifiOff size={12} />
                <span>OFFLINE</span>
              </>
            )}
          </div>
          
          {criticalCount > 0 && (
            <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-mono tracking-widest flex items-center gap-1 cyber-glow-box">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              {criticalCount} CRITICAL
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        {formattedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs opacity-70">
            {isConnected ? "Awaiting telemetry data..." : "Connection lost. Reconnecting..."}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {formattedAlerts.map((alert, i) => {
              const Icon = alert.icon;
              const isCritical = alert.type === "CRITICAL";
              // AI Math Approximation for UI
              const deltaV = (alert.missDistance / 1000 * 2.5).toFixed(1);

              return (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`border ${alert.border} ${alert.bg} rounded-lg p-3 relative overflow-hidden group cursor-pointer hover:bg-opacity-20 transition-all flex flex-col gap-2`}
                >
                  {/* Cyber scanline effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-[-100%] group-hover:animate-[scan_1.5s_linear_infinite]" />
                  
                  <div className="flex gap-3 relative z-10">
                    <div className="mt-0.5">
                      <Icon size={16} className={alert.color} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-bold ${alert.color}`}>{alert.title}</span>
                        <span className="text-[9px] font-mono text-slate-500">{alert.id}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono leading-relaxed">{alert.desc}</p>
                    </div>
                  </div>

                  {isCritical && (
                    <div className="mt-2 pt-2 border-t border-red-500/30 bg-red-950/30 p-2 rounded relative z-10">
                      <div className="text-[9px] font-mono text-red-400 uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
                        <BrainCircuit size={10} />
                        Automated Evasive Maneuver
                      </div>
                      <p className="text-[10px] font-mono text-red-200 leading-relaxed">
                        Recommend retrograde burn of <span className="text-white font-bold">{deltaV} m/s</span> to lower periapsis by 4km and bypass conjunction zone.
                      </p>
                      <button className="mt-2 w-full py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-400 font-bold uppercase tracking-widest text-[10px] rounded transition-colors flex items-center justify-center gap-2">
                        Authorize Burn
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
