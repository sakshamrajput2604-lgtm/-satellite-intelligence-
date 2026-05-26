"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SatelliteSwarm } from "./globe/SatelliteSwarm";
import { OrbitPath } from "./globe/OrbitPath";
import { GlobeOverlay } from "./globe/GlobeOverlay";
import { CollisionVisualizer } from "./globe/CollisionVisualizer";
import { LiveSatelliteData } from "@/lib/satellite-engine";
import { Target } from "lucide-react";

function Earth({ selectedSat }: { selectedSat: LiveSatelliteData | null }) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Load a high-res earth texture map
  const colorMap = useLoader(THREE.TextureLoader, "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");
  
  useFrame(() => {
    if (earthRef.current && !selectedSat) {
      // Very slow rotation when nothing is selected
      earthRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial 
        map={colorMap}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

function AtmosphericGlow() {
  return (
    <mesh>
      <sphereGeometry args={[5.1, 32, 32]} />
      <meshBasicMaterial 
        color="#22d3ee" 
        transparent 
        opacity={0.05} 
        blending={THREE.AdditiveBlending} 
        side={THREE.BackSide} 
      />
    </mesh>
  );
}



export function DashboardGlobe() {
  const [selectedSat, setSelectedSat] = useState<LiveSatelliteData | null>(null);

  return (
    <div className="cyber-panel p-6 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 z-10 relative">
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2">
          <Target size={18} />
          Orbital Visualizer
        </h2>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 cyber-glow-box animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Live Feed</span>
        </div>
      </div>

      <div className="flex-1 relative rounded-lg overflow-hidden border border-cyan-900/50 bg-black/50 cursor-move">
        
        {/* HUD Elements */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="text-[10px] font-mono text-cyan-500/50 mt-1">LCL_SYS_ACTIVE</div>
        </div>
        
        {/* Radar Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-screen">
          <div className="w-full h-full bg-[linear-gradient(to_right,#00f0ff1a_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff1a_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          {/* Brightened Lighting for Visibility */}
          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight 
            position={[10, 10, 10]} 
            intensity={3.0} 
            color="#ffffff" 
          />
          <pointLight position={[-10, -5, -10]} intensity={1.0} color="#22d3ee" />

          {/* Space Environment */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Core Planet */}
          <React.Suspense fallback={null}>
            <Earth selectedSat={selectedSat} />
          </React.Suspense>
          <AtmosphericGlow />

          {/* Live Satellites */}
          <SatelliteSwarm onSatelliteClick={setSelectedSat} />
          <CollisionVisualizer />
          
          {/* Trajectory visualization for selected */}
          {selectedSat && <OrbitPath satData={selectedSat} />}
          
          {/* UI Overlay */}
          {selectedSat && (
            <GlobeOverlay satellite={selectedSat} onClose={() => setSelectedSat(null)} />
          )}

          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={6}
            maxDistance={30}
            autoRotate={!selectedSat}
            autoRotateSpeed={0.5}
          />
        </Canvas>
        
        {/* Radar Scanline Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-[scan_3s_linear_infinite]" />
      </div>
    </div>
  );
}
