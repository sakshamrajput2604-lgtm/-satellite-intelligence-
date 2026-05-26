"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useSatellites } from "@/contexts/SatelliteContext";
import { getCartesian } from "@/lib/satellite-engine";

export function SatelliteSwarm({ onSatelliteClick }: { onSatelliteClick: (sat: any) => void }) {
  const { satellites } = useSatellites();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const colorNominal = useMemo(() => new THREE.Color("#22d3ee"), []); // Cyan
  const colorWarning = useMemo(() => new THREE.Color("#facc15"), []); // Yellow
  const colorCritical = useMemo(() => new THREE.Color("#f87171"), []); // Red
  const colorDebris = useMemo(() => new THREE.Color("#888888"), []); // Grey/Dull Orange

  // Update positions every frame
  useFrame(() => {
    if (!meshRef.current || satellites.length === 0) return;

    satellites.forEach((sat, i) => {
      const pos = getCartesian(sat.latitude, sat.longitude, sat.altitude);
      dummy.position.copy(pos);
      
      // Face outward
      dummy.lookAt(new THREE.Vector3(0,0,0));
      
      const isDebris = sat.type === 'Debris';
      
      if (isDebris) {
        dummy.scale.set(0.4, 0.4, 0.4);
      } else {
        dummy.scale.set(1, 1, 1);
      }

      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Color coding
      if (sat.status === "CRITICAL") meshRef.current!.setColorAt(i, colorCritical);
      else if (sat.status === "WARNING") meshRef.current!.setColorAt(i, colorWarning);
      else if (isDebris) meshRef.current!.setColorAt(i, colorDebris);
      else meshRef.current!.setColorAt(i, colorNominal);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (satellites.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, satellites.length]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
          onSatelliteClick(satellites[e.instanceId]);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
