"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlobeCanvas } from "@/components/canvas/Globe";

export function GlobePreviewSection() {
  return (
    <section className="relative py-32 bg-background overflow-hidden border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8 z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Global <br/> <span className="text-primary">Visualization.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              A clean, interactive 3D visualization of orbital paths. Our dashboard helps you monitor asset locations and trajectories clearly, without unnecessary complexity.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-6">
              {[
                { label: "Active View", val: "Global" },
                { label: "Data Source", val: "Telemetry" },
                { label: "Interface", val: "Interactive" }
              ].map((stat, i) => (
                <div key={i} className="glass-panel px-8 py-5 flex flex-col gap-2 min-w-[160px]">
                  <span className="text-primary text-xl md:text-2xl font-semibold">{stat.val}</span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3D Globe Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 w-full relative"
          >
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
            <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-[600px] mx-auto rounded-full overflow-hidden border border-slate-800 shadow-2xl">
              <GlobeCanvas />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
