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
      camera={{ position: [9, 6, 11], fov: 42 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 16, 32]} />

      {/* Soft ambient fill so no side of the surface goes fully dark */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#3a4a6b", "#0a0a0a", 0.5]} />

      {/* Key light: warm, from front-top */}
      <directionalLight position={[7, 11, 6]} intensity={1.6} color="#fff3e0" />
      {/* Fill light: cool, from the opposite side */}
      <directionalLight position={[-8, 5, -4]} intensity={0.6} color="#7fa4ff" />
      {/* Rim light: catches the edges for depth/separation from the background */}
      <directionalLight position={[0, 4, -10]} intensity={0.7} color="#cfe0ff" />
      {/* Low glow near camera to keep the near face readable */}
      <pointLight position={[9, 4, 11]} intensity={0.5} color="#ffe9c7" distance={30} decay={2} />

      <BackgroundStripes />
      <VolatilitySurface isDraggingRef={isDraggingRef} />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={22}
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
