import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function RotatingCube({ scrollProgress }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = scrollProgress * Math.PI * 2;
      meshRef.current.rotation.y = scrollProgress * Math.PI * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#003580" wireframe emissive="#003580" emissiveIntensity={0.3} />
    </mesh>
  );
}

function FloatingParticles({ scrollProgress }) {
  const particlesRef = useRef();
  const particleCount = 200;
  const positions = useRef(new Float32Array(particleCount * 3));

  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 15;
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    if (particlesRef.current) {
      particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions.current, 3));
    }
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = scrollProgress * Math.PI;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#00ff88" size={0.05} transparent opacity={0.5} />
    </points>
  );
}

export default function ScrollScene({ scrollProgress }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#003580" />
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#00ff88" />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Environment preset="night" />
        <RotatingCube scrollProgress={scrollProgress} />
        <FloatingParticles scrollProgress={scrollProgress} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}