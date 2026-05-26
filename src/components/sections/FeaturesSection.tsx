"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Activity, Brain, ShieldAlert, Orbit, Target } from "lucide-react";

const features = [
  {
    icon: <Activity className="text-primary w-6 h-6" />,
    title: "Asset Tracking",
    description: "Monitor the position and status of your orbital assets in real-time."
  },
  {
    icon: <Brain className="text-primary w-6 h-6" />,
    title: "Trajectory Analysis",
    description: "Analyze historical data to forecast satellite positioning and decay."
  },
  {
    icon: <ShieldAlert className="text-primary w-6 h-6" />,
    title: "Proximity Alerts",
    description: "Automated early warning systems for potential conjunctions."
  },
  {
    icon: <Orbit className="text-primary w-6 h-6" />,
    title: "Orbital Analytics",
    description: "Historical data analysis, maneuver logs, and reporting tools."
  },
  {
    icon: <Target className="text-primary w-6 h-6" />,
    title: "Debris Monitoring",
    description: "Access shared catalog data to monitor surrounding space debris."
  }
];

export function FeaturesSection() {
  return (
    <section className="relative py-32 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground"
          >
            Core <span className="text-primary">Capabilities</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg leading-relaxed"
          >
            A comprehensive suite of tools designed to help you manage telemetry data, track assets, and ensure operational safety.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={i === 4 ? "md:col-span-2 lg:col-span-1" : ""} // span adjustments for odd number
            >
              <GlassCard className="h-full flex flex-col gap-5 p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
