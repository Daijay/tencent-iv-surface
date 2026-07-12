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
        toneMappingExposure: 1.4,
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 22, 55]} />

      {/* Full ambient fill so every face of the surface is clearly lit */}
      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#5a6fa0", "#0a0a0a", 1.0]} />

      {/* Key light: warm, from front-top */}
      <directionalLight position={[7, 11, 6]} intensity={2.6} color="#fff3e0" />
      {/* Fill light: cool, from the opposite side */}
      <directionalLight position={[-8, 5, -4]} intensity={1.4} color="#8fb3ff" />
      {/* Rim light: catches the edges for depth/separation from the background */}
      <directionalLight position={[0, 4, -10]} intensity={1.5} color="#dfe9ff" />
      {/* Under-light so the underside of the bowl isn't lost in shadow */}
      <directionalLight position={[0, -8, 4]} intensity={0.8} color="#ffe9c7" />
      {/* Low glow near camera to keep the near face readable */}
      <pointLight position={[9, 4, 11]} intensity={1.2} color="#ffe9c7" distance={35} decay={2} />
      <pointLight position={[-6, 6, -8]} intensity={0.8} color="#c9d8ff" distance={35} decay={2} />

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
