import { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { EXPIRIES_DAYS, STRIKE_MIN, STRIKE_MAX, STRIKE_STEPS, IV_MIN, IV_MAX } from "../ivSurface";
import { SURFACE_WIDTH, SURFACE_DEPTH, SURFACE_HEIGHT, ivToY } from "../layout";

const GRID_DIVISIONS = 10;
const HALF_W = SURFACE_WIDTH / 2;
const HALF_D = SURFACE_DEPTH / 2;
const HALF_H = SURFACE_HEIGHT / 2;

const GRID_COLOR = new THREE.Color("#ffffff");

function buildGridLines(
  divisions: number,
  buildPoint: (t: number) => [THREE.Vector3, THREE.Vector3]
) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= divisions; i++) {
    const t = i / divisions;
    const [a, b] = buildPoint(t);
    points.push(a, b);
  }
  return points;
}

function GridPlane({
  points,
}: {
  points: THREE.Vector3[];
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={GRID_COLOR} transparent opacity={0.3} />
    </lineSegments>
  );
}

function AxisLine({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]),
    [from, to]
  );
  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#ffffff" transparent opacity={0.75} />
    </line>
  );
}

export function GridCage() {
  const backWallLines = useMemo(
    () => [
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W + t * SURFACE_WIDTH, -HALF_H, -HALF_D),
        new THREE.Vector3(-HALF_W + t * SURFACE_WIDTH, HALF_H, -HALF_D),
      ]),
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W, -HALF_H + t * SURFACE_HEIGHT, -HALF_D),
        new THREE.Vector3(HALF_W, -HALF_H + t * SURFACE_HEIGHT, -HALF_D),
      ]),
    ],
    []
  );

  const leftWallLines = useMemo(
    () => [
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W, -HALF_H, -HALF_D + t * SURFACE_DEPTH),
        new THREE.Vector3(-HALF_W, HALF_H, -HALF_D + t * SURFACE_DEPTH),
      ]),
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W, -HALF_H + t * SURFACE_HEIGHT, -HALF_D),
        new THREE.Vector3(-HALF_W, -HALF_H + t * SURFACE_HEIGHT, HALF_D),
      ]),
    ],
    []
  );

  const bottomWallLines = useMemo(
    () => [
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W + t * SURFACE_WIDTH, -HALF_H, -HALF_D),
        new THREE.Vector3(-HALF_W + t * SURFACE_WIDTH, -HALF_H, HALF_D),
      ]),
      ...buildGridLines(GRID_DIVISIONS, (t) => [
        new THREE.Vector3(-HALF_W, -HALF_H, -HALF_D + t * SURFACE_DEPTH),
        new THREE.Vector3(HALF_W, -HALF_H, -HALF_D + t * SURFACE_DEPTH),
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
      ticks.push({
        y: ivToY(iv, IV_MIN, IV_MAX),
        value: Math.round(iv * 100),
      });
    }
    return ticks;
  }, []);

  return (
    <group>
      <GridPlane points={backWallLines} />
      <GridPlane points={leftWallLines} />
      <GridPlane points={bottomWallLines} />

      {/* Axis lines, brighter than the grid */}
      <AxisLine from={[-HALF_W, -HALF_H, -HALF_D]} to={[HALF_W, -HALF_H, -HALF_D]} />
      <AxisLine from={[-HALF_W, -HALF_H, -HALF_D]} to={[-HALF_W, HALF_H, -HALF_D]} />
      <AxisLine from={[-HALF_W, -HALF_H, -HALF_D]} to={[-HALF_W, -HALF_H, HALF_D]} />

      {/* Strike price ticks (X axis) */}
      {strikeTicks.map((tick) => (
        <Text
          key={`strike-${tick.value}`}
          position={[tick.x, -HALF_H - 0.35, HALF_D + 0.15]}
          fontSize={0.24}
          color="#9aa3b2"
          anchorX="center"
          anchorY="middle"
        >
          {tick.value}
        </Text>
      ))}
      <Text
        position={[0, -HALF_H - 0.95, HALF_D + 0.15]}
        fontSize={0.26}
        color="#c3c9d6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        STRIKE PRICE (HKD)
      </Text>

      {/* Time to expiry ticks (Z axis) */}
      {EXPIRIES_DAYS.map((days, i) => {
        const t = i / (EXPIRIES_DAYS.length - 1);
        const z = -HALF_D + t * SURFACE_DEPTH;
        return (
          <Text
            key={`expiry-${days}`}
            position={[-HALF_W - 0.4, -HALF_H - 0.1, z]}
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
        position={[-HALF_W - 0.4, -HALF_H - 0.1, HALF_D + 0.9]}
        fontSize={0.26}
        color="#c3c9d6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        rotation={[0, Math.PI / 2, 0]}
      >
        TIME TO EXPIRY
      </Text>

      {/* Implied vol ticks (Y axis) */}
      {ivTicks.map((tick) => (
        <Text
          key={`iv-${tick.value}`}
          position={[-HALF_W - 0.35, tick.y, -HALF_D]}
          fontSize={0.24}
          color="#9aa3b2"
          anchorX="right"
          anchorY="middle"
        >
          {`${tick.value}%`}
        </Text>
      ))}
      <Text
        position={[-HALF_W - 0.95, 0, -HALF_D]}
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
  );
}
