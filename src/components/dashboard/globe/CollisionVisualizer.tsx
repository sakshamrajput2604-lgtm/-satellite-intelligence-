"use client";

import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import { useConjunctions } from "@/contexts/ConjunctionContext";
import { useSatellites } from "@/contexts/SatelliteContext";
import { getCartesian } from "@/lib/satellite-engine";
import * as THREE from "three";

export function CollisionVisualizer() {
  const { alerts } = useConjunctions();
  const { satellites } = useSatellites();

  const lines = useMemo(() => {
    const criticalAlerts = alerts.filter(a => a.urgency === "CRITICAL");
    if (criticalAlerts.length === 0 || satellites.length === 0) return [];

    const linesToDraw: { id: string; p1: THREE.Vector3; p2: THREE.Vector3 }[] = [];

    criticalAlerts.forEach(alert => {
      const sat1 = satellites.find(s => s.norad === alert.primaryNorad);
      const sat2 = satellites.find(s => s.norad === alert.secondaryNorad);

      if (sat1 && sat2) {
        const p1 = getCartesian(sat1.latitude, sat1.longitude, sat1.altitude);
        const p2 = getCartesian(sat2.latitude, sat2.longitude, sat2.altitude);
        linesToDraw.push({ id: alert.id, p1, p2 });
      }
    });

    return linesToDraw;
  }, [alerts, satellites]);

  return (
    <group>
      {lines.map(line => (
        <Line 
          key={line.id}
          points={[line.p1, line.p2]} 
          color="#f87171" // red-400
          lineWidth={2}
          transparent
          opacity={0.8}
        />
      ))}
    </group>
  );
}
