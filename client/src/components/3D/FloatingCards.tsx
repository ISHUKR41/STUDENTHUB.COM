import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Calendar, Eye, Heart, Share2, BookOpen, ExternalLink } from 'lucide-react';
import { HolographicBadge } from './HolographicUI';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishDate: string;
  readTime: number;
  views: number;
  likes: number;
  shares: number;
  featured: boolean;
  status: 'draft' | 'active' | 'featured' | 'archived';
  images?: { url: string; alt: string; caption?: string }[];
}

interface FloatingCardProps {
  article: NewsArticle;
  index: number;
  onCardClick?: (article: NewsArticle) => void;
  depth?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ 
  article, 
  index, 
  onCardClick,
  depth = 0 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for 3D transforms
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform motion values to rotation values
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Academic': 'from-blue-500/20 to-cyan-500/20 border-blue-400/50',
      'Exam': 'from-orange-500/20 to-red-500/20 border-orange-400/50',
      'Scholarship': 'from-green-500/20 to-emerald-500/20 border-green-400/50',
      'Career': 'from-purple-500/20 to-pink-500/20 border-purple-400/50',
      'Technology': 'from-yellow-500/20 to-amber-500/20 border-yellow-400/50',
      'Sports': 'from-red-500/20 to-pink-500/20 border-red-400/50',
      'General': 'from-gray-500/20 to-slate-500/20 border-gray-400/50'
    };
    return colors[category as keyof typeof colors] || colors.General;
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative cursor-pointer group perspective-1000
        ${depth > 0 ? 'ml-4 mt-2' : ''}
      `}
      initial={{ 
        opacity: 0, 
        y: 50,
        z: depth * -50,
        scale: 1 - (depth * 0.1)
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        z: depth * -50,
        scale: 1 - (depth * 0.1)
      }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        scale: 1.05 - (depth * 0.05),
        zIndex: 50 - depth,
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onCardClick?.(article)}
    >
      {/* Card Container */}
      <motion.div
        className={`
          relative overflow-hidden rounded-2xl border-2 backdrop-blur-lg
          bg-gradient-to-br ${getCategoryColor(article.category)}
          transition-all duration-500 p-6 min-h-[280px]
        `}
        animate={{
          boxShadow: isHovered 
            ? '0 20px 60px rgba(0, 212, 255, 0.4), inset 0 0 40px rgba(0, 212, 255, 0.1)'
            : '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)',
        }}
        style={{
          transform: 'translateZ(50px)',
        }}
      >
        {/* Floating particles effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  scale: 0,
                }}
                animate={{
                  y: [null, -20, -40],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          {article.featured && (
            <HolographicBadge text="Featured" variant="featured" />
          )}
          {article.category === 'Breaking' && (
            <HolographicBadge text="Breaking" variant="breaking" />
          )}
          <HolographicBadge text={article.category} variant="news" animated={false} />
        </div>

        {/* Image section */}
        {article.images && article.images.length > 0 && (
          <motion.div 
            className="relative mb-4 rounded-xl overflow-hidden h-32"
            style={{ transform: 'translateZ(20px)' }}
          >
            <img
              src={article.images[0].url}
              alt={article.images[0].alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Title */}
          <motion.h3 
            className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300"
            style={{ transform: 'translateZ(30px)' }}
          >
            {article.title}
          </motion.h3>

          {/* Summary */}
          <motion.p 
            className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed"
            style={{ transform: 'translateZ(20px)' }}
          >
            {article.summary}
          </motion.p>

          {/* Metadata */}
          <motion.div 
            className="flex items-center justify-between text-xs text-gray-400 mb-4"
            style={{ transform: 'translateZ(10px)' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(article.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </motion.div>

          {/* Engagement stats */}
          <motion.div 
            className="flex items-center justify-between pt-3 border-t border-white/10"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer">
                <Eye className="w-4 h-4" />
                <span className="text-xs">{article.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
                <Heart className="w-4 h-4" />
                <span className="text-xs">{article.likes}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-green-400 transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
                <span className="text-xs">{article.shares}</span>
              </div>
            </div>
            
            <motion.div
              className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>

        {/* Holographic scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none"
          animate={isHovered ? {
            y: [0, 280, 0],
            opacity: [0, 1, 0],
          } : {}}
          transition={{
            duration: 2,
            ease: 'easeInOut',
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/60 opacity-60" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/60 opacity-60" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/60 opacity-60" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/60 opacity-60" />
      </motion.div>

      {/* 3D depth shadow */}
      <div 
        className={`
          absolute inset-0 bg-black/20 rounded-2xl -z-10
          transform translate-x-2 translate-y-2 transition-transform duration-300
          ${isHovered ? 'translate-x-4 translate-y-4' : ''}
        `}
        style={{
          transform: `translateZ(-10px) translateX(${depth * 4}px) translateY(${depth * 4}px)`,
        }}
      />
    </motion.div>
  );
};

interface FloatingCardsGridProps {
  articles: NewsArticle[];
  onCardClick?: (article: NewsArticle) => void;
  maxDepth?: number;
}

export const FloatingCardsGrid: React.FC<FloatingCardsGridProps> = ({ 
  articles, 
  onCardClick,
  maxDepth = 2 
}) => {
  const getCardDepth = (index: number) => {
    return Math.floor(Math.random() * (maxDepth + 1));
  };

  return (
    <div className="relative">
      {/* 3D Container */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 perspective-1000"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {articles.map((article, index) => (
          <FloatingCard
            key={article.id}
            article={article}
            index={index}
            onCardClick={onCardClick}
            depth={getCardDepth(index)}
          />
        ))}
      </div>

      {/* Ambient lighting effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default FloatingCard;