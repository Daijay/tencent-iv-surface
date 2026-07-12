import { Text } from "@react-three/drei";

export function FloatingLabel() {
  return (
    <group position={[0, 4.2, 0]}>
      <Text fontSize={0.5} color="#e8ebf2" anchorX="center" anchorY="middle" letterSpacing={0.02}>
        Tencent 0700.HK — Implied Volatility Surface
      </Text>
    </group>
  );
}
