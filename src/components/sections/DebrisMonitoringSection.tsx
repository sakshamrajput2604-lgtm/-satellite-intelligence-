"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle } from "lucide-react";

export function DebrisMonitoringSection() {
  return (
    <section className="relative py-32 bg-background border-t border-slate-800">
      <div className="container mx-auto px-6 text-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <GlassCard className="border-red-500/20 bg-slate-900 shadow-xl hover:border-red-500/40 p-10 md:p-16 relative overflow-hidden">
            {/* Red alert glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/30 shadow-sm"
              >
                <AlertTriangle className="text-red-500 w-8 h-8" />
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
                Proximity Monitoring
              </h2>
              <p className="text-slate-400 max-w-2xl text-lg mb-12 leading-relaxed">
                Connect to standard catalog data to monitor surrounding objects. Set custom thresholds and receive alerts when objects enter your defined safety radius.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-left">
                {[
                  { label: "Data Source", val: "Public Catalog" },
                  { label: "Alert Types", val: "Configurable" },
                  { label: "Monitoring", val: "Continuous" },
                  { label: "Reporting", val: "Automated" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 shadow-inner">
                    <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">{stat.label}</div>
                    <div className="text-lg md:text-xl font-mono text-slate-200">{stat.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </section>
  );
}
