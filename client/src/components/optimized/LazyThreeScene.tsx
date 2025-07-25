import React, { useRef, useEffect, useCallback, memo } from 'react';
import * as THREE from 'three';

interface LazyThreeSceneProps {
  isVisible: boolean;
  className?: string;
  onAnimationToggle?: (playing: boolean) => void;
}

const LazyThreeScene = memo(({ isVisible, className, onAnimationToggle }: LazyThreeSceneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const toolIconsRef = useRef<THREE.Mesh[]>([]);
  const isAnimatingRef = useRef(true);

  const cleanup = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    
    if (sceneRef.current) {
      sceneRef.current.clear();
      sceneRef.current = null;
    }
    
    toolIconsRef.current = [];
  }, []);

  const createOptimizedScene = useCallback(() => {
    if (!canvasRef.current || !isVisible) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: false, // Disable for better performance
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create instanced geometry for better performance
    const geometries = {
      box: new THREE.BoxGeometry(0.08, 0.12, 0.02),
      plane: new THREE.PlaneGeometry(0.1, 0.08),
      cylinder: new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8),
      sphere: new THREE.SphereGeometry(0.05, 8, 8) // Reduced segments for performance
    };

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x3B82F6 }),
      new THREE.MeshBasicMaterial({ color: 0x10B981 }),
      new THREE.MeshBasicMaterial({ color: 0xF59E0B }),
      new THREE.MeshBasicMaterial({ color: 0xEF4444 }),
      new THREE.MeshBasicMaterial({ color: 0x8B5CF6 })
    ];

    const toolTypes = ['box', 'plane', 'cylinder', 'sphere'];
    const toolIcons: THREE.Mesh[] = [];

    // Reduce number of objects for better performance
    for (let i = 0; i < 30; i++) {
      const typeIndex = i % toolTypes.length;
      const materialIndex = i % materials.length;
      const geometry = geometries[toolTypes[typeIndex] as keyof typeof geometries];
      const material = materials[materialIndex];
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        Math.random() * 20 - 10,
        Math.random() * 15 - 7.5,
        Math.random() * 10 - 5
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      scene.add(mesh);
      toolIcons.push(mesh);
    }

    toolIconsRef.current = toolIcons;
    camera.position.z = 12;

    const animate = () => {
      if (!isAnimatingRef.current || !sceneRef.current || !rendererRef.current) return;
      
      // Optimized animation with reduced calculations
      const time = Date.now() * 0.001;
      toolIconsRef.current.forEach((icon, index) => {
        const offset = index * 0.1;
        icon.rotation.x += 0.005;
        icon.rotation.y += 0.005;
        icon.position.y += Math.sin(time + offset) * 0.001;
        icon.position.x += Math.cos(time * 0.8 + offset) * 0.0008;
      });

      rendererRef.current.render(sceneRef.current, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (camera && rendererRef.current) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [isVisible, cleanup]);

  useEffect(() => {
    if (!isVisible) {
      cleanup();
      return;
    }

    const cleanupFn = createOptimizedScene();
    
    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [isVisible, createOptimizedScene, cleanup]);

  const toggleAnimation = useCallback(() => {
    isAnimatingRef.current = !isAnimatingRef.current;
    onAnimationToggle?.(isAnimatingRef.current);
    
    if (isAnimatingRef.current && sceneRef.current && rendererRef.current) {
      const animate = () => {
        if (!isAnimatingRef.current) return;
        
        const time = Date.now() * 0.001;
        toolIconsRef.current.forEach((icon, index) => {
          const offset = index * 0.1;
          icon.rotation.x += 0.005;
          icon.rotation.y += 0.005;
          icon.position.y += Math.sin(time + offset) * 0.001;
          icon.position.x += Math.cos(time * 0.8 + offset) * 0.0008;
        });

        rendererRef.current!.render(sceneRef.current!, new THREE.PerspectiveCamera());
        animationIdRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
  }, [onAnimationToggle]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        willChange: 'transform'
      }}
      onClick={toggleAnimation}
    />
  );
});

LazyThreeScene.displayName = 'LazyThreeScene';

export default LazyThreeScene;