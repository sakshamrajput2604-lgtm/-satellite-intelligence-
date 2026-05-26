"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Crosshair, AlertTriangle, AlertOctagon } from "lucide-react";
import { ConjunctionAlert } from "@/lib/prediction-engine"; // Re-use type for simplicity

export default function CollisionAlertsPage() {
  const [alerts, setAlerts] = useState<ConjunctionAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPhysicsEngine() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/conjunctions");
        const json = await res.json();
        setAlerts(json.alerts || []);
      } catch (err) {
        console.error("Failed to fetch from Python Physics Engine:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPhysicsEngine();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchPhysicsEngine, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-12 h-12 text-red-500/50 mb-4 animate-pulse" />
        <span className="text-red-400 font-mono tracking-widest uppercase text-sm animate-pulse">Initializing Collision Avoidance Matrix...</span>
      </div>
    );
  }

  const criticalCount = alerts.filter(a => a.urgency === "CRITICAL").length;

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-red-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldAlert className="text-red-500 w-8 h-8" />
            Conjunction Alerts
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm">
            Real-time orbital conjunction assessment matrix. AI engine predicts close-approach events and calculates probability of collision (Pc) based on current telemetry vectors.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="cyber-panel border-red-500/30 bg-red-500/5 p-4 min-w-[120px] text-center">
            <div className="text-3xl font-bold text-red-400 cyber-glow-text">{criticalCount}</div>
            <div className="text-[10px] font-mono text-red-500/70 uppercase tracking-widest mt-1">Critical Events</div>
          </div>
          <div className="cyber-panel border-yellow-500/30 bg-yellow-500/5 p-4 min-w-[120px] text-center">
            <div className="text-3xl font-bold text-yellow-400">{alerts.length - criticalCount}</div>
            <div className="text-[10px] font-mono text-yellow-500/70 uppercase tracking-widest mt-1">High Risk</div>
          </div>
        </div>
      </div>

      {/* Main Alerts List */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-transparent">
        <div className="grid gap-4">
          <AnimatePresence>
            {alerts.map((alert, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={alert.id}
                className={`cyber-panel p-5 relative overflow-hidden group border ${
                  alert.urgency === 'CRITICAL' ? 'border-red-500/50 bg-red-950/20' : 'border-yellow-500/30 bg-yellow-950/10'
                }`}
              >
                {/* Warning Stripes Background */}
                <div className={`absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] ${
                  alert.urgency === 'CRITICAL' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />

                <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between relative z-10">
                  
                  {/* Object Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {alert.urgency === 'CRITICAL' ? (
                        <AlertOctagon className="text-red-500 w-5 h-5 animate-pulse" />
                      ) : (
                        <AlertTriangle className="text-yellow-500 w-5 h-5" />
                      )}
                      <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                        alert.urgency === 'CRITICAL' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                      }`}>
                        {alert.urgency} SEVERITY
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex-1">
                        <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Target Object</div>
                        <div className="text-white font-bold truncate max-w-[200px]">{alert.primaryObject}</div>
                        <div className="text-xs font-mono text-cyan-500/50">ID: {alert.primaryNorad}</div>
                      </div>
                      
                      <div className="flex flex-col items-center px-4">
                        <Crosshair className="text-slate-600 w-6 h-6 mb-1" />
                        <div className="h-[1px] w-12 bg-slate-800" />
                      </div>

                      <div className="flex-1">
                        <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Incoming Threat</div>
                        <div className="text-slate-300 font-bold truncate max-w-[200px]">{alert.secondaryObject}</div>
                        <div className="text-xs font-mono text-red-400/50">ID: {alert.secondaryNorad}</div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex gap-6 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Time to Impact</div>
                      <div className="text-2xl font-bold font-mono text-white">
                        {Math.floor(alert.timeToImpact / 60)}h {alert.timeToImpact % 60}m
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Miss Distance</div>
                      <div className="text-2xl font-bold font-mono text-white">
                        {alert.missDistance} <span className="text-sm text-slate-500">m</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Probability</div>
                      <div className={`text-2xl font-bold font-mono ${alert.probability > 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {alert.probability}%
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button className="flex-1 lg:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs font-mono uppercase tracking-widest transition-colors">
                      Initiate Evasion
                    </button>
                    <button className="flex-1 lg:flex-none px-4 py-2 bg-transparent hover:bg-slate-800 border border-slate-700 rounded text-slate-400 text-xs font-mono uppercase tracking-widest transition-colors">
                      View Trajectory
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {alerts.length === 0 && (
            <div className="text-center py-12 border border-dashed border-emerald-500/30 rounded-lg bg-emerald-500/5">
              <ShieldAlert className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
              <h3 className="text-emerald-400 font-mono uppercase tracking-widest mb-2">Space is clear</h3>
              <p className="text-slate-500 text-sm">No conjunctions detected in the next 72 hours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
