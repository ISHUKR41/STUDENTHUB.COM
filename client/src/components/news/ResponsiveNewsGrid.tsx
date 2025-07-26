import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'wouter';
import { Clock, Eye, Heart, Share2, Calendar, User, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

interface ResponsiveNewsGridProps {
  articles: NewsArticle[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const ResponsiveNewsGrid: React.FC<ResponsiveNewsGridProps> = ({
  articles,
  loading,
  onLoadMore,
  hasMore
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current && articles.length > 0) {
      const cards = gridRef.current.querySelectorAll('.news-card');
      
      gsap.fromTo(cards, 
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [articles]);

  const getGridItemClass = (index: number, article: NewsArticle) => {
    // Responsive grid classes for different screen sizes
    const baseClasses = "news-card group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300";
    
    // Mobile: all cards single column
    let responsiveClasses = "col-span-1";
    
    // Tablet and above: dynamic sizing based on article properties
    if (article.featured && index < 3) {
      responsiveClasses += " md:col-span-2 md:row-span-2"; // Large featured cards
    } else if (index % 5 === 0) {
      responsiveClasses += " md:col-span-2"; // Wide cards
    } else if (index % 7 === 0) {
      responsiveClasses += " md:row-span-2"; // Tall cards
    }
    
    return `${baseClasses} ${responsiveClasses}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (loading && articles.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-700 rounded-xl h-64 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Responsive Grid */}
      <div 
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr"
        style={{ gridAutoRows: '400px' }}
      >
        <AnimatePresence>
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={getGridItemClass(index, article)}
            >
              <Link href={`/news/${article.id}`} className="block h-full">
                <div className="relative h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {article.images && article.images.length > 0 ? (
                      <img
                        src={article.images[0].url}
                        alt={article.images[0].alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <ExternalLink className="w-12 h-12 text-white/70" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {article.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {article.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500/90 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                          FEATURED
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    {/* Title */}
                    <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {truncateText(article.title, 60)}
                    </h3>

                    {/* Summary */}
                    <p className="text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                      {truncateText(article.summary, 120)}
                    </p>

                    {/* Meta Information */}
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span className="truncate">{truncateText(article.author, 15)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}m</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(article.publishDate)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{article.views > 1000 ? `${(article.views/1000).toFixed(1)}k` : article.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{article.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3D Hover Effect */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-blue-500/30 rounded-xl transition-colors duration-300 pointer-events-none"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </div>
            ) : (
              'Load More Articles'
            )}
          </button>
        </div>
      )}

      {/* No More Articles */}
      {!hasMore && articles.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-400">You've reached the end of our news feed</p>
        </div>
      )}
    </div>
  );
};