import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles, Environment } from "@react-three/drei";

function RotatingCube() {
  return (
    <mesh position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#003580" wireframe emissive="#003580" emissiveIntensity={0.3} />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={1000} factor={4} fade />
        <Sparkles count={200} scale={10} size={0.2} color="#003580" />
        <RotatingCube />
        <Environment preset="night" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}