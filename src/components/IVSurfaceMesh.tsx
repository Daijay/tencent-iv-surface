import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateIVSurface, EXPIRIES_DAYS, STRIKE_STEPS } from "../ivSurface";
import { ivToColor } from "../ivColor";
import { AxisLabels } from "./AxisLabels";

const WIDTH = 12;
const DEPTH = 9;
const HEIGHT = 4.5;

export function IVSurfaceMesh() {
  const groupRef = useRef<THREE.Group>(null);

  const { geometry, wireGeometry } = useMemo(() => {
    const grid = generateIVSurface();
    const rows = grid.length;
    const cols = STRIKE_STEPS;

    let minIv = Infinity;
    let maxIv = -Infinity;
    for (const row of grid) {
      for (const p of row) {
        if (p.iv < minIv) minIv = p.iv;
        if (p.iv > maxIv) maxIv = p.iv;
      }
    }

    const positions = new Float32Array(rows * cols * 3);
    const colors = new Float32Array(rows * cols * 3);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) * 3;
        const x = (r / (rows - 1) - 0.5) * WIDTH;
        const z = (c / (cols - 1) - 0.5) * DEPTH;
        const y = grid[r][c].iv * HEIGHT;
        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;

        const color = ivToColor(grid[r][c].iv, minIv, maxIv);
        colors[idx] = color.r;
        colors[idx + 1] = color.g;
        colors[idx + 2] = color.b;
      }
    }

    const indices: number[] = [];
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const a = r * cols + c;
        const b = r * cols + c + 1;
        const cc = (r + 1) * cols + c;
        const d = (r + 1) * cols + c + 1;
        indices.push(a, cc, b, b, cc, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const wireGeo = new THREE.WireframeGeometry(geo);

    return { geometry: geo, wireGeometry: wireGeo };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, -HEIGHT / 2, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.35}
          metalness={0.15}
          emissive="#0a0a0a"
          emissiveIntensity={0.15}
        />
      </mesh>
      <lineSegments geometry={wireGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </lineSegments>
      <AxisLabels />
    </group>
  );
}

export { WIDTH, DEPTH, HEIGHT, EXPIRIES_DAYS };
