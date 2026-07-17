/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null);
  
  // Reduced particle count for better mobile performance
  const particlesCount = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a1a1aa" // Muted gray instead of cyan
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.15}
      />
    </Points>
  );
}

function GridBackground() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      // Slow continuous forward movement
      gridRef.current.position.z = (state.clock.elapsedTime * 0.15) % 1.5;
    }
  });

  return (
    <group ref={gridRef}>
      <Grid
        position={[0, -2, 0]}
        args={[40, 40]}
        cellSize={0.75}
        cellThickness={0.8}
        cellColor="#1f1f23" // Muted dark grid lines
        sectionSize={3.75}
        sectionThickness={1.2}
        sectionColor="#2f2f35" // Dark steel gray main lines
        fadeDistance={20}
        fadeStrength={1.5}
      />
    </group>
  );
}

export default function EngineeringBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background">
      <div className="noise-bg" />
      <Canvas dpr={[1, 1.2]} camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={["#09090b", 3, 10]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 3]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -5, -2]} intensity={0.5} color="#27272a" />
        <GridBackground />
        <Particles />
      </Canvas>
    </div>
  );
}

