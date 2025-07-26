import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  ExternalLink,
  User,
  Calendar
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

interface NewsCardProps {
  article: NewsArticle;
  variant: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, variant }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [liked, setLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Academic': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      'Exam': 'from-red-500/20 to-red-600/20 border-red-500/30',
      'Scholarship': 'from-green-500/20 to-green-600/20 border-green-500/30',
      'Career': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      'Technology': 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
      'Sports': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      'General': 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
    };
    return colors[category as keyof typeof colors] || colors.General;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    // TODO: Send API request to update likes
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.origin + `/news/${article.id}`
      });
    }
  };

  const openArticle = () => {
    window.open(`/news/${article.id}`, '_blank');
  };

  const handleCardClick = () => {
    if (variant.includes('col-span-2')) {
      setIsFlipped(!isFlipped);
    } else {
      openArticle();
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative h-full cursor-pointer group
        transform-style-preserve-3d
        ${variant.includes('row-span-2') ? 'min-h-[400px]' : 'min-h-[200px]'}
      `}
      whileHover={{ 
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
        z: 20
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card Container */}
      <motion.div
        className={`
          relative w-full h-full rounded-2xl overflow-hidden
          bg-gradient-to-br ${getCategoryColor(article.category)}
          backdrop-blur-xl border shadow-2xl
          transition-all duration-300
          ${isFlipped ? 'transform rotateY-180' : ''}
        `}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Background Image */}
          {article.images.length > 0 && (
            <div className="absolute inset-0">
              <img
                src={article.images[0].url}
                alt={article.images[0].alt}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          )}

          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90">
                  {article.category}
                </span>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <Eye size={12} />
                  <span>{article.views}</span>
                </div>
              </div>

              <h3 className="text-white font-bold text-lg mb-2 line-clamp-3 leading-tight">
                {article.title}
              </h3>

              {variant.includes('row-span-2') && (
                <p className="text-white/80 text-sm line-clamp-3 mb-4">
                  {article.summary}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{formatDate(article.publishDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{article.readTime} min</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={handleLike}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      p-2 rounded-full transition-colors
                      ${liked ? 'text-red-400 bg-red-400/20' : 'text-white/70 hover:text-red-400 hover:bg-red-400/10'}
                    `}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                  </motion.button>
                  
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full text-white/70 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                  >
                    <Share2 size={16} />
                  </motion.button>
                </div>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    openArticle();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ExternalLink size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Back Face - Only for large cards */}
        {variant.includes('col-span-2') && (
          <div 
            className="absolute inset-0 backface-hidden transform rotateY-180 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="h-full p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-bold text-lg">Full Story</h4>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/70 hover:text-white"
                >
                  ×
                </motion.button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <p className="text-white/90 text-sm leading-relaxed">
                  {article.fullContent.length > 500 
                    ? article.fullContent.substring(0, 500) + '...'
                    : article.fullContent
                  }
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openArticle();
                  }}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-300"
                >
                  Read Full Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                left: `${20 + i * 30}%`,
                top: `${70 + i * 10}%`
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};