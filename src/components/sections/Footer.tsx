import React from "react";
import { Satellite } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-3 text-primary font-bold text-xl tracking-tight">
              <Satellite size={28} />
              <span>OMNIOB</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              A comprehensive platform for satellite tracking and orbital analytics.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-foreground">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {['Live Tracker', 'AI Predictions', 'Debris Monitoring', 'API Access', 'Enterprise'].map((item) => (
                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {['Documentation', 'Developer Portal', 'Case Studies', 'Blog', 'Status'].map((item) => (
                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {['About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 font-medium">
          <div>© {new Date().getFullYear()} Omniob Inc. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
