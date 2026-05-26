"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Shield, AlertTriangle, CheckCircle, Search, ChevronLeft, ChevronRight, Satellite } from "lucide-react";
import { useSatellites } from "@/contexts/SatelliteContext";
import { LiveSatelliteData, SatStatus } from "@/lib/satellite-engine";
import { SatelliteDetailPanel } from "./SatelliteDetailPanel";

export function SatelliteTable({ limit }: { limit?: number }) {
  const { satellites, isLoading, error } = useSatellites();
  const [sortConfig, setSortConfig] = useState<{ key: keyof LiveSatelliteData, direction: 'asc'|'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSatellite, setSelectedSatellite] = useState<LiveSatelliteData | null>(null);
  const itemsPerPage = limit || 15;

  const sortData = (key: keyof LiveSatelliteData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    let result = [...satellites];

    // 1. Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(sat => 
        sat.name.toLowerCase().includes(q) || 
        sat.norad.includes(q)
      );
    }

    // 2. Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [satellites, searchQuery, sortConfig]);

  // 3. Paginate
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusIcon = (status: SatStatus) => {
    switch(status) {
      case "NOMINAL": return <CheckCircle size={14} className="text-emerald-400" />;
      case "WARNING": return <AlertTriangle size={14} className="text-yellow-400" />;
      case "CRITICAL": return <Shield size={14} className="text-red-400" />;
    }
  };

  const getStatusColor = (status: SatStatus) => {
    switch(status) {
      case "NOMINAL": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
      case "WARNING": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "CRITICAL": return "text-red-400 bg-red-400/10 border-red-400/30 cyber-glow-box";
    }
  };

  if (error) {
    return (
      <div className="cyber-panel p-6 flex flex-col items-center justify-center h-full text-red-400 font-mono text-sm border-red-500/30">
        <Shield className="mb-2 w-8 h-8 opacity-50" />
        DATA FEED ERROR: {error}
      </div>
    );
  }

  return (
    <div className="cyber-panel p-4 md:p-6 flex flex-col h-full relative">
      {isLoading && satellites.length === 0 && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Satellite className="text-cyan-500 w-8 h-8 mb-4" />
          </motion.div>
          <span className="text-cyan-400 font-mono text-sm animate-pulse tracking-widest uppercase">Initializing Telemetry Stream...</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2">
          Active Telemetry Stream
          {satellites.length > 0 && <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />}
        </h2>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
            <input 
              type="text" 
              placeholder="Filter by Name or ID..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full bg-cyan-950/30 border border-cyan-900/50 rounded pl-9 pr-3 py-1.5 text-sm text-cyan-100 placeholder-cyan-500/40 outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="hidden sm:block text-xs font-mono text-cyan-500/70 bg-cyan-950/30 px-3 py-1.5 rounded border border-cyan-900/50 whitespace-nowrap">
            {filteredData.length} Objects
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-cyan-900/50 text-xs font-mono text-cyan-500/70 uppercase tracking-wider">
              {[
                { label: 'Name', key: 'name' },
                { label: 'NORAD', key: 'norad' },
                { label: 'Altitude', key: 'altitude' },
                { label: 'Velocity', key: 'velocity' },
                { label: 'Health', key: 'health' },
                { label: 'Status', key: 'status' },
                { label: 'Orbit', key: 'orbitType' }
              ].map((col) => (
                <th 
                  key={col.key} 
                  className="pb-3 px-4 cursor-pointer hover:text-cyan-300 transition-colors group"
                  onClick={() => sortData(col.key as keyof LiveSatelliteData)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    <ArrowUpDown size={12} className={`opacity-30 group-hover:opacity-100 transition-opacity ${sortConfig?.key === col.key ? 'text-cyan-400 opacity-100' : ''}`} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {displayData.map((sat, i) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key={sat.id}
                  onClick={() => setSelectedSatellite(sat)}
                  className="border-b border-cyan-900/20 hover:bg-cyan-900/10 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-4 text-sm font-medium text-cyan-100 group-hover:text-cyan-400 transition-colors whitespace-nowrap max-w-[200px] truncate">
                    {sat.name}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-400">{sat.norad}</td>
                  <td className="py-3 px-4 text-sm text-slate-300 font-mono">{sat.altitude.toFixed(1)} km</td>
                  <td className="py-3 px-4 text-sm text-slate-300 font-mono">{sat.velocity.toFixed(2)} km/s</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${sat.health > 90 ? 'bg-emerald-400' : sat.health > 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${sat.health}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-400">{sat.health}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${getStatusColor(sat.status)}`}>
                      {getStatusIcon(sat.status)}
                      {sat.status}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-500">{sat.orbitType}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {displayData.length === 0 && !isLoading && (
          <div className="py-12 text-center text-slate-500 font-mono text-sm">
            No telemetry data found matching query.
          </div>
        )}
      </div>

      {/* Pagination */}
      {!limit && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cyan-900/30">
          <span className="text-xs font-mono text-slate-500">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded bg-cyan-950/30 border border-cyan-900/50 text-cyan-400 disabled:opacity-30 hover:bg-cyan-900/50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded bg-cyan-950/30 border border-cyan-900/50 text-cyan-400 disabled:opacity-30 hover:bg-cyan-900/50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      <SatelliteDetailPanel 
        satellite={selectedSatellite} 
        onClose={() => setSelectedSatellite(null)} 
      />
    </div>
  );
}
