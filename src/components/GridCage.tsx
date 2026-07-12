import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { EXPIRIES_DAYS, STRIKE_MIN, STRIKE_MAX, STRIKE_STEPS, IV_MIN, IV_MAX } from "../ivSurface";
import { SURFACE_WIDTH, SURFACE_DEPTH, SURFACE_HEIGHT, ivToY } from "../layout";

const GRID_DIVISIONS = 10;
const HALF_W = SURFACE_WIDTH / 2;
const HALF_D = SURFACE_DEPTH / 2;
const HALF_H = SURFACE_HEIGHT / 2;

function buildGridLines(divisions: number, buildPoint: (t: number) => [THREE.Vector3, THREE.Vector3]) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= divisions; i++) {
    const t = i / divisions;
    const [a, b] = buildPoint(t);
    points.push(a, b);
  }
  return points;
}

function GridPlane({ points }: { points: THREE.Vector3[] }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </lineSegments>
  );
}

function AxisLine({ length, axis }: { length: number; axis: "x" | "y" | "z" }) {
  const geometry = useMemo(() => {
    const half = length / 2;
    const from = axis === "x" ? [-half, 0, 0] : axis === "y" ? [0, -half, 0] : [0, 0, -half];
    const to = axis === "x" ? [half, 0, 0] : axis === "y" ? [0, half, 0] : [0, 0, half];
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...(from as [number, number, number])),
      new THREE.Vector3(...(to as [number, number, number])),
    ]);
  }, [length, axis]);
  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#ffffff" transparent opacity={0.75} />
    </line>
  );
}

/**
 * Six wireframe wall panes (one pair per axis). At any moment only the
 * three panes on the far side of the camera are shown, so the cage always
 * reads as "behind" the surface no matter how the scene is rotated.
 */
