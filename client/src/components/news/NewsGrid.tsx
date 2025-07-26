import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NewsCard } from './NewsCard';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { NewsHero } from './NewsHero';

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

interface NewsGridProps {
  className?: string;
}

const categories = [
  'All',
  'Academic',
  'Exam',
  'Scholarship', 
  'Career',
  'Technology',
  'Sports',
  'General'
];

export const NewsGrid: React.FC<NewsGridProps> = ({ className = '' }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchNews();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    // Initialize GSAP animations
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
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
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [articles]);

  const fetchNews = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: isLoadMore ? page.toString() : '1',
        limit: '12',
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();

      if (isLoadMore) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
        setPage(1);
      }

      setHasMore(data.pagination.page < data.pagination.totalPages);
      
      // Set featured article
      if (data.articles.length > 0 && !isLoadMore) {
        const featured = data.articles.find((article: NewsArticle) => article.featured);
        setFeaturedArticle(featured || data.articles[0]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchNews(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const getMasonryClass = (index: number) => {
    // Dynamic layout based on article priority and features
    const patterns = [
      'col-span-2 row-span-2', // Large - for featured articles
      'col-span-1 row-span-1', // Small - for regular news
      'col-span-1 row-span-2', // Tall - for detailed stories
      'col-span-2 row-span-1', // Wide - for breaking news
      'col-span-1 row-span-1', // Small
      'col-span-2 row-span-1', // Wide
    ];
    
    // Prioritize featured articles for larger cards
    const article = articles[index];
    if (article?.featured && index < 3) {
      return 'col-span-2 row-span-2';
    }
    
    return patterns[index % patterns.length];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 ${className}`}>
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-20 pb-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4"
            >
              Celestial News Grid
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Explore the latest student news in our immersive 3D landscape
            </motion.p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="md:w-auto">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      {featuredArticle && (
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 px-4 sm:px-6 lg:px-8 mb-16"
        >
          <div className="max-w-7xl mx-auto">
            <NewsHero article={featuredArticle} />
          </div>
        </motion.div>
      )}

      {/* Main News Grid */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading && articles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
              {[...Array(12)].map((_, index) => (
                <div key={index} className={`animate-pulse ${getMasonryClass(index)}`}>
                  <div className="bg-gray-800/50 rounded-2xl h-64 backdrop-blur-sm"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatePresence>
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    className={getMasonryClass(index)}
                    initial={{ opacity: 0, y: 50, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -50, rotateX: 10 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100 
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      rotateX: 5,
                      z: 50
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                  >
                    <NewsCard article={article} variant={getMasonryClass(index)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={loadMore}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Load More Stories
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};