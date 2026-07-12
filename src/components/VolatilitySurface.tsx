import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GridCage } from "./GridCage";
import { IVSurfaceMesh } from "./IVSurfaceMesh";

const AUTO_ROTATE_SPEED = 0.12;

export function VolatilitySurface({ isDraggingRef }: { isDraggingRef: MutableRefObject<boolean> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !isDraggingRef.current) {
      groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED;
    }
  });

  return (
    <group ref={groupRef}>
      <GridCage />
      <IVSurfaceMesh />
    </group>
  );
}
