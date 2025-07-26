import React from 'react';
import { motion } from 'framer-motion';

interface HolographicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glowColor?: string;
}

export const HolographicButton: React.FC<HolographicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  glowColor
}) => {
  const variants = {
    primary: 'from-cyan-400/20 to-blue-600/20 border-cyan-400/50 text-cyan-300',
    secondary: 'from-purple-400/20 to-pink-600/20 border-purple-400/50 text-purple-300',
    accent: 'from-green-400/20 to-emerald-600/20 border-green-400/50 text-green-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const baseGlow = glowColor || (variant === 'primary' ? '#00d4ff' : variant === 'secondary' ? '#9c27b0' : '#39ff14');

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-lg border-2 bg-gradient-to-br backdrop-blur-sm
        transition-all duration-300 font-semibold uppercase tracking-wider
        hover:shadow-lg hover:scale-105 active:scale-95
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      onClick={onClick}
      whileHover={{
        boxShadow: `0 0 30px ${baseGlow}40, inset 0 0 30px ${baseGlow}20`,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: `0 0 20px ${baseGlow}30, inset 0 0 20px ${baseGlow}10`,
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Corner accents */}
      <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-current opacity-60" />
      <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-current opacity-60" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-current opacity-60" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-current opacity-60" />
    </motion.button>
  );
};

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  glowIntensity = 'medium'
}) => {
  const glowLevels = {
    low: '0 0 20px rgba(0, 212, 255, 0.2), inset 0 0 20px rgba(0, 212, 255, 0.1)',
    medium: '0 0 40px rgba(0, 212, 255, 0.3), inset 0 0 30px rgba(0, 212, 255, 0.15)',
    high: '0 0 60px rgba(0, 212, 255, 0.4), inset 0 0 40px rgba(0, 212, 255, 0.2)'
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl border border-cyan-400/30 
        bg-gradient-to-br from-black/40 via-gray-900/50 to-black/60 
        backdrop-blur-lg p-6 ${className}
      `}
      whileHover={{
        borderColor: 'rgba(0, 212, 255, 0.6)',
        boxShadow: glowLevels.high,
      }}
      initial={{
        boxShadow: glowLevels[glowIntensity],
      }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          background: [
            'linear-gradient(0deg, rgba(0, 212, 255, 0.1), rgba(156, 39, 176, 0.1))',
            'linear-gradient(90deg, rgba(156, 39, 176, 0.1), rgba(57, 255, 20, 0.1))',
            'linear-gradient(180deg, rgba(57, 255, 20, 0.1), rgba(0, 212, 255, 0.1))',
            'linear-gradient(270deg, rgba(0, 212, 255, 0.1), rgba(156, 39, 176, 0.1))',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
      
      {/* Holographic scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        animate={{
          y: ['-100%', '400%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

interface HolographicBadgeProps {
  text: string;
  variant?: 'news' | 'trending' | 'featured' | 'breaking';
  animated?: boolean;
}

export const HolographicBadge: React.FC<HolographicBadgeProps> = ({
  text,
  variant = 'news',
  animated = true
}) => {
  const variants = {
    news: 'from-cyan-400/30 to-blue-600/30 border-cyan-400/60 text-cyan-300',
    trending: 'from-orange-400/30 to-red-600/30 border-orange-400/60 text-orange-300',
    featured: 'from-purple-400/30 to-pink-600/30 border-purple-400/60 text-purple-300',
    breaking: 'from-red-400/30 to-pink-600/30 border-red-400/60 text-red-300'
  };

  return (
    <motion.div
      className={`
        relative inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
        bg-gradient-to-r border backdrop-blur-sm ${variants[variant]}
      `}
      animate={animated ? {
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      } : {}}
      transition={animated ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      } : {}}
    >
      {text}
      
      {/* Pulsing glow effect for breaking news */}
      {variant === 'breaking' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-400/20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
};

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  intensity = 'medium'
}) => {
  const glitchVariants = {
    low: { x: [-1, 1, -1, 0], duration: 0.1 },
    medium: { x: [-2, 2, -2, 0], duration: 0.15 },
    high: { x: [-4, 4, -4, 0], duration: 0.2 }
  };

  const variant = glitchVariants[intensity];

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main text */}
      <motion.span
        className="relative z-10 text-white"
        animate={variant}
        transition={{
          repeat: Infinity,
          repeatDelay: Math.random() * 3 + 2,
          duration: variant.duration,
        }}
      >
        {text}
      </motion.span>
      
      {/* Glitch layers */}
      <span 
        className="absolute top-0 left-0 text-cyan-400 opacity-70"
        style={{ 
          transform: 'translateX(-2px)',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
        }}
      >
        {text}
      </span>
      
      <span 
        className="absolute top-0 left-0 text-red-400 opacity-70"
        style={{ 
          transform: 'translateX(2px)',
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const LoadingHologram: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-16 h-16">
        {/* Rotating outer ring */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Pulsing inner core */}
        <motion.div
          className="absolute inset-2 bg-cyan-400/20 rounded-full"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Scanning line */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
};