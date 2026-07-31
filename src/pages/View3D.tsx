import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { motion } from "framer-motion";

function AdministrativeBlock() {
  return (
    <group position={[0, 1, 0]}>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[3, 1.5, 2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[2.4, 0.8, 1.6]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.4]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#e5e7eb" />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.4} />
      <Ground />
      <AdministrativeBlock />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={4}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
      />
      <Environment preset="city" />
    </>
  );
}

export default function View3D() {
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/40">
        <h2 className="text-sm font-semibold text-gray-900">Administrative Block</h2>
        <p className="text-xs text-gray-500">Drag to rotate · Scroll to zoom</p>
      </div>
      <Canvas
        camera={{ position: [6, 4, 8], fov: 50 }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
