"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Satellite, 
  BrainCircuit, 
  ShieldAlert, 
  Target, 
  BarChart2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Satellites", href: "/dashboard/satellites", icon: Satellite },
  { name: "Predictions", href: "/dashboard/predictions", icon: BrainCircuit },
  { name: "Collision Alerts", href: "/dashboard/alerts", icon: ShieldAlert },
  { name: "Debris Monitoring", href: "/dashboard/debris", icon: Target },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Command Roster", href: "/dashboard/roster", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean, setMobileMenuOpen: (v: boolean) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const SidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-4 border-b border-cyan-500/20">
        {(!collapsed || mobileMenuOpen) && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center gap-2 text-cyan-400 font-bold tracking-widest text-sm"
          >
            <Satellite size={18} />
            <span className="cyber-glow-text">OMNIOB_OS</span>
          </motion.div>
        )}
        {collapsed && !mobileMenuOpen && (
          <div className="w-full flex justify-center text-cyan-400">
            <Satellite size={20} />
          </div>
        )}
        
        {/* Mobile close button */}
        {mobileMenuOpen && (
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-cyan-500">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-300 group relative",
                  isActive 
                    ? "bg-cyan-500/10 text-cyan-400 cyber-glow-box border border-cyan-500/30" 
                    : "text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-r-md cyber-glow-box"
                  />
                )}
                <Icon size={20} className={cn("shrink-0", isActive ? "cyber-glow-text" : "")} />
                {(!collapsed || mobileMenuOpen) && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Desktop collapse toggle */}
      <div className="hidden md:flex p-4 border-t border-cyan-500/20 justify-center">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: collapsed ? 80 : 260 }}
        className="hidden md:flex h-screen bg-black/80 backdrop-blur-xl border-r border-cyan-500/20 flex-col relative z-20 shrink-0 shadow-[4px_0_24px_rgba(34,211,238,0.05)]"
      >
        {SidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          >
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-[260px] h-full bg-black/95 border-r border-cyan-500/20 flex flex-col shadow-[4px_0_24px_rgba(34,211,238,0.1)]"
            >
              {SidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
