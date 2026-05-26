"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, User, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        // Server successfully set the HTTP-only cookie!
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Authentication Failed");
      }
    } catch (err) {
      setError("Network error communicating with authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black z-0" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md cyber-panel p-8 relative z-10 border-cyan-500/50"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Department of Defense</h1>
          <h2 className="text-xs font-mono text-cyan-500/70 mt-1 uppercase tracking-widest">Aerospace Intelligence Gateway</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <User size={12} /> Officer Identification (Email)
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="commander@aerospace.gov"
              className="w-full bg-black/50 border border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] rounded p-4 text-cyan-100 font-mono tracking-wider outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <KeyRound size={12} /> Cryptographic Passcode
            </label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className={`w-full bg-black/50 border ${error ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] text-red-500' : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] text-cyan-100'} rounded p-4 font-mono tracking-widest outline-none transition-all`}
              />
              {error && (
                <div className="absolute -bottom-6 left-0 right-0 text-center text-xs font-mono text-red-500 uppercase font-bold">
                  {error}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Verifying Hash...' : 'Authenticate'} <Lock size={16} className={`absolute transition-opacity ${isLoading ? 'opacity-0' : 'group-hover:opacity-0'}`} />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-cyan-900/30 pt-6">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest leading-relaxed">
            Warning: Unauthorized access to this system is prohibited by US Code Title 18, Section 1030. All activity is monitored and logged.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
