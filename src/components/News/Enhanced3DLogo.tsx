import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, GraduationCap, TrendingUp, Newspaper, Zap, Star } from 'lucide-react';

interface Enhanced3DLogoProps {
  className?: string;
  onClick?: () => void;
}

export const Enhanced3DLogo = ({ className = "", onClick }: Enhanced3DLogoProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), {
    stiffness: 200,
    damping: 20
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), {
    stiffness: 200,
    damping: 20
  });

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        perspective: 1000,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* 3D Container */}
      <motion.div
        className="relative w-16 h-16 md:w-20 md:h-20"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-accent opacity-20 blur-xl"
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.4 : 0.2
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Main logo container */}
        <motion.div
          className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-glow)) 50%, hsl(var(--accent)) 100%)',
            boxShadow: isHovered 
              ? '0 20px 40px -10px hsl(var(--primary) / 0.4)' 
              : '0 10px 20px -5px hsl(var(--primary) / 0.2)'
          }}
          animate={{
            boxShadow: isHovered 
              ? '0 20px 40px -10px hsl(var(--primary) / 0.4)' 
              : '0 10px 20px -5px hsl(var(--primary) / 0.2)'
          }}
        >
          {/* Main icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <motion.div
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Newspaper className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" />
              </motion.div>
              
              {/* Animated sparkles */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
              </motion.div>

              <motion.div
                className="absolute -bottom-1 -left-1"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [360, 180, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
              </motion.div>
            </div>
          </div>

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(45deg, transparent, hsl(var(--primary-glow)), transparent)',
              opacity: 0
            }}
            animate={{
              opacity: isHovered ? 0.3 : 0,
              rotate: isHovered ? 360 : 0
            }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};