"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { SatelliteProvider } from "@/contexts/SatelliteContext";
import { ConjunctionProvider } from "@/contexts/ConjunctionContext";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SatelliteProvider>
      <ConjunctionProvider>
        <div className="flex h-screen bg-black text-cyan-50 overflow-hidden selection:bg-cyan-500/30 font-sans">
          {/* Cinematic Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-black to-black z-0 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-0 pointer-events-none" />
          
          {/* Left Sidebar */}
          <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
            <TopNavbar onMenuClick={() => setMobileMenuOpen(true)} />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-black">
              {children}
            </main>
          </div>
        </div>
      </ConjunctionProvider>
    </SatelliteProvider>
  );
}
