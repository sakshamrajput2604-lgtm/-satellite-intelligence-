"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Activity, Menu, WifiOff } from "lucide-react";
import { useSatellites } from "@/contexts/SatelliteContext";

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const { error, lastUpdate, satellites } = useSatellites();
  const [timeSinceUpdate, setTimeSinceUpdate] = useState("Just now");

  // Format time since last update
  useEffect(() => {
    if (!lastUpdate) return;
    
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
      if (seconds < 2) setTimeSinceUpdate("Live");
      else setTimeSinceUpdate(`${seconds}s ago`);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const searchResults = satellites
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.norad.includes(searchQuery))
    .slice(0, 5);

  return (
    <header className="h-16 bg-black/60 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between px-4 md:px-6 z-50 sticky top-0">
      
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden text-cyan-500 hover:text-cyan-300 transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="max-w-md w-full relative group hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Search className={`h-4 w-4 transition-colors ${searchFocused ? 'text-cyan-400' : 'text-cyan-500/50'}`} />
          </div>
          <input 
            type="text" 
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query orbital catalog (NORAD ID)..." 
            className="w-full bg-cyan-950/20 border border-cyan-900/50 focus:border-cyan-500/50 rounded-lg pl-10 pr-4 py-2 text-sm text-cyan-100 placeholder-cyan-500/40 outline-none transition-all shadow-[inset_0_0_10px_rgba(34,211,238,0.05)] focus:shadow-[inset_0_0_15px_rgba(34,211,238,0.1)] relative z-10"
          />
          <AnimatePresence>
            {searchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 left-0 w-full bg-black/90 border border-cyan-500/30 rounded-lg p-2 shadow-2xl backdrop-blur-xl z-50"
              >
                <div className="text-xs font-mono text-cyan-500/70 p-2 uppercase tracking-wider border-b border-cyan-900/50 mb-2">
                  {searchQuery ? 'Search Results' : 'Recent Queries'}
                </div>
                {searchResults.length > 0 ? searchResults.map((sat) => (
                   <div 
                     key={sat.id} 
                     onClick={() => {
                       setSearchFocused(false);
                       setSearchQuery("");
                       router.push('/dashboard/satellites');
                     }}
                     className="p-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-300 rounded cursor-pointer transition-colors flex justify-between"
                   >
                     <span>{sat.name}</span>
                     <span className="text-xs font-mono text-cyan-500/50">{sat.norad}</span>
                   </div>
                )) : (
                   <div className="p-2 text-sm text-slate-500 italic">No satellites found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6 relative">
        
        {/* Live System Status */}
        <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border ${error ? 'border-red-500/30 bg-red-950/30' : 'border-cyan-500/30 bg-cyan-950/30'}`}>
          {!error ? (
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-cyan-400 cyber-glow-box"
            />
          ) : (
            <WifiOff size={12} className="text-red-400" />
          )}
          <span className={`text-[10px] font-mono tracking-widest uppercase ${error ? 'text-red-400' : 'text-cyan-400'}`}>
            {error ? 'API Offline' : `Uplink Nominal (${timeSinceUpdate})`}
          </span>
        </div>

        {/* AI Status */}
        <div className="hidden md:flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400">AI Core</span>
        </div>

        <div className="hidden md:block h-6 w-[1px] bg-cyan-500/20" />

        {/* Icons */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative text-cyan-500 hover:text-cyan-300 transition-colors"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full cyber-glow-box" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-10 right-0 w-80 bg-black/95 border border-cyan-500/30 rounded-lg shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-cyan-900/50 bg-cyan-950/20">
                    <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">System Alerts</h3>
                  </div>
                  <div className="p-2 space-y-1">
                    <div 
                      onClick={() => { setShowNotifications(false); router.push('/dashboard/alerts'); }}
                      className="p-3 hover:bg-cyan-900/20 rounded border-l-2 border-red-500 cursor-pointer"
                    >
                      <div className="text-xs font-bold text-red-400 mb-1">CONJUNCTION WARNING</div>
                      <div className="text-xs text-slate-400">ISS (ZARYA) and COSMOS DEBRIS closing distance.</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">2 mins ago</div>
                    </div>
                    <div 
                      onClick={() => { setShowNotifications(false); router.push('/dashboard/predictions'); }}
                      className="p-3 hover:bg-cyan-900/20 rounded border-l-2 border-yellow-500 cursor-pointer"
                    >
                      <div className="text-xs font-bold text-yellow-400 mb-1">ORBITAL DECAY</div>
                      <div className="text-xs text-slate-400">STARLINK-3211 altitude dropped below nominal threshold.</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">15 mins ago</div>
                    </div>
                    <div 
                      onClick={() => setShowNotifications(false)}
                      className="p-3 hover:bg-cyan-900/20 rounded border-l-2 border-cyan-500 cursor-pointer"
                    >
                      <div className="text-xs font-bold text-cyan-400 mb-1">SYSTEM UPDATE</div>
                      <div className="text-xs text-slate-400">CelesTrak catalog synchronized successfully.</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">1 hour ago</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-900 transition-colors"
            >
              <User size={16} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-10 right-0 w-64 bg-black/95 border border-cyan-500/30 rounded-lg shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-cyan-900/50 bg-cyan-950/20">
                    <div className="text-sm font-bold text-white">Commander Shepard</div>
                    <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mt-1">Level 5 Clearance</div>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { setShowProfile(false); router.push('/dashboard/settings'); }}
                      className="w-full text-left p-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-300 rounded transition-colors"
                    >
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => { setShowProfile(false); router.push('/dashboard/settings'); }}
                      className="w-full text-left p-2 text-sm text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-300 rounded transition-colors"
                    >
                      API Keys
                    </button>
                    <button 
                      onClick={() => { document.cookie = "auth_token=; path=/; max-age=0"; window.location.href = '/login'; }}
                      className="w-full text-left p-2 text-sm text-red-400 hover:bg-red-950/30 rounded transition-colors mt-2 border-t border-red-900/30"
                    >
                      Lock Terminal (Sign Out)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </header>
  );
}
