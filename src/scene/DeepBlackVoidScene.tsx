import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

type Props = { mode: "dark" | "light" };

function makeSparseStars(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // concentrate in the distance
    positions[i3 + 0] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 70;
    positions[i3 + 2] = -Math.random() * 180;
  }
  return positions;
}

export default function DeepBlackVoidScene({ mode }: Props) {
  const stars = useMemo(() => makeSparseStars(1800), []);
  const group = useRef<THREE.Group>(null!);

  useFrame(({ camera, mouse }, dt) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.45, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.25, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8.5, 0.02);
    camera.lookAt(0, 0, -22);

    if (group.current) group.current.rotation.y += dt * 0.01;
  });

  const bg = mode === "dark" ? "#000000" : "#f5f5f5";

  return (
    <group>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 30, 220]} />

      <ambientLight intensity={mode === "dark" ? 0.15 : 0.65} />

      <group ref={group}>
        <Points positions={stars} stride={3} frustumCulled={false}>
          <PointMaterial transparent color={mode === "dark" ? "#ffffff" : "#111827"} size={0.012} sizeAttenuation depthWrite={false} opacity={0.6} />
        </Points>
        {/* a single faint horizon haze to avoid flat black banding */}
        <mesh position={[0, -12, -120]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[80, 64]} />
          <meshBasicMaterial color={mode === "dark" ? "#0a0a0f" : "#cbd5e1"} transparent opacity={mode === "dark" ? 0.12 : 0.18} blending={THREE.NormalBlending} />
        </mesh>
      </group>
    </group>
  );
}
