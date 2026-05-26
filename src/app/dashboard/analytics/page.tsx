"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart2, Activity, Target } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { useSatellites } from "@/contexts/SatelliteContext";

export default function AnalyticsPage() {
  const { satellites } = useSatellites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate some mock historical data for the Area chart, scaled slightly by live satellite count
  const baseMulti = Math.max(1, satellites.length / 50);
  
  const decayData = [
    { month: 'JAN', starlink: 400 * baseMulti, oneweb: 240, debris: 1200 },
    { month: 'FEB', starlink: 380 * baseMulti, oneweb: 235, debris: 1250 },
    { month: 'MAR', starlink: 390 * baseMulti, oneweb: 230, debris: 1280 },
    { month: 'APR', starlink: 350 * baseMulti, oneweb: 220, debris: 1350 },
    { month: 'MAY', starlink: 310 * baseMulti, oneweb: 215, debris: 1400 },
    { month: 'JUN', starlink: 290 * baseMulti, oneweb: 210, debris: 1450 },
  ];

  // Count live categories
  const categoryCounts = {
    Debris: 0,
    Weather: 0,
    Navigation: 0,
    'Earth Obs': 0,
    'Space Station': 0,
    Other: 0
  };

  satellites.forEach(sat => {
    if (sat.type in categoryCounts) {
      categoryCounts[sat.type as keyof typeof categoryCounts]++;
    } else {
      categoryCounts.Other++;
    }
  });

  const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
    name, count
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart2 className="text-cyan-500 w-8 h-8" />
            Deep Analytics
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm font-mono">
            Macro-level statistics of the orbital environment. Tracking catalog growth, orbit distribution, and telemetry intake efficiency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        {/* Area Chart: Altitude Loss over 6 Months */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-panel p-6 flex flex-col"
        >
          <h2 className="text-sm font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2 mb-6">
            <Activity size={16} />
            Constellation Altitude Degradation
          </h2>
          <div className="flex-1 w-full min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={decayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStarlink" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOneweb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#082f49" vertical={false} />
                  <XAxis dataKey="month" stroke="#0ea5e9" tick={{ fill: '#0ea5e9', fontSize: 12, fontFamily: 'monospace' }} />
                  <YAxis stroke="#0ea5e9" tick={{ fill: '#0ea5e9', fontSize: 12, fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #06b6d4', borderRadius: '4px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="starlink" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorStarlink)" />
                  <Area type="monotone" dataKey="oneweb" stroke="#facc15" strokeWidth={2} fillOpacity={1} fill="url(#colorOneweb)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Bar Chart: Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-panel p-6 flex flex-col"
        >
          <h2 className="text-sm font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2 mb-6">
            <Target size={16} />
            Live Object Classification
          </h2>
          <div className="flex-1 w-full min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#082f49" vertical={false} />
                  <XAxis dataKey="name" stroke="#0ea5e9" tick={{ fill: '#0ea5e9', fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis stroke="#0ea5e9" tick={{ fill: '#0ea5e9', fontSize: 12, fontFamily: 'monospace' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }}
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #06b6d4', borderRadius: '4px', fontFamily: 'monospace' }}
                  />
                  <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
