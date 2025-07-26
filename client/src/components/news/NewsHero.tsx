import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Clock, 
  User, 
  Calendar, 
  Eye, 
  TrendingUp,
  ExternalLink,
  Play,
  Pause
} from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  subtitle?: string;
  summary: string;
  fullContent: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  readTime: number;
  featured: boolean;
  priority: number;
  images: Array<{url: string, alt: string, caption: string}>;
  views: number;
  likes: number;
  shares: number;
}

interface NewsHeroProps {
  article: NewsArticle;
}

export const NewsHero: React.FC<NewsHeroProps> = ({ article }) => {
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  useEffect(() => {
    // Auto-advance images if multiple images available
    if (article.images.length > 1 && isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % article.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [article.images.length, isAutoPlay]);

  useEffect(() => {
    // Typewriter effect for title
    if (textRef.current) {
      const title = textRef.current.querySelector('.hero-title');
      if (title) {
        gsap.fromTo(title.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power2.out"
          }
        );
      }
    }
  }, [article.title]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      'Academic': 'from-blue-600 via-blue-500 to-cyan-500',
      'Exam': 'from-red-600 via-red-500 to-pink-500',
      'Scholarship': 'from-green-600 via-green-500 to-emerald-500',
      'Career': 'from-purple-600 via-purple-500 to-violet-500',
      'Technology': 'from-cyan-600 via-cyan-500 to-blue-500',
      'Sports': 'from-orange-600 via-orange-500 to-amber-500',
      'General': 'from-gray-600 via-gray-500 to-slate-500'
    };
    return gradients[category as keyof typeof gradients] || gradients.General;
  };

  const openArticle = () => {
    window.open(`/news/${article.id}`, '_blank');
  };

  return (
    <motion.div
      ref={heroRef}
      style={{ y, opacity }}
      className="relative h-[70vh] min-h-[500px] rounded-3xl overflow-hidden group cursor-pointer"
      onClick={openArticle}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {article.images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
        
        {/* Fallback gradient if no images */}
        {article.images.length === 0 && (
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(article.category)}`} />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.2
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${80 + Math.sin(i) * 20}%`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
        <div ref={textRef} className="max-w-4xl">
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl border border-white/20
              bg-gradient-to-r ${getCategoryGradient(article.category)} bg-opacity-20
            `}>
              <TrendingUp size={16} className="text-white" />
              <span className="text-white font-semibold text-sm">
                {article.category.toUpperCase()}
              </span>
              {article.featured && (
                <span className="px-2 py-1 bg-yellow-400/20 text-yellow-300 text-xs rounded-full border border-yellow-400/30">
                  FEATURED
                </span>
              )}
            </div>
          </motion.div>

          {/* Title with Typewriter Effect */}
          <motion.h1
            className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {article.title.split(' ').map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          {article.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed"
            >
              {article.subtitle}
            </motion.p>
          )}

          {/* Summary */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-lg text-white/80 mb-8 leading-relaxed max-w-2xl"
          >
            {article.summary}
          </motion.p>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap items-center gap-6 text-white/70 mb-8"
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(article.publishDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{article.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={18} />
              <span>{article.views.toLocaleString()} views</span>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex items-center gap-4"
          >
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                openArticle();
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-8 py-4 bg-gradient-to-r ${getCategoryGradient(article.category)} 
                text-white font-semibold rounded-2xl shadow-2xl
                flex items-center gap-3 backdrop-blur-xl border border-white/20
                hover:border-white/40 transition-all duration-300
              `}
            >
              <span>Read Full Story</span>
              <ExternalLink size={20} />
            </motion.button>

            {/* Image Controls */}
            {article.images.length > 1 && (
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoPlay(!isAutoPlay);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                  {isAutoPlay ? <Pause size={18} /> : <Play size={18} />}
                </motion.button>
                
                <div className="flex gap-1">
                  {article.images.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'}
                      `}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        whileHover={{ opacity: 1 }}
      />

      {/* Breaking News Ticker */}
      {article.priority >= 4 && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 left-6 px-4 py-2 bg-red-500/90 backdrop-blur-xl rounded-full text-white font-bold text-sm border border-red-400/50"
        >
          🔥 BREAKING NEWS
        </motion.div>
      )}
    </motion.div>
  );
};