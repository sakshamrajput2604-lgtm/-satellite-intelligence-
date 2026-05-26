"use client";

import React from "react";
import { Html } from "@react-three/drei";
import { LiveSatelliteData } from "@/lib/satellite-engine";
import { X, Activity } from "lucide-react";

export function GlobeOverlay({ 
  satellite, 
  onClose 
}: { 
  satellite: LiveSatelliteData, 
  onClose: () => void 
}) {
  return (
    <Html position={[0, 0, 0]} zIndexRange={[100, 0]} center>
      <div className="w-64 bg-black/90 backdrop-blur-md border border-cyan-500/50 rounded-lg p-4 shadow-[0_0_20px_rgba(34,211,238,0.2)] select-none animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest mb-1">{satellite.type}</div>
            <h4 className="text-white font-bold tracking-tight text-sm truncate max-w-[160px]">{satellite.name}</h4>
          </div>
          <button onClick={onClose} className="text-cyan-500 hover:text-cyan-300">
            <X size={14} />
          </button>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-mono">NORAD</span>
            <span className="text-cyan-100 font-mono">{satellite.norad}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-mono">Altitude</span>
            <span className="text-cyan-100 font-mono">{satellite.altitude.toFixed(0)} km</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-mono">Velocity</span>
            <span className="text-cyan-100 font-mono">{satellite.velocity.toFixed(2)} km/s</span>
          </div>
        </div>

        <div className="pt-3 border-t border-cyan-900/50 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className={satellite.status === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'} />
            <span className={`text-[10px] font-mono uppercase ${satellite.status === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'}`}>
              {satellite.status}
            </span>
          </div>
          <button className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded hover:bg-cyan-900/30 transition-colors">
            DETAILS
          </button>
        </div>
      </div>
    </Html>
  );
}
