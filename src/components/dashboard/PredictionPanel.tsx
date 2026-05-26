"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Battery, Flame, Activity } from "lucide-react";
import { useConjunctions } from "@/contexts/ConjunctionContext";
import { useSatellites } from "@/contexts/SatelliteContext";
import * as satellite from "satellite.js";

export function PredictionPanel() {
  const { alerts } = useConjunctions();
  const { satellites } = useSatellites();

  const globalRisk = useMemo(() => {
    if (alerts.length === 0) return 0;
    // Map the probability (0-1) to a percentage (0-100)
    return Math.max(...alerts.map(a => a.probability)) * 100;
  }, [alerts]);

  const stats = useMemo(() => {
    if (satellites.length === 0) {
      return { lifespan: 0, decay: 0, battery: 0, thermal: "UNKNOWN", thermalVal: 0 };
    }

    let totalBstar = 0;
    let inSunlight = 0;

    // Approximate sun longitude based on UTC time (sun is at lon 0 at 12:00 UTC)
    const now = new Date();
    const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
    let sunLon = (12 - hours) * 15; 
    if (sunLon > 180) sunLon -= 360;
    if (sunLon < -180) sunLon += 360;

    satellites.forEach(sat => {
      try {
        const rec = satellite.twoline2satrec(sat.line1, sat.line2);
        totalBstar += Math.abs(rec.bstar || 0);
      } catch(e) {}

      // Calculate Day/Night side (Eclipse)
      let lonDiff = Math.abs(sat.longitude - sunLon);
      if (lonDiff > 180) lonDiff = 360 - lonDiff;
      if (lonDiff < 90) inSunlight++;
    });

    const avgBstar = totalBstar / satellites.length;
    
    // Derived Lifespan based on drag (BSTAR)
    const lifespan = Math.max(0.1, 15 - (avgBstar * 50000));
    
    // Decay Rate (m/day)
    const decay = avgBstar * 80000;

    // Solar Illumination / Battery
    const sunPercentage = Math.round((inSunlight / satellites.length) * 100);
    
    return {
      lifespan,
      decay,
      battery: sunPercentage,
      thermal: sunPercentage > 50 ? "WARMING" : "COOLING",
      thermalVal: sunPercentage > 50 ? 80 : 30
    };
  }, [satellites]);

  const predictions = [
    { label: "Lifespan", value: Math.min(100, (stats.lifespan / 15) * 100), text: `${stats.lifespan.toFixed(1)} YRS`, icon: BrainCircuit, color: "text-cyan-400", bg: "stroke-cyan-500" },
    { label: "Decay Rate", value: Math.min(100, (stats.decay / 20) * 100), text: `${stats.decay.toFixed(1)} m/d`, icon: Activity, color: "text-yellow-400", bg: "stroke-yellow-500" },
    { label: "Battery/Sun", value: stats.battery, text: `${stats.battery}%`, icon: Battery, color: "text-emerald-400", bg: "stroke-emerald-500" },
    { label: "Thermal", value: stats.thermalVal, text: stats.thermal, icon: Flame, color: "text-orange-400", bg: "stroke-orange-500" },
  ];

  return (
    <div className="cyber-panel p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 z-10">
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2">
          <BrainCircuit size={18} />
          Live Fleet Diagnostics
        </h2>
        <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest border border-cyan-900/50 px-2 py-0.5 rounded">
          {satellites.length} OBJECTS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {predictions.map((item, i) => (
          <div key={i} className="bg-cyan-950/20 border border-cyan-900/30 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            {/* Circular Progress */}
            <div className="relative w-20 h-20 mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  className="text-slate-800"
                />
                <motion.circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * (item.value || 0)) / 100 }}
                  transition={{ duration: 1.5, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className={`${item.bg} drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <item.icon size={16} className={`${item.color} opacity-80`} />
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-sm font-bold font-mono ${item.color}`}>{item.text}</div>
              <div className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-wider mt-1">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-cyan-900/50">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-mono text-cyan-500/70 uppercase">Global Collision Probability</span>
          <span className="text-sm font-mono text-red-400 font-bold cyber-glow-text">{globalRisk.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, globalRisk)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full cyber-glow-box ${globalRisk > 10 ? 'bg-red-500' : globalRisk > 2 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
          />
        </div>
      </div>
    </div>
  );
}
