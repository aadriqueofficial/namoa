import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
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

function StrategyEngine({ progressRef }) {
  const inst = useRef();
  const group = useRef();
  const platform = useRef();
  const apex = useRef();
  const sm = useRef(0);
  const idle = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const size = isMobile ? 5 : 7;
    const rng = mulberry32(13);
    const boxes = [];
    const half = (size - 1) / 2;
    for (let gx = 0; gx < size; gx++) {
      for (let gz = 0; gz < size; gz++) {
        const x = (gx - half) * 1.06;
        const z = (gz - half) * 1.06;
        const dist = Math.sqrt(x * x + z * z);
        const h = Math.max(0.45, 2.9 - dist * 0.52 + rng() * 0.35);
        boxes.push({
          target: new THREE.Vector3(x, h / 2, z),
          h,
          scatter: new THREE.Vector3((rng() - 0.5) * 12 + 2.2, 1.5 + (rng() - 0.5) * 8, (rng() - 0.5) * 11),
          rot: new THREE.Euler(rng() * 2.4, rng() * 2.4, rng() * 2.4),
          delay: rng(),
          phase: rng() * Math.PI * 2,
          center: dist < 0.1,
        });
      }
    }
    // gold pathway over tops
    const route = [];
    const cellAt = (gx, gz) => boxes[gx * size + gz];
    const walk = [
      [0, 0],
      [size - 1, 0],
      [size - 1, size - 1],
      [0, size - 1],
      [0, Math.floor(size / 2)],
      [Math.floor(size / 2), Math.floor(size / 2)],
    ];
    walk.forEach(([gx, gz]) => {
      const b = cellAt(gx, gz);
      route.push(new THREE.Vector3(b.target.x, b.h + 0.12, b.target.z));
    });
    return { boxes, route, N: boxes.length };
  }, []);

  const cur = useMemo(() => data.boxes.map(() => new THREE.Vector3()), [data]);

  const pathLine = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(data.route);
    const pts = curve.getPoints(140);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({ color: "#C8A44D", transparent: true, opacity: 0.95 });
    return { line: new THREE.Line(geo, mat), count: pts.length };
  }, [data]);

  useEffect(() => {
    const rng = mulberry32(31);
    const white = new THREE.Color("#ffffff");
    const soft = new THREE.Color("#E8EDF2");
    const navy = new THREE.Color("#0B2742");
    const blue = new THREE.Color("#174E73");
    const gold = new THREE.Color("#C8A44D");
    data.boxes.forEach((b, i) => {
      const r = rng();
      inst.current.setColorAt(i, b.center ? gold : r > 0.85 ? navy : r > 0.7 ? blue : r > 0.4 ? white : soft);
    });
    inst.current.instanceColor.needsUpdate = true;
  }, [data]);

  const camTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const p = progressRef.current;
    sm.current += (p - sm.current) * Math.min(1, delta * 4.5);
    const t = sm.current;
    const time = state.clock.elapsedTime;
    idle.current += delta * 0.1 * (0.3 + (1 - t) * 0.5);

    data.boxes.forEach((b, i) => {
      const k = ease(clamp01((t * 1.38 - 0.16 - b.delay * 0.48) / 0.46));
      cur[i].lerpVectors(b.scatter, b.target, k);
      cur[i].y += Math.sin(time * 0.8 + b.phase) * 0.1 * (1 - k * 0.85);
      dummy.position.copy(cur[i]);
      dummy.rotation.set(b.rot.x * (1 - k), b.rot.y * (1 - k), b.rot.z * (1 - k));
      const sy = 0.5 + k * (b.h - 0.5);
      dummy.scale.set(0.74, sy, 0.74);
      dummy.updateMatrix();
      inst.current.setMatrixAt(i, dummy.matrix);
    });
    inst.current.instanceMatrix.needsUpdate = true;

    if (platform.current) {
      const ps = ease(clamp01((t - 0.18) / 0.22));
      platform.current.scale.set(Math.max(0.001, ps), 1, Math.max(0.001, ps));
    }

    const pf = ease(clamp01((t - 0.66) / 0.24));
    pathLine.line.geometry.setDrawRange(0, Math.floor(pf * pathLine.count));

    if (apex.current) {
      const as = ease(clamp01((t - 0.78) / 0.18));
      apex.current.scale.setScalar(Math.max(0.001, as));
      apex.current.rotation.y = time * 0.4;
      apex.current.position.y = 3.6 + Math.sin(time * 1.2) * 0.08;
    }

    if (group.current) group.current.rotation.y = idle.current - t * 0.35;

    camTarget.set(
      8.2 - t * 7.4 + state.pointer.x * 0.6,
      3.2 + t * 3.6 - state.pointer.y * 0.4,
      10.6 - t * 0.4
    );
    state.camera.position.lerp(camTarget, 0.045);
    state.camera.lookAt(0, 1.1, 0);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={inst} args={[undefined, undefined, data.N]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.4} metalness={0.25} />
      </instancedMesh>
      <mesh ref={platform} position={[0, -0.1, 0]}>
        <boxGeometry args={[8.8, 0.16, 8.8]} />
        <meshStandardMaterial color="#E6EBF0" roughness={0.55} metalness={0.15} />
      </mesh>
      <primitive object={pathLine.line} />
      <mesh ref={apex} position={[0, 3.6, 0]} scale={0.001}>
        <octahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color="#C8A44D" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function ConsultingScene({ progressRef }) {
  return (
    <WebGLGuard>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [8.2, 3.2, 10.6], fov: 45 }}
        gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, powerPreference: "default" }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#f7f8fa", 17, 36]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[7, 10, 6]} intensity={1.2} />
        <directionalLight position={[-6, 4, -6]} intensity={0.45} color="#F5EEDB" />
        <StrategyEngine progressRef={progressRef} />
        <Grid
          position={[0, -0.19, 0]}
          args={[50, 50]}
          cellSize={1.1}
          cellThickness={0.5}
          cellColor="#dde4ea"
          sectionSize={5.5}
          sectionThickness={0.9}
          sectionColor="#ccd6df"
          fadeDistance={28}
          fadeStrength={1.4}
          infiniteGrid
        />
      </Canvas>
    </WebGLGuard>
  );
}
