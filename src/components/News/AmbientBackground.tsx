import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random sphere positions for particles
const generateSphere = (count: number, radius: number) => {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Generate random point on sphere surface
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }
  
  return positions;
};

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = generateSphere(2000, 50);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow rotation around Y axis
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Subtle movement based on time
      const time = state.clock.elapsedTime;
      pointsRef.current.position.y = Math.sin(time * 0.5) * 2;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="hsl(210, 100%, 55%)"
        size={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

const FloatingGeometry = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.position.y = Math.sin(time * 0.8) * 3;
      meshRef.current.position.x = Math.cos(time * 0.6) * 5;
    }
  });

  return (
    <mesh ref={meshRef} position={[20, 0, -30]}>
      <torusKnotGeometry args={[2, 0.6, 128, 16]} />
      <meshBasicMaterial 
        color="hsl(150, 80%, 50%)" 
        transparent 
        opacity={0.3} 
        wireframe 
      />
    </mesh>
  );
};

export const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        
        <ParticleField />
        <FloatingGeometry />
        
        {/* Additional floating elements */}
        <mesh position={[-25, 10, -20]}>
          <icosahedronGeometry args={[1.5]} />
          <meshBasicMaterial 
            color="hsl(45, 100%, 60%)" 
            transparent 
            opacity={0.2} 
            wireframe 
          />
        </mesh>
      </Canvas>
    </div>
  );
};