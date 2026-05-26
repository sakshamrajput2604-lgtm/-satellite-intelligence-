"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import * as satellite from "satellite.js";
import { LiveSatelliteData } from "@/lib/satellite-engine";

const EARTH_RADIUS = 5;

function getCartesian(lat: number, lon: number, alt: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = EARTH_RADIUS + (alt / 6371) * EARTH_RADIUS;

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = (r * Math.sin(phi) * Math.sin(theta));
  const y = (r * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
}

export function OrbitPath({ satData }: { satData: LiveSatelliteData }) {
  const points = useMemo(() => {
    try {
      const satrec = satellite.twoline2satrec(satData.line1, satData.line2);
      
      // Calculate one full orbit (approx 100 minutes for LEO)
      // We will generate 120 points spaced by 1 minute
      const path: THREE.Vector3[] = [];
      const now = new Date();
      
      for (let i = 0; i <= 120; i++) {
        const date = new Date(now.getTime() + i * 60000); // +1 min
        const pV = satellite.propagate(satrec, date);
        const positionEci = pV.position;
        
        if (!positionEci || typeof positionEci === 'boolean') continue;

        const gmst = satellite.gstime(date);
        const positionGd = satellite.eciToGeodetic(positionEci, gmst);
        
        const lon = satellite.degreesLong(positionGd.longitude);
        const lat = satellite.degreesLat(positionGd.latitude);
        const alt = positionGd.height;
        
        path.push(getCartesian(lat, lon, alt));
      }
      return path;
    } catch (e) {
      console.error("Failed to calculate orbit path");
      return [];
    }
  }, [satData]);

  if (points.length === 0) return null;

  return (
    <Line 
      points={points} 
      color="#22d3ee" 
      lineWidth={1.5} 
      transparent 
      opacity={0.4} 
    />
  );
}
