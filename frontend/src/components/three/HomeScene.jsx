import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { WebGLGuard } from "./WebGLGuard";

const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

function Ecosystem() {
  const group = useRef();
  const inst = useRef();
  const core = useRef();
  const ringA = useRef();
  const ringB = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, pairs, N } = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const N = isMobile ? 70 : 130;
    const R = 2.65;
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push(new THREE.Vector3(Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R));
    }
    const pairs = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (pts[i].distanceTo(pts[j]) < (isMobile ? 1.15 : 0.92)) pairs.push([i, j]);
      }
    }
    return { positions: pts, pairs, N };
  }, []);

  const lines = useMemo(() => {
    const arr = new Float32Array(pairs.length * 6);
    pairs.forEach(([a, b], i) => {
      arr.set([positions[a].x, positions[a].y, positions[a].z, positions[b].x, positions[b].y, positions[b].z], i * 6);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const mat = new THREE.LineBasicMaterial({ color: "#0B2742", transparent: true, opacity: 0.14 });
    return new THREE.LineSegments(geo, mat);
  }, [pairs, positions]);

  useEffect(() => {
    const rng = mulberry32(11);
    const navy = new THREE.Color("#0B2742");
    const blue = new THREE.Color("#174E73");
    const gold = new THREE.Color("#C8A44D");
    for (let i = 0; i < N; i++) {
      const r = rng();
      inst.current.setColorAt(i, r > 0.9 ? gold : r > 0.6 ? blue : navy);
      dummy.position.copy(positions[i]);
      dummy.scale.setScalar(0.85 + rng() * 0.7);
      dummy.updateMatrix();
      inst.current.setMatrixAt(i, dummy.matrix);
    }
    inst.current.instanceColor.needsUpdate = true;
    inst.current.instanceMatrix.needsUpdate = true;
  }, [N, positions, dummy]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.07;
    const px = state.pointer.x || 0;
    const py = state.pointer.y || 0;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, py * 0.12 + 0.1, 0.04);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, px * -0.05, 0.04);
    const t = state.clock.elapsedTime;
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.05);
    if (ringA.current) ringA.current.rotation.z = t * 0.18;
    if (ringB.current) ringB.current.rotation.x = Math.PI / 2.3 + t * 0.12;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={inst} args={[undefined, undefined, N]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial roughness={0.4} metalness={0.2} />
      </instancedMesh>
      <primitive object={lines} />
      <mesh ref={core}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#C8A44D" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[1.15, 0.008, 8, 90]} />
        <meshBasicMaterial color="#C8A44D" transparent opacity={0.75} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.75, 0.006, 8, 90]} />
        <meshBasicMaterial color="#0B2742" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export default function HomeScene() {
  return (
    <WebGLGuard>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, powerPreference: "default" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 6, 4]} intensity={1.1} />
        <directionalLight position={[-5, -2, -3]} intensity={0.35} color="#F5EEDB" />
        <Ecosystem />
      </Canvas>
    </WebGLGuard>
  );
}