export function GridCage() {
  const rootRef = useRef<THREE.Group>(null);

  const xNegRef = useRef<THREE.Group>(null);
  const xPosRef = useRef<THREE.Group>(null);
  const zNegRef = useRef<THREE.Group>(null);
  const zPosRef = useRef<THREE.Group>(null);
  const yNegRef = useRef<THREE.Group>(null);
  const yPosRef = useRef<THREE.Group>(null);

  const xAxisRef = useRef<THREE.Group>(null);
  const yAxisRef = useRef<THREE.Group>(null);
  const zAxisRef = useRef<THREE.Group>(null);

  const strikeTicksRef = useRef<THREE.Group>(null);
  const expiryTicksRef = useRef<THREE.Group>(null);
  const ivTicksRef = useRef<THREE.Group>(null);

  const xWallLines = useMemo(
    () => [
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(0, -HALF_H + t * SURFACE_HEIGHT, -HALF_D),
        new THREE.Vector3(0, -HALF_H + t * SURFACE_HEIGHT, HALF_D),
      ]),
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(0, -HALF_H, -HALF_D + t * SURFACE_DEPTH),
        new THREE.Vector3(0, HALF_H, -HALF_D + t * SURFACE_DEPTH),
      ]),
    ],
    []
  );

  const zWallLines = useMemo(
    () => [
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W + t * SURFACE_WIDTH, -HALF_H, 0),
        new THREE.Vector3(-HALF_W + t * SURFACE_WIDTH, HALF_H, 0),
      ]),
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W, -HALF_H + t * SURFACE_HEIGHT, 0),
        new THREE.Vector3(HALF_W, -HALF_H + t * SURFACE_HEIGHT, 0),
      ]),
    ],
    []
  );

  const yWallLines = useMemo(
    () => [
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W + t * SURFACE_WIDTH, 0, -HALF_D),
        new THREE.Vector3(-HALF_W + t * SURFACE_WIDTH, 0, HALF_D),
      ]),
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W, 0, -HALF_D + t * SURFACE_DEPTH),
        new THREE.Vector3(HALF_W, 0, -HALF_D + t * SURFACE_DEPTH),
      ]),
    ],
    []
  );

  const strikeTicks = useMemo(() => {
    const ticks: { x: number; value: number }[] = [];
    for (let i = 0; i < STRIKE_STEPS; i += 2) {
      const t = i / (STRIKE_STEPS - 1);
      ticks.push({
        x: -HALF_W + t * SURFACE_WIDTH,
        value: Math.round(STRIKE_MIN + t * (STRIKE_MAX - STRIKE_MIN)),
      });
    }
    return ticks;
  }, []);

  const ivTicks = useMemo(() => {
    const steps = 5;
    const ticks: { y: number; value: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const iv = IV_MIN + t * (IV_MAX - IV_MIN);
      ticks.push({ y: ivToY(iv, IV_MIN, IV_MAX), value: Math.round(iv * 100) });
    }
    return ticks;
  }, []);

  useFrame(({ camera }) => {
    const root = rootRef.current;
    if (!root) return;

    const localCam = camera.position.clone();
    root.worldToLocal(localCam);

    const xSign = localCam.x >= 0 ? -1 : 1;
    const ySign = localCam.y >= 0 ? -1 : 1;
    const zSign = localCam.z >= 0 ? -1 : 1;

    if (xNegRef.current) xNegRef.current.visible = xSign === -1;
    if (xPosRef.current) xPosRef.current.visible = xSign === 1;
    if (zNegRef.current) zNegRef.current.visible = zSign === -1;
    if (zPosRef.current) zPosRef.current.visible = zSign === 1;
    if (yNegRef.current) yNegRef.current.visible = ySign === -1;
    if (yPosRef.current) yPosRef.current.visible = ySign === 1;

    xNegRef.current?.position.set(-HALF_W, 0, 0);
    xPosRef.current?.position.set(HALF_W, 0, 0);
    zNegRef.current?.position.set(0, 0, -HALF_D);
    zPosRef.current?.position.set(0, 0, HALF_D);
    yNegRef.current?.position.set(0, -HALF_H, 0);
    yPosRef.current?.position.set(0, HALF_H, 0);

    // The three axis lines meet at the single corner currently "farthest"
    // from the camera on every axis.
    xAxisRef.current?.position.set(0, ySign * HALF_H, zSign * HALF_D);
    yAxisRef.current?.position.set(xSign * HALF_W, 0, zSign * HALF_D);
    zAxisRef.current?.position.set(xSign * HALF_W, ySign * HALF_H, 0);

    strikeTicksRef.current?.position.set(0, ySign * (HALF_H + 0.35), zSign * (HALF_D + 0.15));
    expiryTicksRef.current?.position.set(xSign * (HALF_W + 0.4), ySign * (HALF_H + 0.1), 0);
    ivTicksRef.current?.position.set(xSign * (HALF_W + 0.35), 0, zSign * HALF_D);
  });

  return (
    <group ref={rootRef}>
      <group ref={xNegRef}>
        <GridPlane points={xWallLines} />
      </group>
      <group ref={xPosRef}>
        <GridPlane points={xWallLines} />
      </group>
      <group ref={zNegRef}>
        <GridPlane points={zWallLines} />
      </group>
      <group ref={zPosRef}>
        <GridPlane points={zWallLines} />
      </group>
      <group ref={yNegRef}>
        <GridPlane points={yWallLines} />
      </group>
      <group ref={yPosRef}>
        <GridPlane points={yWallLines} />
      </group>

      {/* Axis lines, brighter than the grid, always meeting at the far corner */}
      <group ref={xAxisRef}>
        <AxisLine length={SURFACE_WIDTH} axis="x" />
      </group>
      <group ref={yAxisRef}>
        <AxisLine length={SURFACE_HEIGHT} axis="y" />
      </group>
      <group ref={zAxisRef}>
        <AxisLine length={SURFACE_DEPTH} axis="z" />
      </group>

      {/* Strike price ticks (X axis) */}
      <group ref={strikeTicksRef}>
        {strikeTicks.map((tick) => (
          <Text
            key={`strike-${tick.value}`}
            position={[tick.x, 0, 0]}
            fontSize={0.24}
            color="#9aa3b2"
            anchorX="center"
            anchorY="middle"
          >
            {tick.value}
          </Text>
        ))}
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.26}
          color="#c3c9d6"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          STRIKE PRICE (HKD)
        </Text>
      </group>

      {/* Time to expiry ticks (Z axis) */}
      <group ref={expiryTicksRef}>
        {EXPIRIES_DAYS.map((days, i) => {
          const t = i / (EXPIRIES_DAYS.length - 1);
          const z = -HALF_D + t * SURFACE_DEPTH;
          return (
            <Text
              key={`expiry-${days}`}
              position={[0, 0, z]}
              fontSize={0.24}
              color="#9aa3b2"
              anchorX="center"
              anchorY="middle"
            >
              {`${days}D`}
            </Text>
          );
        })}
        <Text
          position={[0, 0, HALF_D + 0.8]}
          fontSize={0.26}
          color="#c3c9d6"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          rotation={[0, Math.PI / 2, 0]}
        >
          TIME TO EXPIRY
        </Text>
      </group>

      {/* Implied vol ticks (Y axis) */}
      <group ref={ivTicksRef}>
        {ivTicks.map((tick) => (
          <Text
            key={`iv-${tick.value}`}
            position={[0, tick.y, 0]}
            fontSize={0.24}
            color="#9aa3b2"
            anchorX="right"
            anchorY="middle"
          >
            {`${tick.value}%`}
          </Text>
        ))}
        <Text
          position={[-0.6, 0, 0]}
          fontSize={0.26}
          color="#c3c9d6"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          rotation={[0, 0, Math.PI / 2]}
        >
          IMPLIED VOL (%)
        </Text>
      </group>
    </group>
  );
}
