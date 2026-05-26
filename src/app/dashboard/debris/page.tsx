"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, Search, Filter } from "lucide-react";

const debrisData = Array.from({ length: 42 }).map((_, i) => ({
  id: `DEB-${1000 + i}`,
  origin: ["Cosmos-2251 Debris", "Fengyun-1C Debris", "Delta II Stage", "Pegasus Upper Stage"][Math.floor(Math.random() * 4)],
  altitude: 350 + Math.random() * 800,
  rcs: 0.01 + Math.random() * 2, // Radar Cross Section (m^2)
  riskLevel: Math.random() > 0.8 ? "CRITICAL" : Math.random() > 0.5 ? "HIGH" : "MODERATE"
})).sort((a, b) => b.altitude - a.altitude);

export default function DebrisMonitoringPage() {
  const [search, setSearch] = useState("");

  const filtered = debrisData.filter(d => 
    d.id.toLowerCase().includes(search.toLowerCase()) || 
    d.origin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-purple-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Trash2 className="text-purple-500 w-8 h-8" />
            Orbital Debris Tracking
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm">
            Monitoring Kessler Syndrome threshold. Tracking micro-debris, fragmented rocket bodies, and non-operational defunct satellites.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="cyber-panel border-purple-500/30 bg-purple-500/5 p-4 min-w-[140px] text-center">
            <div className="text-3xl font-bold text-purple-400 cyber-glow-text">34,192</div>
            <div className="text-[10px] font-mono text-purple-500/70 uppercase tracking-widest mt-1">Tracked Fragments</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kessler Syndrome Gauge */}
        <div className="cyber-panel p-6 border-purple-500/30 bg-black/40 lg:col-span-1">
          <h2 className="text-xs font-mono text-purple-500/70 uppercase tracking-widest mb-6">Threat Assessment</h2>
          
          <div className="flex flex-col items-center justify-center relative py-8">
            <div className="w-48 h-48 rounded-full border-4 border-purple-900/50 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent border-r-transparent rotate-45" />
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 font-mono">68%</div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Kessler Index</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-mono">Density (LEO)</span>
              <span className="text-purple-400 font-mono">0.023 / km³</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-mono">Recent Fragmentations</span>
              <span className="text-red-400 font-mono">2 events (30d)</span>
            </div>
          </div>
        </div>

        {/* Debris Table */}
        <div className="cyber-panel p-6 border-purple-500/30 bg-black/40 lg:col-span-2 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-mono text-purple-500/70 uppercase tracking-widest">High Priority Fragments</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500/50" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-purple-950/20 border border-purple-900/50 rounded pl-9 pr-3 py-1.5 text-sm text-purple-100 placeholder-purple-500/40 outline-none focus:border-purple-500/50 transition-colors w-64"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-900/50 text-xs font-mono text-purple-500/70 uppercase tracking-wider">
                  <th className="pb-3 px-4">Catalog ID</th>
                  <th className="pb-3 px-4">Origin Parent</th>
                  <th className="pb-3 px-4">Altitude</th>
                  <th className="pb-3 px-4">RCS (Size)</th>
                  <th className="pb-3 px-4">Threat</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((item, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      key={item.id}
                      className="border-b border-purple-900/20 hover:bg-purple-900/10 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 text-xs font-mono text-purple-400">{item.id}</td>
                      <td className="py-3 px-4 text-sm text-slate-300">{item.origin}</td>
                      <td className="py-3 px-4 text-sm text-slate-400 font-mono">{item.altitude.toFixed(1)} km</td>
                      <td className="py-3 px-4 text-sm text-slate-400 font-mono">{item.rcs.toFixed(3)} m²</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                          item.riskLevel === 'CRITICAL' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                          item.riskLevel === 'HIGH' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                          'text-purple-400 border-purple-500/30 bg-purple-500/10'
                        }`}>
                          {item.riskLevel}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
