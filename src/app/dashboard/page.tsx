import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { SatelliteTable } from "@/components/dashboard/SatelliteTable";
import { DashboardGlobe } from "@/components/dashboard/DashboardGlobe";
import { PredictionPanel } from "@/components/dashboard/PredictionPanel";
import { AlertCenter } from "@/components/dashboard/AlertCenter";
import { IncidentHistory } from "@/components/dashboard/IncidentHistory";
import { MetricsChart } from "@/components/dashboard/MetricsChart";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageTransition className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Hero Analytics */}
        <AnalyticsCards />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Data Table & Metrics */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <div className="h-[300px]">
              <MetricsChart />
            </div>
            <div className="flex-1 min-h-[400px]">
              <SatelliteTable limit={5} />
            </div>
          </div>

          {/* Right Column: Globe & Predictions */}
          <div className="space-y-6 flex flex-col">
            <div className="h-[300px]">
              <DashboardGlobe />
            </div>
            <div className="flex-1 min-h-[250px]">
              <PredictionPanel />
            </div>
          </div>
          
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[300px]">
             <AlertCenter />
          </div>
          <div className="h-[300px]">
             <IncidentHistory />
          </div>
        </div>

      </PageTransition>
    </DashboardLayout>
  );
}
