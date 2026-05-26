"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GlowingButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  href?: string;
}

export function GlowingButton({
  children,
  className,
  variant = "primary",
  href,
  ...props
}: GlowingButtonProps) {
  
  const baseClasses = cn(
    "relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium rounded-lg transition-all duration-300",
    variant === "primary"
      ? "bg-primary text-white border border-transparent shadow-md hover:bg-primary-hover hover:shadow-lg hover:subtle-glow"
      : "bg-transparent text-foreground border border-slate-600 hover:bg-slate-800 hover:border-slate-500",
    className
  );

  const MotionLink = motion(Link);

  if (href) {
    return (
      <MotionLink
        href={href}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={baseClasses}
      >
        <span className="relative z-10">{children}</span>
      </MotionLink>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={baseClasses}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
