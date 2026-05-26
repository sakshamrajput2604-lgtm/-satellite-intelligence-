"use client";

import React, { useMemo } from "react";
import { Activity, ShieldAlert, AlertTriangle, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useSatellites } from "@/contexts/SatelliteContext";

export function AnalyticsCards() {
  const { satellites, isLoading } = useSatellites();

  const metrics = useMemo(() => {
    if (satellites.length === 0) return {
      active: 0,
      highRisk: 0,
      collision: 0,
      debris: 0
    };

    return {
      active: satellites.length,
      highRisk: satellites.filter(s => s.status === 'WARNING').length,
      collision: satellites.filter(s => s.status === 'CRITICAL').length,
      debris: satellites.filter(s => s.type.toLowerCase().includes('debris')).length || Math.floor(satellites.length * 0.05) // Mock debris if not explicitly in feed
    };
  }, [satellites]);

  const cards = [
    {
      title: "Active Catalog",
      value: isLoading ? "..." : metrics.active.toLocaleString(),
      change: "+12",
      icon: Activity,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30"
    },
    {
      title: "High Risk Orbits",
      value: isLoading ? "..." : metrics.highRisk.toLocaleString(),
      change: "+2",
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30"
    },
    {
      title: "Critical Warnings",
      value: isLoading ? "..." : metrics.collision.toLocaleString(),
      change: "-1",
      icon: ShieldAlert,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30"
    },
    {
      title: "Tracked Debris",
      value: isLoading ? "..." : metrics.debris.toLocaleString(),
      change: "+45",
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={card.title}
          className={`cyber-panel p-5 relative overflow-hidden group border ${card.border}`}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon size={20} className={card.color} />
            </div>
            <span className={`text-xs font-mono px-2 py-1 rounded bg-black/40 border ${card.border} ${
              card.change.startsWith('+') ? 'text-emerald-400' : 'text-cyan-400'
            }`}>
              {card.change}
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1">{card.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold tracking-tight ${card.color} cyber-glow-text`}>
                {card.value}
              </span>
            </div>
          </div>
          
          {/* Subtle sparkline mockup */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 pointer-events-none flex items-end">
             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,100 L0,80 L20,60 L40,75 L60,30 L80,45 L100,10 L100,100 Z" fill="currentColor" className={card.color} />
             </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
