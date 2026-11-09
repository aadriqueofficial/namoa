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
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => t * t * (3 - 2 * t);

function SupplyNetwork({ progressRef }) {
  const inst = useRef();
  const group = useRef();
  const core = useRef();
  const coreRingA = useRef();
  const coreRingB = useRef();
  const sm = useRef(0);
  const idle = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const rng = mulberry32(7);
    const ringSizes = isMobile ? [8, 12, 16] : [10, 18, 26];
    const radii = [1.9, 3.4, 4.9];
    const N = ringSizes.reduce((a, b) => a + b, 0);
    const nodes = [];
    let idx = 0;
    ringSizes.forEach((count, r) => {
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + r * 0.5;
        nodes.push({
          scatter: new THREE.Vector3((rng() - 0.5) * 17, (rng() - 0.5) * 8, (rng() - 0.5) * 10),
          organized: new THREE.Vector3(
            Math.cos(ang) * radii[r],
            (i % 2 === 0 ? 0.22 : -0.22) + (r === 0 ? 0.35 : 0),
            Math.sin(ang) * radii[r]
          ),
          delay: rng(),
          phase: rng() * Math.PI * 2,
          size: 0.7 + rng() * 0.8,
          ring: r,
          idx: idx++,
        });
      }
    });
    // ring circle pairs + spokes
    const pairs = [];
    let offset = 0;
    ringSizes.forEach((count) => {
      for (let i = 0; i < count; i++) pairs.push([offset + i, offset + ((i + 1) % count)]);
      offset += count;
    });
    for (let i = 0; i < ringSizes[1]; i += 2) {
      pairs.push([ringSizes[0] + i, Math.floor((i / ringSizes[1]) * ringSizes[0])]);
    }
    for (let i = 0; i < ringSizes[2]; i += 3) {
      pairs.push([ringSizes[0] + ringSizes[1] + i, ringSizes[0] + Math.floor((i / ringSizes[2]) * ringSizes[1])]);
    }
    const innerIdx = Array.from({ length: ringSizes[0] }, (_, i) => i);
    return { nodes, pairs, innerIdx, N };
  }, []);

  const cur = useMemo(() => data.nodes.map(() => new THREE.Vector3()), [data]);

  const netLines = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(data.pairs.length * 6), 3));
    const mat = new THREE.LineBasicMaterial({ color: "#174E73", transparent: true, opacity: 0 });
    return new THREE.LineSegments(geo, mat);
  }, [data]);

  const routeLines = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(data.innerIdx.length * 6), 3));
    const mat = new THREE.LineBasicMaterial({ color: "#C8A44D", transparent: true, opacity: 0 });
    return new THREE.LineSegments(geo, mat);
  }, [data]);

  useEffect(() => {
    const rng = mulberry32(21);
    const navy = new THREE.Color("#0B2742");
    const blue = new THREE.Color("#174E73");
    const gold = new THREE.Color("#C8A44D");
    data.nodes.forEach((n, i) => {
      const r = rng();
      inst.current.setColorAt(i, r > 0.87 ? gold : r > 0.55 ? blue : navy);
    });
    inst.current.instanceColor.needsUpdate = true;
  }, [data]);

  const camTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const p = progressRef.current;
    sm.current += (p - sm.current) * Math.min(1, delta * 4.5);
    const t = sm.current;
    const time = state.clock.elapsedTime;
    idle.current += delta * 0.12 * (0.25 + (1 - t) * 0.4);

    data.nodes.forEach((n, i) => {
      const k = ease(clamp01((t * 1.3 - 0.2 - n.delay * 0.42) / 0.5));
      cur[i].lerpVectors(n.scatter, n.organized, k);
      cur[i].y += Math.sin(time * 0.7 + n.phase) * 0.09 * (1 - k * 0.75);
      dummy.position.copy(cur[i]);
      dummy.scale.setScalar(0.11 * n.size * (1 + k * 0.35));
      dummy.updateMatrix();
      inst.current.setMatrixAt(i, dummy.matrix);
    });
    inst.current.instanceMatrix.needsUpdate = true;

    const netPos = netLines.geometry.attributes.position;
    data.pairs.forEach(([a, b], j) => {
      netPos.setXYZ(j * 2, cur[a].x, cur[a].y, cur[a].z);
      netPos.setXYZ(j * 2 + 1, cur[b].x, cur[b].y, cur[b].z);
    });
    netPos.needsUpdate = true;
    netLines.material.opacity = 0.38 * ease(clamp01((t - 0.28) / 0.25));

    const routePos = routeLines.geometry.attributes.position;
    data.innerIdx.forEach((a, j) => {
      routePos.setXYZ(j * 2, cur[a].x, cur[a].y, cur[a].z);
      routePos.setXYZ(j * 2 + 1, 0, 0.35, 0);
    });
    routePos.needsUpdate = true;
    routeLines.material.opacity = 0.95 * ease(clamp01((t - 0.52) / 0.22));

    const cs = ease(clamp01((t - 0.48) / 0.28));
    if (core.current) {
      core.current.scale.setScalar(Math.max(0.001, cs * (1 + Math.sin(time * 1.3) * 0.045)));
      core.current.rotation.y = time * 0.3;
    }
    if (coreRingA.current) {
      coreRingA.current.scale.setScalar(Math.max(0.001, cs));
      coreRingA.current.rotation.z = time * 0.25;
    }
    if (coreRingB.current) {
      coreRingB.current.scale.setScalar(Math.max(0.001, ease(clamp01((t - 0.62) / 0.25))));
      coreRingB.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.4) * 0.1;
    }

    if (group.current) group.current.rotation.y = idle.current;

    camTarget.set(state.pointer.x * 0.7, 1.4 + t * 4.6, 13.2 - t * 3.2);
    state.camera.position.lerp(camTarget, 0.05);
    state.camera.lookAt(0, 0.2, 0);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={inst} args={[undefined, undefined, data.N]}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshStandardMaterial roughness={0.35} metalness={0.3} />
      </instancedMesh>
      <primitive object={netLines} />
      <primitive object={routeLines} />
      <mesh ref={core} position={[0, 0.35, 0]}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#C8A44D" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh ref={coreRingA} position={[0, 0.35, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.85, 0.012, 8, 80]} />
        <meshBasicMaterial color="#C8A44D" transparent opacity={0.8} />
      </mesh>
      <mesh ref={coreRingB} position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.008, 8, 80]} />
        <meshBasicMaterial color="#0B2742" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function TradeScene({ progressRef }) {
  return (
    <WebGLGuard>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.4, 13.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, powerPreference: "default" }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#f7f8fa", 16, 34]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[6, 9, 5]} intensity={1.15} />
        <directionalLight position={[-7, 3, -4]} intensity={0.4} color="#F5EEDB" />
        <SupplyNetwork progressRef={progressRef} />
      </Canvas>
    </WebGLGuard>
  );
}
