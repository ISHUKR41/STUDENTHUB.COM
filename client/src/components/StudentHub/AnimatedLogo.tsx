import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 60, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    // Create graduation cap base
    const capGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 8);
    const capMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.9
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.1;
    scene.add(cap);

    // Create graduation cap top (board)
    const boardGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.8);
    const boardMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1E40AF,
      transparent: true,
      opacity: 0.9
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 0.2;
    scene.add(board);

    // Create tassel
    const tasselGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const tasselMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xF59E0B,
      transparent: true,
      opacity: 0.9
    });
    const tassel = new THREE.Mesh(tasselGeometry, tasselMaterial);
    tassel.position.set(0.3, 0.25, 0.3);
    scene.add(tassel);

    // Create tassel string
    const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 4);
    const stringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xF59E0B,
      transparent: true,
      opacity: 0.7
    });
    const string = new THREE.Mesh(stringGeometry, stringMaterial);
    string.position.set(0.3, 0.17, 0.3);
    scene.add(string);

    // Create floating particles
    const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x10B981,
      transparent: true,
      opacity: 0.6
    });
    
    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      scene.add(particle);
      particles.push(particle);
    }

    camera.position.z = 2;

    const animate = () => {
      // Rotate the main cap
      cap.rotation.y += 0.02;
      board.rotation.y += 0.02;
      
      // Swing the tassel
      tassel.position.x = 0.3 + Math.sin(Date.now() * 0.003) * 0.1;
      tassel.position.z = 0.3 + Math.cos(Date.now() * 0.003) * 0.1;
      string.position.x = tassel.position.x;
      string.position.z = tassel.position.z;
      
      // Animate particles
      particles.forEach((particle, index) => {
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
        particle.position.y += Math.sin(Date.now() * 0.002 + index) * 0.003;
        particle.position.x += Math.cos(Date.now() * 0.0015 + index) * 0.002;
      });

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [size]);

  return (
    <div className={`inline-block ${className}`}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        className="rounded-lg"
        style={{ 
          filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
          transition: 'all 0.3s ease'
        }}
      />
    </div>
  );
};