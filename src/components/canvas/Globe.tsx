"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={earthRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#0f172a"
        wireframe={true}
        transparent={true}
        opacity={0.4}
      />
    </Sphere>
  );
}

function Satellite({ radius, speed, angleOffset, color }: { radius: number, speed: number, angleOffset: number, color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + angleOffset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 0.5) * (radius * 0.2); // slight orbital inclination
    }
  });

  // Calculate orbit path points
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(t) * radius,
        Math.sin(t * 0.5) * (radius * 0.2),
        Math.sin(t) * radius
      )
    );
  }

  return (
    <group>
      <Line points={points} color={color} opacity={0.15} transparent lineWidth={1.5} />
      <mesh ref={ref}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
        {/* Glow effect hack */}
        <pointLight color={color} intensity={2} distance={2} />
      </mesh>
    </group>
  );
}

export function GlobeCanvas() {
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Earth />
        
        {/* Render a few satellites */}
        <Satellite radius={2.5} speed={0.5} angleOffset={0} color="#4f46e5" />
        <Satellite radius={2.8} speed={0.3} angleOffset={Math.PI / 3} color="#94a3b8" />
        <Satellite radius={3.2} speed={0.4} angleOffset={Math.PI} color="#38bdf8" />
        <Satellite radius={2.3} speed={0.6} angleOffset={Math.PI * 1.5} color="#4f46e5" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI / 3} 
        />
      </Canvas>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
