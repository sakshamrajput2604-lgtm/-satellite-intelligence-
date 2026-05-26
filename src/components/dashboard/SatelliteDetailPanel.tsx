"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Satellite, Activity, Crosshair, Navigation, Database } from "lucide-react";
import { LiveSatelliteData } from "@/lib/satellite-engine";

export function SatelliteDetailPanel({ 
  satellite, 
  onClose 
}: { 
  satellite: LiveSatelliteData | null, 
  onClose: () => void 
}) {
  return (
    <AnimatePresence>
      {satellite && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/90 border-l border-cyan-500/30 shadow-[-10px_0_30px_rgba(34,211,238,0.1)] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-cyan-500/20 bg-cyan-950/20 flex justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Satellite size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 uppercase">
                    {satellite.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{satellite.name}</h2>
                <div className="text-xs font-mono text-cyan-500/70">NORAD: {satellite.norad}</div>
              </div>
              <button 
                onClick={onClose}
                className="relative z-10 p-2 rounded-full hover:bg-cyan-500/20 text-cyan-500 hover:text-cyan-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent space-y-6">
              
              {/* Telemetry Grid */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity size={14} /> Telemetry Stream
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cyan-950/20 border border-cyan-900/30 rounded p-3">
                    <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Altitude</div>
                    <div className="text-lg text-cyan-100 font-mono">{satellite.altitude.toFixed(2)} <span className="text-xs text-slate-500">km</span></div>
                  </div>
                  <div className="bg-cyan-950/20 border border-cyan-900/30 rounded p-3">
                    <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Velocity</div>
                    <div className="text-lg text-cyan-100 font-mono">{satellite.velocity.toFixed(3)} <span className="text-xs text-slate-500">km/s</span></div>
                  </div>
                  <div className="bg-cyan-950/20 border border-cyan-900/30 rounded p-3">
                    <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Latitude</div>
                    <div className="text-lg text-cyan-100 font-mono">{satellite.latitude.toFixed(4)}°</div>
                  </div>
                  <div className="bg-cyan-950/20 border border-cyan-900/30 rounded p-3">
                    <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Longitude</div>
                    <div className="text-lg text-cyan-100 font-mono">{satellite.longitude.toFixed(4)}°</div>
                  </div>
                </div>
              </div>

              {/* Orbital Intelligence */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Crosshair size={14} /> Intelligence
                </h3>
                <div className="space-y-3">
                  <div className="bg-cyan-950/20 border border-cyan-900/30 rounded p-4 flex justify-between items-center">
                    <span className="text-sm text-slate-400">Health Assessment</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${satellite.health}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-emerald-400">{satellite.health}%</span>
                    </div>
                  </div>
                  
                  <div className="bg-cyan-950/20 border border-cyan-900/30 rounded p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Orbit Type</span>
                      <span className="text-xs font-mono text-cyan-300 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-700/50">
                        {satellite.orbitType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-cyan-900/30">
                      <span className="text-sm text-slate-400">Status</span>
                      <span className="text-xs font-mono text-emerald-400">{satellite.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw TLE Data */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Database size={14} /> TLE Elements
                </h3>
                <div className="bg-black border border-cyan-900/50 rounded p-3 overflow-x-auto">
                  <pre className="text-[10px] font-mono text-cyan-500/70 leading-relaxed whitespace-pre">
{satellite.line1}
{satellite.line2}
                  </pre>
                </div>
              </div>

              {/* Trajectory Map Placeholder */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Navigation size={14} /> Trajectory
                </h3>
                <div className="h-32 bg-cyan-950/20 border border-cyan-900/30 rounded flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Equirectangular_projection_SW.jpg')] bg-cover bg-center opacity-20 sepia hue-rotate-[180deg] saturate-200 group-hover:scale-105 transition-transform duration-700" />
                  <span className="relative z-10 text-xs font-mono text-cyan-500 bg-black/60 px-2 py-1 rounded backdrop-blur">Map Module Offline</span>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
