"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Clock, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface SavedAlert {
  id: string;
  primaryObject: string;
  primaryNorad: string;
  secondaryObject: string;
  secondaryNorad: string;
  missDistance: number;
  timeToImpact: number;
  probability: number;
  timestamp: string;
}

export function IncidentHistory() {
  const [history, setHistory] = useState<SavedAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/alerts');
        if (res.ok) {
          const data = await res.json();
          if (data.alerts) setHistory(data.alerts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("AEROSPACE INTELLIGENCE", 14, 20);
    doc.setFontSize(12);
    doc.text("CRITICAL CONJUNCTION INCIDENT REPORT", 14, 28);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);

    const tableData = history.map(alert => [
      new Date(alert.timestamp).toLocaleString(),
      alert.primaryObject,
      alert.secondaryObject,
      `${alert.missDistance} m`,
      `${Math.round(alert.probability * 100)}%`
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Timestamp', 'Primary Object', 'Secondary Object', 'Miss Distance', 'Risk %']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save("aerospace-incident-report.pdf");
  };

  return (
    <div className="cyber-panel p-6 h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-cyan-900/50 pb-4">
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2">
          <Clock size={18} />
          Incident History Log
        </h2>
        <button 
          onClick={exportPDF} 
          className="flex items-center gap-1 text-[10px] font-mono bg-cyan-900/40 text-cyan-400 hover:bg-cyan-900/80 px-2 py-1 rounded transition-colors uppercase"
        >
          <Download size={12} />
          Export Briefing
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-cyan-500/50 text-sm font-mono animate-pulse">Loading secure logs...</div>
        ) : history.length === 0 ? (
          <div className="text-cyan-500/50 text-sm font-mono">No critical incidents recorded.</div>
        ) : (
          history.map((alert) => (
            <div key={`${alert.id}-${alert.timestamp}`} className="bg-red-950/20 border border-red-900/50 p-3 rounded flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-red-500" />
                <div>
                  <div className="text-red-400 font-bold text-sm tracking-wide">
                    {alert.primaryObject} ⚡ {alert.secondaryObject}
                  </div>
                  <div className="text-red-500/70 text-xs font-mono">
                    Miss Distance: {alert.missDistance}m | Prob: {Math.round(alert.probability * 100)}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-mono">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
                <div className="text-[10px] text-red-500 font-mono uppercase font-bold mt-1">
                  CRITICAL
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
