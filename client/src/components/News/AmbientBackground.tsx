import { useRef, useEffect } from 'react';

// Simplified CSS-based background animation
export const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20" />
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );

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