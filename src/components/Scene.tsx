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

      {/* Very high ambient fill so no side of the surface ever goes dark,
          from any rotation or camera angle. */}
      <ambientLight intensity={1.8} />
      <hemisphereLight args={["#6a80b8", "#2a2438", 1.2]} />

      {/* Four directional lights ringing the scene at 90-degree offsets,
          so every face is lit head-on from at least one direction. */}
      <directionalLight position={[10, 10, 10]} intensity={1.6} color="#fff3e0" />
      <directionalLight position={[-10, 10, 10]} intensity={1.3} color="#8fb3ff" />
      <directionalLight position={[10, 10, -10]} intensity={1.3} color="#dfe9ff" />
      <directionalLight position={[-10, 10, -10]} intensity={1.3} color="#c9d8ff" />

      {/* Top-down and bottom-up so the crown and underside are both lit */}
      <directionalLight position={[0, 14, 0]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[0, -12, 0]} intensity={0.9} color="#ffe9c7" />

      {/* Low glow near camera to keep the near face readable */}
      <pointLight position={[12, 8, 15]} intensity={1.0} color="#ffe9c7" distance={40} decay={2} />

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
