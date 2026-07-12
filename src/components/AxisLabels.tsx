import { Text } from "@react-three/drei";
import { EXPIRIES_DAYS } from "../ivSurface";

const WIDTH = 12;
const HEIGHT = 4.5;

export function AxisLabels() {
  return (
    <group>
      {EXPIRIES_DAYS.map((days, i) => {
        const x = (i / (EXPIRIES_DAYS.length - 1) - 0.5) * WIDTH;
        return (
          <Text
            key={days}
            position={[x, -HEIGHT / 2 - 0.4, 5.2]}
            fontSize={0.28}
            color="#6b7280"
            anchorX="center"
            anchorY="middle"
          >
            {`${days}d`}
          </Text>
        );
      })}
      <Text
        position={[0, -HEIGHT / 2 - 1, 6.4]}
        fontSize={0.24}
        color="#4b5563"
        anchorX="center"
        anchorY="middle"
      >
        Days to Expiration
      </Text>
      <Text
        position={[-7, -HEIGHT / 2, 0]}
        fontSize={0.24}
        color="#4b5563"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        Strike (HKD)
      </Text>
    </group>
  );
}
