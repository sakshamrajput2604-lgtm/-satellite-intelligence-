"use client";

import React from "react";
import { motion } from "framer-motion";
import { FloatingSatellites } from "@/components/canvas/FloatingSatellites";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { Satellite } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* 3D Background */}
      <FloatingSatellites />

      {/* Radial Gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center max-w-4xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase"
          >
            <Satellite size={14} />
            <span>Omniob Dashboard</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-foreground leading-[1.1]">
            Satellite Tracking & <br className="hidden md:block" />
            <span className="text-primary">Data Analytics</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 font-normal leading-relaxed max-w-3xl">
            A reliable platform for monitoring orbital assets and managing telemetry data. Designed for clarity, performance, and operational efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <GlowingButton variant="primary" href="/dashboard">
              Launch Dashboard
            </GlowingButton>
            <GlowingButton variant="secondary" href="/docs">
              View Documentation
            </GlowingButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
