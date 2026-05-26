import React from "react";

export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 animate-pulse">
      {/* Top Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-cyan-950/20 border border-cyan-900/30 rounded-xl" />
        ))}
      </div>
      
      {/* Main Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 bg-cyan-950/20 border border-cyan-900/30 rounded-xl min-h-[400px]" />
        <div className="space-y-6 flex flex-col">
          <div className="h-[300px] bg-cyan-950/20 border border-cyan-900/30 rounded-xl" />
          <div className="flex-1 bg-cyan-950/20 border border-cyan-900/30 rounded-xl min-h-[250px]" />
        </div>
      </div>
    </div>
  );
}
