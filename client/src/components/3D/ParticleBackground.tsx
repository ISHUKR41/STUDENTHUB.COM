import React from 'react';
import { motion } from 'framer-motion';

// Animated particle component using CSS and Framer Motion
const AnimatedParticle: React.FC<{ 
  delay: number; 
  duration: number; 
  startX: number; 
  startY: number; 
}> = ({ delay, duration, startX, startY }) => (
  <motion.div
    className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
    initial={{ x: startX, y: startY, opacity: 0 }}
    animate={{
      x: [startX, startX + Math.random() * 200 - 100, startX],
      y: [startY, startY + Math.random() * 200 - 100, startY],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

// Floating shapes using CSS transforms
const FloatingShape: React.FC<{ 
  size: number;
  color: string;
  delay: number;
  x: number;
  y: number;
}> = ({ size, color, delay, x, y }) => (
  <motion.div
    className="absolute rounded-lg backdrop-blur-sm"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      left: `${x}%`,
      top: `${y}%`,
    }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

const ParticleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black"
        animate={{
          background: [
            'linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #000000 100%)',
            'linear-gradient(135deg, #1e1b4b 0%, #111827 50%, #000000 100%)',
            'linear-gradient(135deg, #000000 0%, #1e1b4b 50%, #111827 100%)',
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Animated Particles */}
      {[...Array(20)].map((_, i) => (
        <AnimatedParticle
          key={i}
          delay={i * 0.5}
          duration={3 + Math.random() * 2}
          startX={Math.random() * 800}
          startY={Math.random() * 600}
        />
      ))}

      {/* Floating Geometric Shapes */}
      <FloatingShape size={12} color="rgba(0, 212, 255, 0.3)" delay={0} x={10} y={20} />
      <FloatingShape size={8} color="rgba(57, 255, 20, 0.3)" delay={1} x={80} y={10} />
      <FloatingShape size={16} color="rgba(156, 39, 176, 0.3)" delay={2} x={20} y={70} />
      <FloatingShape size={10} color="rgba(255, 107, 53, 0.3)" delay={3} x={70} y={60} />
      <FloatingShape size={14} color="rgba(0, 212, 255, 0.2)" delay={4} x={90} y={80} />

      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default ParticleBackground;