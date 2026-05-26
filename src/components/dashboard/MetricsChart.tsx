"use client";

import React, { useMemo } from 'react';
import { useSatellites } from '@/contexts/SatelliteContext';
import { useConjunctions } from '@/contexts/ConjunctionContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Activity } from 'lucide-react';

const COLORS = ['#22d3ee', '#3b82f6', '#8b5cf6'];

export function MetricsChart() {
  const { satellites } = useSatellites();
  const { alerts } = useConjunctions();

  const orbitData = useMemo(() => {
    let leo = 0, meo = 0, geo = 0;
    satellites.forEach(s => {
      if (s.orbitType === 'LEO') leo++;
      else if (s.orbitType === 'MEO') meo++;
      else geo++;
    });
    return [
      { name: 'LEO (<2000km)', value: leo },
      { name: 'MEO', value: meo },
      { name: 'GEO (>35000km)', value: geo }
    ];
  }, [satellites]);

  const riskData = useMemo(() => {
    const timeBuckets = Array.from({ length: 6 }, (_, i) => ({ time: `T+${i}h`, risk: 0 }));
    alerts.forEach(a => {
      const bucket = Math.min(5, Math.floor(a.timeToImpact));
      timeBuckets[bucket].risk += a.probability * 100;
    });
    return timeBuckets;
  }, [alerts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Orbit Distribution Pie Chart */}
      <div className="cyber-panel p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-cyan-400" />
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Orbit Distribution</h2>
        </div>
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orbitData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {orbitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#22d3ee', color: '#cffafe' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Horizon Area Chart */}
      <div className="cyber-panel p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-red-400" />
          <h2 className="text-sm font-bold text-red-400 uppercase tracking-widest">Conjunction Risk Horizon</h2>
        </div>
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#f87171', color: '#fecaca' }}
                itemStyle={{ color: '#f87171' }}
              />
              <Area type="monotone" dataKey="risk" stroke="#f87171" fillOpacity={1} fill="url(#colorRisk)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
