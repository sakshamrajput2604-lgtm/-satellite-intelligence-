"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export function AIPredictionSection() {
  return (
    <section className="relative py-32 bg-background border-t border-slate-800 overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          
          {/* UI Mockup Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <GlassCard className="p-10 aspect-[4/3] flex flex-col gap-8 relative overflow-hidden group">
              {/* Mock Graph */}
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Estimated Decay</div>
                  <div className="text-3xl font-mono text-primary font-medium">Q4 2032</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Status</div>
                  <div className="text-3xl font-mono text-emerald-400 font-medium">Stable</div>
                </div>
              </div>
              
              <div className="flex-1 relative border-l border-b border-slate-700/50">
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                  <motion.path 
                    d="M 0 150 Q 50 140, 100 120 T 200 80 T 300 30 T 400 10" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="drop-shadow-[0_4px_12px_rgba(79,70,229,0.4)]"
                  />
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="100%" y2="50" stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="100%" y2="100" stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />
                </svg>
              </div>
              
              {/* Scanning effect */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-primary/5 to-transparent z-0"
              />
            </GlassCard>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase">
              Data Modeling
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Data-driven <br/> decay forecasting.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Utilize our data modeling tools to analyze atmospheric drag and historical telemetry, providing estimates for orbital decay and maneuver planning.
            </p>
            <ul className="space-y-4 pt-4">
              {['Telemetry Analysis', 'Drag Forecasting', 'Station-keeping planning'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
