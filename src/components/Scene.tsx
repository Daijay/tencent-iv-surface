import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { IVSurfaceMesh } from "./IVSurfaceMesh";
import { BackgroundStripes } from "./BackgroundStripes";
import { FloatingLabel } from "./FloatingLabel";

export function Scene() {
  return (
    <Canvas
      camera={{ position: [9, 6, 11], fov: 42 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 14, 30]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} />
      <directionalLight position={[-6, 4, -6]} intensity={0.35} color="#6a8dff" />

      <BackgroundStripes />
      <IVSurfaceMesh />
      <FloatingLabel />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={22}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
