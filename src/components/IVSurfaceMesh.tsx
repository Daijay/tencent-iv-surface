import { useMemo } from "react";
import * as THREE from "three";
import { generateIVSurface, STRIKE_STEPS, IV_MIN, IV_MAX } from "../ivSurface";
import { ivToColor } from "../ivColor";
import { SURFACE_WIDTH, SURFACE_DEPTH, ivToY } from "../layout";

export function IVSurfaceMesh() {
  const { geometry, wireGeometry, dotPositions } = useMemo(() => {
    const grid = generateIVSurface();
    const rows = grid.length; // time to expiry
    const cols = STRIKE_STEPS; // strike

    const positions = new Float32Array(rows * cols * 3);
    const colors = new Float32Array(rows * cols * 3);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) * 3;
        const x = (c / (cols - 1) - 0.5) * SURFACE_WIDTH;
        const z = (r / (rows - 1) - 0.5) * SURFACE_DEPTH;
        const y = ivToY(grid[r][c].iv, IV_MIN, IV_MAX);
        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;

        const color = ivToColor(grid[r][c].iv, IV_MIN, IV_MAX);
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

    return { geometry: geo, wireGeometry: wireGeo, dotPositions: positions };
  }, []);

  const dotCount = dotPositions.length / 3;

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.45}
          metalness={0.15}
          transparent
          opacity={0.88}
          emissive="#241536"
          emissiveIntensity={0.22}
        />
      </mesh>
      <lineSegments geometry={wireGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.28} />
      </lineSegments>
      <instancedMesh
        args={[undefined, undefined, dotCount]}
        ref={(el) => {
          if (!el) return;
          const dummy = new THREE.Object3D();
          for (let i = 0; i < dotCount; i++) {
            dummy.position.set(dotPositions[i * 3], dotPositions[i * 3 + 1], dotPositions[i * 3 + 2]);
            dummy.updateMatrix();
            el.setMatrixAt(i, dummy.matrix);
          }
          el.instanceMatrix.needsUpdate = true;
        }}
      >
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </instancedMesh>
    </group>
  );
}
