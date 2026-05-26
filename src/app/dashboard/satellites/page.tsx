import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { SatelliteTable } from "@/components/dashboard/SatelliteTable";
import { Satellite } from "lucide-react";

export default function SatellitesPage() {
  return (
    <DashboardLayout>
      <PageTransition className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <Satellite className="text-cyan-400" size={28} />
          <h1 className="text-3xl font-bold text-white tracking-tight">Satellite Database</h1>
        </div>
        
        <div className="flex-1 min-h-[600px]">
          <SatelliteTable />
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
