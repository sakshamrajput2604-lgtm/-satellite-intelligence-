"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingParticle({ position, speed }: { position: [number, number, number], speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(clock.getElapsedTime() * speed) * 0.005;
      ref.current.rotation.x += 0.002;
      ref.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.1]} />
      <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export function FloatingSatellites() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{id: number, position: [number, number, number], speed: number}[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      ] as [number, number, number],
      speed: Math.random() * 2 + 0.5
    })));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 10] }}>
        {particles.map(p => (
          <FloatingParticle key={p.id} position={p.position} speed={p.speed} />
        ))}
      </Canvas>
    </div>
  );
}
