"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Float, OrbitControls } from "@react-three/drei";

interface GearProps {
  radius: number;
  teethCount: number;
  thickness: number;
  color: string;
  position: [number, number, number];
  rotationSpeed?: number;
  explodedOffset: [number, number, number];
  isExploded: boolean;
}

function Gear({
  radius,
  teethCount,
  thickness,
  color,
  position,
  rotationSpeed = 0,
  explodedOffset,
  isExploded,
}: GearProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Create gear teeth procedurally
  const teeth = useMemo(() => {
    const arr = [];
    const toothWidth = (2 * Math.PI * radius) / teethCount * 0.5;
    const toothHeight = radius * 0.15;
    
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      const x = Math.cos(angle) * (radius - toothHeight * 0.3);
      const y = Math.sin(angle) * (radius - toothHeight * 0.3);
      
      arr.push({
        x,
        y,
        angle,
        w: toothWidth,
        h: toothHeight,
        d: thickness * 1.05
      });
    }
    return arr;
  }, [radius, teethCount, thickness]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  // Calculate current interpolation target
  const targetPos = isExploded
    ? [
        position[0] + explodedOffset[0],
        position[1] + explodedOffset[1],
        position[2] + explodedOffset[2]
      ]
    : position;

  useFrame(() => {
    if (meshRef.current) {
      // Lerp position
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPos[0], 0.08);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPos[1], 0.08);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetPos[2], 0.08);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Central Gear Disk */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, thickness, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.9}
          flatShading
        />
      </mesh>
      
      {/* Gear teeth */}
      {teeth.map((t, idx) => (
        <mesh 
          key={idx} 
          position={[t.x, 0, t.y]} 
          rotation={[0, -t.angle, 0]}
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[t.w, thickness, t.h]} />
          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Center bore / shaft hole */}
      <mesh position={[0, thickness * 0.05, 0]}>
        <cylinderGeometry args={[radius * 0.25, radius * 0.25, thickness * 1.1, 16]} />
        <meshStandardMaterial color="#0d0d0f" roughness={0.8} />
      </mesh>
    </group>
  );
}

function GearboxAssembly({ isExploded }: { isExploded: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Slow idle rotation and light mouse follow
  useFrame((state) => {
    if (groupRef.current) {
      // Idle rotate entire assembly
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.clock.getElapsedTime() * 0.15 + mouse.x * 0.5,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.5 + mouse.y * 0.3,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} rotation={[0.6, 0, 0]} scale={1.2}>
      {/* 1. Central Shaft (Z-Axis / Y in local space) */}
      <group>
        <mesh castShadow receiveShadow position={[0, isExploded ? 1.8 : 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 3.5, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.95} />
        </mesh>
        
        {/* Shaft Collar */}
        <mesh castShadow receiveShadow position={[0, isExploded ? 2.2 : 0.8, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} />
          <meshStandardMaterial color="#a1a1aa" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* 2. Sun Gear (Middle Central Gear) */}
      <Gear
        radius={0.7}
        teethCount={12}
        thickness={0.4}
        color="#ffffff"
        position={[0, 0, 0]}
        rotationSpeed={1.5}
        explodedOffset={[0, 0, 0]}
        isExploded={isExploded}
      />

      {/* 3. Planet Gears (3 orbiting gears) */}
      {/* Planet 1 */}
      <Gear
        radius={0.5}
        teethCount={8}
        thickness={0.35}
        color="#a1a1aa"
        position={[1.1, 0, 0]}
        rotationSpeed={-2.1} // opposite spin
        explodedOffset={[0.8, 0, 0]}
        isExploded={isExploded}
      />
      {/* Planet 2 */}
      <Gear
        radius={0.5}
        teethCount={8}
        thickness={0.35}
        color="#a1a1aa"
        position={[-0.55, 0, 0.95]}
        rotationSpeed={-2.1}
        explodedOffset={[-0.4, 0, 0.7]}
        isExploded={isExploded}
      />
      {/* Planet 3 */}
      <Gear
        radius={0.5}
        teethCount={8}
        thickness={0.35}
        color="#a1a1aa"
        position={[-0.55, 0, -0.95]}
        rotationSpeed={-2.1}
        explodedOffset={[-0.4, 0, -0.7]}
        isExploded={isExploded}
      />

      {/* 4. Carrier Plate (Animate downward on explosion) */}
      <mesh
        castShadow
        receiveShadow
        position={[0, isExploded ? -1.5 : -0.3, 0]}
      >
        <cylinderGeometry args={[1.5, 1.5, 0.1, 6]} />
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.8} wireframe={false} />
      </mesh>

      {/* 5. Outer Ring Gear Casing (Animate forward/upward on explosion) */}
      <group position={[0, isExploded ? -2.8 : 0, 0]}>
        <mesh receiveShadow>
          <ringGeometry args={[1.7, 1.9, 32]} />
          <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.9} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Outermost rim cylinder shell */}
        <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[1.9, 1.9, 0.5, 32, 1, true]} />
          <meshStandardMaterial color="#0f0f11" roughness={0.3} metalness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 6. Structural Bearings / Fasteners (Exploding outwards) */}
      <group position={[0, isExploded ? 0.8 : 0, 0]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <torusGeometry args={[0.3, 0.08, 12, 24]} />
          <meshStandardMaterial color="#d4d4d8" roughness={0.15} metalness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

export default function Gearbox3D() {
  const [isExploded, setIsExploded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center relative cursor-pointer group"
      onClick={() => setIsExploded(!isExploded)}
    >
      {/* Three.js Canvas */}
      <div className="w-full h-full absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <GearboxAssembly isExploded={isExploded} />
          </Float>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Dynamic Overlay labels for UI premium feel */}
      <div className="absolute bottom-6 left-6 font-mono text-[9px] uppercase tracking-widest text-foreground/40 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm pointer-events-none group-hover:text-highlight group-hover:border-white/10 transition-colors">
        {isExploded ? "Assembly Status: Exploded // Click to Join" : "Assembly Status: Mated // Click to Explode"}
      </div>

      <div className="absolute top-6 right-6 font-mono text-[8px] uppercase tracking-[0.2em] text-foreground/30 pointer-events-none">
        Fig 2. Epicyclic Reducer // Drag to Rotate
      </div>
    </div>
  );
}
