import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FeaturedNewsData {
  id: number;
  title: string;
  summary: string;
  category: string;
  publishDate: string;
  readTime: number;
  image: string;
}

// Animated Background Elements using CSS
const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 backdrop-blur-lg"
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          style={{
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
          }}
        />
      ))}
      
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-[200px] font-bold text-white/5 select-none"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          NEWS
        </motion.div>
      </div>
    </div>
  );
};

const NewsHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  // Mock featured news data - In real app, fetch from API
  const [featuredNews] = useState<FeaturedNewsData>({
    id: 1,
    title: "UPSC Civil Services Notification 2025 Released",
    summary: "Union Public Service Commission announces Civil Services Examination 2025 with 979 vacancies for IAS, IPS, IFS and other services.",
    category: "Exam",
    publishDate: "2025-01-22",
    readTime: 5,
    image: "/images/upsc-notification.jpg"
  });

  return (
    <motion.div
      ref={containerRef}
      style={{ y, opacity }}
      className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden"
    >
      {/* 3D Background Scene */}
      <HeroScene />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-purple-900/50 z-10" />
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full text-sm font-semibold text-black mb-4">
              {featuredNews.category} • {featuredNews.readTime} min read
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              {featuredNews.title}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {featuredNews.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
                backgroundPosition: 'right center'
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-purple-600 hover:to-cyan-500 rounded-full font-semibold text-white transition-all duration-300 bg-size-200 bg-pos-0 hover:bg-pos-100"
              style={{
                backgroundSize: '200% 100%',
                backgroundPosition: 'left center'
              }}
            >
              Read Full Article
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold hover:bg-cyan-400 hover:text-black transition-all duration-300"
            >
              Share Article
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 text-sm text-gray-400"
          >
            Published on {new Date(featuredNews.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </motion.div>
        </div>
      </div>

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 p-[2px] -z-10"
        animate={{
          background: [
            'linear-gradient(0deg, #00d4ff, #9c27b0, #39ff14)',
            'linear-gradient(90deg, #39ff14, #00d4ff, #9c27b0)',
            'linear-gradient(180deg, #9c27b0, #39ff14, #00d4ff)',
            'linear-gradient(270deg, #00d4ff, #9c27b0, #39ff14)',
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="h-full w-full rounded-3xl bg-gray-900/50 backdrop-blur-sm" />
      </motion.div>
    </motion.div>
  );
};

export default NewsHero;