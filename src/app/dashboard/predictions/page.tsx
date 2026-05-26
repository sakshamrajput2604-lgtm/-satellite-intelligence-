"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, Activity, Orbit, Skull } from "lucide-react";
import { useSatellites } from "@/contexts/SatelliteContext";
import { generateDecayPredictions } from "@/lib/prediction-engine";

export default function PredictionsPage() {
  const { satellites, isLoading } = useSatellites();

  const predictions = useMemo(() => {
    return generateDecayPredictions(satellites);
  }, [satellites]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <Activity className="w-12 h-12 text-cyan-500/50 mb-4 animate-pulse" />
        <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm animate-pulse">Running AI Forecast Models...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <TrendingDown className="text-cyan-500 w-8 h-8" />
            Orbital Decay Forecast
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm">
            AI-powered atmospheric drag simulation. Forecasting orbital decay rates and predicting precise atmospheric re-entry dates for low earth orbit objects.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="cyber-panel border-cyan-500/30 bg-cyan-500/5 p-4 min-w-[120px] text-center">
            <div className="text-3xl font-bold text-cyan-400 cyber-glow-text">{predictions.length}</div>
            <div className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest mt-1">Objects Monitored</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {predictions.map((pred, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={pred.id}
                className="cyber-panel p-6 border-cyan-900/50 bg-black/40 hover:border-cyan-500/50 transition-colors group relative overflow-hidden"
              >
                {/* Imminent Re-entry Warning Background */}
                {pred.predictedReentryDays < 10 && (
                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-lg font-bold text-white truncate max-w-[200px]">{pred.name}</h3>
                    <span className="text-xs font-mono text-cyan-500/50">NORAD: {pred.norad}</span>
                  </div>
                  <div className={`p-2 rounded ${pred.predictedReentryDays < 10 ? 'bg-red-500/10 text-red-400' : 'bg-cyan-950/30 text-cyan-400'}`}>
                    {pred.predictedReentryDays < 10 ? <Skull size={16} /> : <Orbit size={16} />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                  <div className="bg-cyan-950/20 rounded p-3 border border-cyan-900/30">
                    <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Current ALT</div>
                    <div className="text-xl font-mono text-slate-200">{pred.currentAlt.toFixed(1)} <span className="text-xs text-slate-500">km</span></div>
                  </div>
                  <div className="bg-cyan-950/20 rounded p-3 border border-cyan-900/30">
                    <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">AI Confidence</div>
                    <div className="text-xl font-mono text-emerald-400">{pred.confidence.toFixed(1)} <span className="text-xs text-emerald-600">%</span></div>
                  </div>
                </div>

                {/* Graph Mockup */}
                <div className="h-24 relative mb-4 flex items-end">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path 
                      d={`M0,20 Q50,${20 + (100 - pred.predictedReentryDays)} 100,100`} 
                      fill="none" 
                      stroke={pred.predictedReentryDays < 10 ? '#f87171' : '#22d3ee'} 
                      strokeWidth="2" 
                      className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    />
                    {/* Grid lines */}
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#00f0ff" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#00f0ff" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="0" y1="75" x2="100" y2="75" stroke="#00f0ff" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2,2" />
                  </svg>
                  <div className="absolute top-0 right-0 text-[10px] font-mono text-slate-500">Decay Curve</div>
                </div>

                <div className="flex justify-between items-end border-t border-cyan-900/30 pt-4 relative z-10">
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Est. Re-entry</div>
                    <div className={`text-2xl font-bold font-mono ${pred.predictedReentryDays < 10 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {pred.predictedReentryDays} <span className="text-sm font-sans text-slate-400 font-normal">Days</span>
                    </div>
                  </div>
                  <button className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                    View Details →
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
