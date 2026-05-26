"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function AnalyticsDashboardSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-32 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
            Command Center <br/> <span className="text-primary">Dashboard</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            A comprehensive, unified view of all your space assets, telemetry logs, and threat alerts in one professional interface designed for mission operators.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent blur-2xl rounded-2xl opacity-50" />
          
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden aspect-[16/10] flex flex-col shadow-2xl">
            {/* Fake Title Bar */}
            <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-red-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-yellow-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-green-500 transition-colors" />
              </div>
              <div className="mx-auto text-xs text-slate-500 font-semibold tracking-widest">
                OMNIOB_OS_v2.0
              </div>
            </div>
            
            {/* Fake Dashboard Content */}
            <div className="flex-1 p-8 grid grid-cols-3 gap-8 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]">
              
              <div className="col-span-2 flex flex-col gap-8">
                <div className="flex-1 border border-slate-800 bg-slate-950/50 rounded-xl p-5 flex flex-col relative overflow-hidden shadow-inner">
                  <div className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">Global Telemetry Map</div>
                  <div className="flex-1 bg-primary/5 border border-primary/10 rounded-lg relative overflow-hidden">
                     {/* Radar sweep */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute top-1/2 left-1/2 w-full h-full origin-top-left bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                    />
                  </div>
                </div>
                <div className="h-32 grid grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="border border-slate-800 bg-slate-950/50 rounded-xl p-4 flex flex-col justify-between shadow-inner">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System {i}</div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        {mounted && (
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.random() * 50 + 40}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-primary"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-1 flex flex-col gap-6">
                <div className="h-48 border border-slate-800 bg-slate-950/50 rounded-xl p-5 flex flex-col shadow-inner">
                   <div className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">Active Alerts</div>
                   <div className="space-y-3 mt-auto">
                     <div className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-md border border-red-400/20 font-medium">Conjunction warning: SAT-992</div>
                     <div className="text-xs text-yellow-400 bg-yellow-400/10 px-3 py-2 rounded-md border border-yellow-400/20 font-medium">Solar anomaly detected</div>
                   </div>
                </div>
                <div className="flex-1 border border-slate-800 bg-slate-950/50 rounded-xl p-5 flex flex-col shadow-inner">
                  <div className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">Log Stream</div>
                  <div className="flex-1 flex flex-col gap-2.5 overflow-hidden mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)">
                    {mounted && Array.from({length: 6}).map((_, i) => (
                      <div key={i} className="text-xs font-mono text-slate-400 opacity-80">
                        {`> [${new Date().toISOString().split('T')[1].substring(0,8)}] Rx packet x${Math.floor(Math.random() * 1000)}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
