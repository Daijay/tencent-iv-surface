import { useMemo } from "react";
import * as THREE from "three";

function makeStripeTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(220, 225, 235, 1)";
  ctx.lineWidth = 1;

  const spacing = 28;
  ctx.beginPath();
  for (let x = -size; x < size * 2; x += spacing) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + size, size);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function BackgroundStripes() {
  const texture = useMemo(() => makeStripeTexture(), []);

  return (
    <mesh position={[0, 0, -14]} renderOrder={-1}>
      <planeGeometry args={[60, 40]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.05}
        depthWrite={false}
        color="#c8ccd6"
      />
    </mesh>
  );
}
