"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export function GlassCard({
  children,
  className,
  glowOnHover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={glowOnHover ? { y: -4 } : {}}
      className={cn(
        "glass-panel p-8 relative overflow-hidden group transition-all duration-300",
        glowOnHover && "hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:subtle-glow",
        className
      )}
      {...props}
    >
      {children}
      {glowOnHover && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </motion.div>
  );
}
