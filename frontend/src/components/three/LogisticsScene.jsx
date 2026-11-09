import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { WebGLGuard } from "./WebGLGuard";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => t * t * (3 - 2 * t);

const WHITE = { color: "#ffffff", roughness: 0.3, metalness: 0.3 };
const NAVY = { color: "#0B2742", roughness: 0.45, metalness: 0.25 };
const BLUE = { color: "#174E73", roughness: 0.45, metalness: 0.25 };
const GOLD = { color: "#C8A44D", roughness: 0.25, metalness: 0.8 };

function Truck({ truckRef }) {
  return (
    <group ref={truckRef}>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 24]} />
        <meshBasicMaterial color="#0B2742" transparent opacity={0.07} />
      </mesh>
      {/* chassis */}
      <mesh position={[-0.2, 0.42, 0]}>
        <boxGeometry args={[4.3, 0.16, 0.85]} />
        <meshStandardMaterial color="#13202B" roughness={0.6} />
      </mesh>
      {/* trailer */}
      <mesh position={[-0.75, 1.22, 0]}>
        <boxGeometry args={[3.15, 1.4, 1.15]} />
        <meshStandardMaterial {...WHITE} />
      </mesh>
      <mesh position={[-0.75, 0.56, 0]}>
        <boxGeometry args={[3.17, 0.13, 1.16]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[-0.75, 1.35, 0.582]}>
        <planeGeometry args={[1.1, 0.26]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh position={[-0.75, 1.35, -0.582]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.1, 0.26]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      {/* cab */}
      <mesh position={[1.5, 0.95, 0]}>
        <boxGeometry args={[0.95, 1.1, 1.02]} />
        <meshStandardMaterial {...WHITE} />
      </mesh>
      <mesh position={[1.5, 0.48, 0]}>
        <boxGeometry args={[0.97, 0.22, 1.03]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[1.99, 1.18, 0]}>
        <boxGeometry args={[0.05, 0.42, 0.88]} />
        <meshStandardMaterial color="#174E73" roughness={0.15} metalness={0.6} />
      </mesh>
      <mesh position={[1.99, 0.62, 0]}>
        <boxGeometry args={[0.04, 0.1, 0.7]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      {/* wheels */}
      {[
        [-1.85, 0.5],
        [-1.85, -0.5],
        [-1.15, 0.5],
        [-1.15, -0.5],
        [1.45, 0.5],
        [1.45, -0.5],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.32, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.31, 0.31, 0.2, 20]} />
            <meshStandardMaterial color="#1a222b" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.06 : -0.06]}>
            <cylinderGeometry args={[0.13, 0.13, 0.12, 16]} />
            <meshStandardMaterial {...GOLD} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Warehouse() {
  return (
    <group position={[-7.6, 0, -1.6]}>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[3, 1.9, 2.5]} />
        <meshStandardMaterial {...WHITE} />
      </mesh>
      <mesh position={[0, 1.98, 0]}>
        <boxGeometry args={[3.15, 0.14, 2.65]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[0, 0.75, 1.26]}>
        <planeGeometry args={[1.2, 1.3]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh position={[-2.1, 0.55, 0.6]}>
        <boxGeometry args={[1.1, 1.1, 1.2]} />
        <meshStandardMaterial color="#EEF1F3" roughness={0.5} />
      </mesh>
      <mesh position={[2, 0.45, 0.9]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial {...BLUE} />
      </mesh>
    </group>
  );
}

function Containers() {
  const boxes = [
    [-1.4, 0.36, -2.4, "#0B2742"],
    [-1.4, 1.06, -2.4, "#174E73"],
    [0.3, 0.36, -2.7, "#ffffff"],
    [0.3, 0.36, -1.7, "#C8A44D"],
    [1.9, 0.36, -2.5, "#0B2742"],
  ];
  return (
    <group>
      {boxes.map(([x, y, z, c], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[1.5, 0.68, 0.66]} />
          <meshStandardMaterial color={c} roughness={0.45} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function PortCrane({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.16, 3, 0.16]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[0.8, 2.92, 0]}>
        <boxGeometry args={[1.9, 0.14, 0.14]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[1.55, 2.3, 0]}>
        <boxGeometry args={[0.05, 1.1, 0.05]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
}

function Destination({ ringRef }) {
  return (
    <group position={[8.3, 0, -0.9]}>
      <mesh position={[0, 1.5, -0.4]}>
        <boxGeometry args={[1, 3, 1]} />
        <meshStandardMaterial {...WHITE} />
      </mesh>
      <mesh position={[0, 3.05, -0.4]}>
        <boxGeometry args={[1.08, 0.12, 1.08]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[1.1, 1, 0.3]}>
        <boxGeometry args={[0.75, 2, 0.75]} />
        <meshStandardMaterial color="#EEF1F3" roughness={0.5} />
      </mesh>
      <mesh position={[1.1, 2.06, 0.3]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.03, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.045, 8, 60]} />
        <meshBasicMaterial color="#C8A44D" transparent opacity={0} />
      </mesh>
    </group>
  );
}

function JourneyScene({ progressRef }) {
  const truckRef = useRef();
  const ringRef = useRef();
  const originRef = useRef();
  const sm = useRef(0);
  const camPos = useMemo(() => new THREE.Vector3(-4, 2.8, 9), []);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8.2, 0, 0.9),
        new THREE.Vector3(-4.2, 0, -0.2),
        new THREE.Vector3(0.2, 0, 0.9),
        new THREE.Vector3(4.2, 0, -0.3),
        new THREE.Vector3(8.3, 0, 0.4),
      ]),
    []
  );

  const routeTube = useMemo(() => {
    const geo = new THREE.TubeGeometry(curve, 200, 0.035, 8, false);
    geo.setDrawRange(0, 0);
    const mat = new THREE.MeshBasicMaterial({ color: "#C8A44D" });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.045;
    return mesh;
  }, [curve]);
  const routeIndexCount = useMemo(() => routeTube.geometry.index.count, [routeTube]);

  const ghostLine = useMemo(() => {
    const pts = curve.getPoints(120).map((p) => new THREE.Vector3(p.x, 0.03, p.z));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#0B2742", transparent: true, opacity: 0.12 }));
  }, [curve]);

  const coordMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#174E73", transparent: true, opacity: 0 }),
    []
  );
  const coordLines = useMemo(() => {
    const mk = (pts) =>
      new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(...p))), coordMat);
    return [
      mk([[-4.2, 0.03, -0.2], [-1.4, 0.03, -1.9], [1.9, 0.03, -2.1]]),
      mk([[-4.2, 0.03, -0.2], [-2.2, 0.03, 1.9], [3.4, 0.03, 1.6], [4.1, 0.03, -0.1]]),
    ];
  }, [coordMat]);

  const tangent = useMemo(() => new THREE.Vector3(), []);
  const truckPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const p = progressRef.current;
    sm.current += (p - sm.current) * Math.min(1, delta * 4.5);
    const t = sm.current;
    const time = state.clock.elapsedTime;

    const u = ease(clamp01((t - 0.18) / 0.72));
    curve.getPointAt(Math.min(0.999, Math.max(0.001, u)), truckPos);
    curve.getTangentAt(Math.min(0.999, Math.max(0.001, u)), tangent);
    if (truckRef.current) {
      truckRef.current.position.set(truckPos.x, Math.sin(time * 7) * 0.012 * (u > 0.01 && u < 0.99 ? 1 : 0), truckPos.z);
      truckRef.current.rotation.y = Math.atan2(-tangent.z, tangent.x);
    }

    const routeT = ease(clamp01((t - 0.14) / 0.72));
    routeTube.geometry.setDrawRange(0, Math.floor(Math.min(1, routeT + 0.04) * routeIndexCount));

    if (originRef.current) {
      const os = ease(clamp01((t - 0.16) / 0.12));
      originRef.current.scale.setScalar(Math.max(0.001, os * (1 + Math.sin(time * 2) * 0.08)));
    }

    coordMat.opacity = 0.5 * ease(clamp01((t - 0.36) / 0.16));

    if (ringRef.current) {
      const ds = ease(clamp01((t - 0.8) / 0.14));
      ringRef.current.material.opacity = ds * 0.95;
      const pulse = 1 + ((time * 0.7) % 1) * 0.5 * ds;
      ringRef.current.scale.setScalar(Math.max(0.001, ds * pulse));
    }

    // camera: wide environment view on intro, follows truck, tightens during MOVE stage
    const zoom = t > 0.55 && t < 0.82 ? 9.5 : 11.8;
    const cx = Math.max(truckPos.x * 0.55 + 1.2, -3.0);
    camPos.set(cx + state.pointer.x * 0.5, 3.1 - state.pointer.y * 0.35, zoom);
    state.camera.position.lerp(camPos, 0.045);
    const lx = Math.max(truckPos.x * 0.7 + 0.6, -2.4);
    state.camera.lookAt(lx, 0.7, 0);
  });

  return (
    <group>
      <Grid
        position={[0, 0, 0]}
        args={[50, 50]}
        cellSize={1.1}
        cellThickness={0.55}
        cellColor="#dbe2e9"
        sectionSize={5.5}
        sectionThickness={1}
        sectionColor="#c8d3dd"
        fadeDistance={30}
        fadeStrength={1.4}
        infiniteGrid
      />
      <primitive object={ghostLine} />
      <primitive object={routeTube} />
      {coordLines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      <Warehouse />
      <Containers />
      <PortCrane position={[3.6, 0, -3.4]} />
      <PortCrane position={[5.4, 0, -4]} />
      <Destination ringRef={ringRef} />
      <group ref={originRef} position={[-8.2, 0, 0.9]} scale={0.001}>
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.03, 8, 40]} />
          <meshBasicMaterial color="#C8A44D" transparent opacity={0.8} />
        </mesh>
      </group>
      <Truck truckRef={truckRef} />
    </group>
  );
}

export default function LogisticsScene({ progressRef }) {
  return (
    <WebGLGuard>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [-1.6, 3.1, 12.6], fov: 45 }}
        gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, powerPreference: "default" }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#f7f8fa", 18, 38]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[6, 10, 6]} intensity={1.25} />
        <directionalLight position={[-8, 4, -5]} intensity={0.4} color="#F5EEDB" />
        <JourneyScene progressRef={progressRef} />
      </Canvas>
    </WebGLGuard>
  );
}
