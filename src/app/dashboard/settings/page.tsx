"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { Settings, Save, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const [threshold, setThreshold] = useState<number>(2.5);
  const [lookahead, setLookahead] = useState<number>(72);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setThreshold(data.settings.collision_threshold);
            setLookahead(data.settings.lookahead_hours);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collision_threshold: threshold, lookahead_hours: lookahead })
      });
      if (res.ok) {
        setMessage("Settings successfully deployed to physics engine.");
      } else {
        setMessage("Failed to deploy settings.");
      }
    } catch (e) {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageTransition className="max-w-4xl mx-auto space-y-6">
        
        <div className="cyber-panel p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-cyan-900/50 pb-4">
            <Settings size={28} className="text-cyan-400" />
            <h1 className="text-2xl font-bold text-cyan-400 tracking-widest uppercase">System Parameters</h1>
          </div>

          {loading ? (
            <div className="text-cyan-500 animate-pulse font-mono">Retrieving encrypted configuration...</div>
          ) : (
            <div className="space-y-8">
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-cyan-100 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={16} className="text-red-400" />
                    Collision Threshold (km)
                  </label>
                  <span className="font-mono text-cyan-400">{threshold} km</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Satellites approaching closer than this threshold will trigger a CRITICAL alert.
                </p>
                <input 
                  type="range" 
                  min="0.5" 
                  max="10.0" 
                  step="0.1"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-cyan-100 uppercase tracking-widest flex items-center gap-2">
                    <Settings size={16} className="text-cyan-400" />
                    Lookahead Prediction (Hours)
                  </label>
                  <span className="font-mono text-cyan-400">{lookahead} hrs</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Time horizon for predictive orbital calculations.
                </p>
                <input 
                  type="range" 
                  min="12" 
                  max="168" 
                  step="12"
                  value={lookahead}
                  onChange={(e) => setLookahead(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-cyan-100 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={16} className="text-purple-400" />
                    Desktop Notifications
                  </label>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Control how often you receive OS-level push notifications for critical alerts.
                </p>
                <select 
                  className="w-full bg-cyan-950/50 border border-cyan-800 text-cyan-100 p-2 rounded outline-none focus:border-cyan-400 font-mono text-sm"
                  defaultValue={typeof window !== "undefined" ? (localStorage.getItem("notification_preference") || "once") : "once"}
                  onChange={(e) => {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("notification_preference", e.target.value);
                      setMessage("Notification preference saved locally.");
                    }
                  }}
                >
                  <option value="once">One-Time Only (Recommended)</option>
                  <option value="all">Every New Alert</option>
                  <option value="muted">Muted (Disabled)</option>
                </select>
              </div>

              <div className="pt-8 border-t border-cyan-900/50 flex items-center justify-between">
                <div className="text-emerald-400 text-sm font-mono">{message}</div>
                <button 
                  onClick={saveSettings}
                  disabled={saving}
                  className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-100 uppercase font-bold tracking-widest rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Deploying..." : "Apply Parameters"}
                </button>
              </div>

            </div>
          )}
        </div>

      </PageTransition>
    </DashboardLayout>
  );
}
