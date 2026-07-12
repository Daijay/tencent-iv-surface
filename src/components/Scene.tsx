import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { VolatilitySurface } from "./VolatilitySurface";
import { BackgroundStripes } from "./BackgroundStripes";

export function Scene() {
  const isDraggingRef = useRef(false);

  return (
    <Canvas
      camera={{ position: [12, 8, 15], fov: 42 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a0a0a"]} />
      {/* Fog stays far past max zoom-out (42) so the scene never fades to black */}
      <fog attach="fog" args={["#0a0a0a", 45, 90]} />

      {/* Moderate, even ambient fill: dark and moody, but never fully black
          on any face regardless of rotation or zoom. */}
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#3c4a6e", "#1a1622", 0.55]} />

      {/* Four directional lights ringing the scene at 90-degree offsets,
          all non-attenuating so distance/zoom never darkens them. */}
      <directionalLight position={[10, 10, 10]} intensity={0.85} color="#fff3e0" />
      <directionalLight position={[-10, 10, 10]} intensity={0.65} color="#8fb3ff" />
      <directionalLight position={[10, 10, -10]} intensity={0.65} color="#dfe9ff" />
      <directionalLight position={[-10, 10, -10]} intensity={0.65} color="#c9d8ff" />

      {/* Top-down and bottom-up so the crown and underside are both lit */}
      <directionalLight position={[0, 14, 0]} intensity={0.5} color="#ffffff" />
      <directionalLight position={[0, -12, 0]} intensity={0.45} color="#ffe9c7" />

      <BackgroundStripes />
      <VolatilitySurface isDraggingRef={isDraggingRef} />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={42}
        maxPolarAngle={Math.PI / 1.9}
        onStart={() => {
          isDraggingRef.current = true;
        }}
        onEnd={() => {
          isDraggingRef.current = false;
        }}
      />
    </Canvas>
  );
}
