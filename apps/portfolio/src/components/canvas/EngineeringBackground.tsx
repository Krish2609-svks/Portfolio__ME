/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null);
  
  // Reduced particle count for better mobile performance
  const particlesCount = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount; i++) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // eslint-disable-next-line react-hooks/rules-of-hooks
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00E5FF"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

function GridBackground() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
    }
  });

  return (
    <group ref={gridRef}>
      <Grid
        position={[0, -2, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={1}
        cellColor="#161B22"
        sectionSize={2.5}
        sectionThickness={1.5}
        sectionColor="#00E5FF"
        fadeDistance={25}
        fadeStrength={1}
      />
    </group>
  );
}

export default function EngineeringBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background">
      {/* Set DPR for better performance on high density displays (mobile) */}
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={["#050505", 2, 15]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00B4D8" />
        <GridBackground />
        <Particles />
      </Canvas>
    </div>
  );
}
