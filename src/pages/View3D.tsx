import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";

function LowPolyAdministrativeBlock() {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[3.4, 1.8, 2.2]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2.2, 0]}>
        <boxGeometry args={[2.6, 1, 1.8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.0, 0]}>
        <boxGeometry args={[1.3, 0.45, 1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <RoundedBox args={[0.9, 0.15, 0.9]} radius={0.05} position={[0, 3.45, 0]}>
        <meshStandardMaterial color="#475569" />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#dbeafe" />
      </mesh>
      <mesh position={[-2.2, 0.1, -1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 24]} />
        <meshStandardMaterial color="#60a5fa" />
      </mesh>
      <mesh position={[2.3, 0.1, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 4, -5]} intensity={0.5} />
      <LowPolyAdministrativeBlock />
      <OrbitControls
        enablePan
        enableRotate
        enableZoom
        minDistance={4}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.2}
      />
      <Environment preset="city" />
    </>
  );
}

export default function View3D() {
  return (
    <motion.div
      className="relative h-full w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute left-4 top-4 z-10 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Administrative Block
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Drag to rotate • Scroll to zoom • Pan around the building
        </p>
      </div>

      <Canvas
        shadows
        camera={{ position: [6.2, 4.2, 7.5], fov: 48 }}
        dpr={[1, 2]}
        className="h-full w-full"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
