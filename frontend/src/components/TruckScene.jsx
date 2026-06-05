// src/components/TruckScene.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Sparkles, Html } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";

function WireframeTruck({ position, color }) {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.x = -5;
      const animate = () => {
        if (meshRef.current.position.x > 5) meshRef.current.position.x = -5;
        meshRef.current.position.x += 0.008;
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, []);

  return (
    <group ref={meshRef} position={position}>
      {/* Cab */}
      <mesh position={[0.5, 0.5, 0]}>
        <boxGeometry args={[1, 0.8, 1.2]} />
        <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Trailer */}
      <mesh position={[-1, 0.4, 0]}>
        <boxGeometry args={[2, 0.6, 1.2]} />
        <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Wheels */}
      {[-0.8, 0.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, -0.1, 0.6]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" />
        </mesh>
      ))}
    </group>
  );
}

export default function TruckScene() {
  return (
    <section className="relative h-screen py-20" id="features">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
          <Suspense fallback={null}>
            <Environment preset="night" />
            <Sparkles count={300} scale={10} size={0.2} color="#00ff88" />
            <WireframeTruck position={[-3, 0, 0]} color="#00ff88" />
            <WireframeTruck position={[1, -0.2, 1]} color="#00aaff" />
            {/* Grid floor */}
            <gridHelper args={[20, 20, "#00ff88", "#333333"]} position={[0, -1, 0]} />
            {/* Moving lines */}
            <lineLoop points={[new THREE.Vector3(-5, -0.5, 2), new THREE.Vector3(5, -0.5, 2)]} color="#00ff88" />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      <div className="relative z-10 flex items-center justify-center h-full bg-black/40 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white">Autonomous Fleet</h2>
          <p className="mt-4 text-xl text-gray-300">Real-time AI orchestrated logistics</p>
        </div>
      </div>
    </section>
  );
}