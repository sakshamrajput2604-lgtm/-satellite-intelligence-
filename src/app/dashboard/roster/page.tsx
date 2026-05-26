"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, UserPlus, KeyRound, Mail, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function RosterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ANALYST");
  const [clearance, setClearance] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, clearance_level: clearance })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Officer registered successfully.");
        setEmail("");
        setPassword("");
        setRole("ANALYST");
        setClearance(1);
      } else {
        setError(data.error || "Failed to register officer.");
      }
    } catch (err) {
      setError("Network error communicating with server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-3">
            <Shield className="text-cyan-500" />
            Personnel Roster Management
          </h1>
          <p className="text-slate-400 font-mono text-sm mt-2">Level 5 Command Authorization Required</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registration Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-panel p-6"
        >
          <div className="flex items-center gap-2 mb-6 text-cyan-400 font-bold uppercase tracking-wider border-b border-cyan-900/50 pb-4">
            <UserPlus size={18} />
            Provision New Officer
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@aerospace.gov"
                className="w-full bg-black/50 border border-cyan-500/30 focus:border-cyan-400 rounded p-2.5 text-cyan-100 font-mono text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <KeyRound size={12} /> Temporary Cryptographic Passcode
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-black/50 border border-cyan-500/30 focus:border-cyan-400 rounded p-2.5 text-cyan-100 font-mono text-sm outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5">Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/30 focus:border-cyan-400 rounded p-2.5 text-cyan-100 font-mono text-sm outline-none transition-colors"
                >
                  <option value="ANALYST">Analyst</option>
                  <option value="ENGINEER">Engineer</option>
                  <option value="COMMANDER">Commander</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5">Clearance Level</label>
                <select 
                  value={clearance}
                  onChange={(e) => setClearance(parseInt(e.target.value))}
                  className="w-full bg-black/50 border border-cyan-500/30 focus:border-cyan-400 rounded p-2.5 text-cyan-100 font-mono text-sm outline-none transition-colors"
                >
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <option key={lvl} value={lvl}>Level {lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-sm font-mono flex items-center gap-2">
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded text-sm font-mono flex items-center gap-2">
                <CheckCircle2 size={16} /> {success}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest rounded transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : 'Authorize Provisioning'}
            </button>
          </form>
        </motion.div>

        {/* Info Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-lg">
            <h3 className="text-cyan-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield size={16} /> Clearance Matrix
            </h3>
            <ul className="space-y-4 font-mono text-sm text-slate-300">
              <li className="flex gap-4">
                <span className="text-cyan-400 font-bold min-w-[80px]">LEVEL 1-2</span>
                <span>Standard analytics and passive observation. No system configuration access.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-yellow-400 font-bold min-w-[80px]">LEVEL 3-4</span>
                <span>Engineering access. Can modify collision thresholds and physics parameters.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-400 font-bold min-w-[80px]">LEVEL 5</span>
                <span>Full command authorization. Required for roster management and system overrides.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
