import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveNewsGrid } from '../components/news/ResponsiveNewsGrid';
import { SearchBar } from '../components/news/SearchBar';
import { CategoryFilter } from '../components/news/CategoryFilter';
import { NewsHero } from '../components/news/NewsHero';

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

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, searchQuery]);

  const fetchNews = async (pageNum = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '24', // Increased for better grid
      });
      
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery && searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/news?${params}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();

      if (isLoadMore) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
        setPage(1);
        
        // Set featured article
        if (data.articles.length > 0) {
          const featured = data.articles.find((article: NewsArticle) => article.featured);
          setFeaturedArticle(featured || data.articles[0]);
        }
      }

      setHasMore(data.pagination.page < data.pagination.totalPages);
      setTotalCount(data.pagination.total || 0);
      
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    fetchNews(1, false); // Immediately fetch with new search query
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4"
            >
              Celestial News Grid
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Stay updated with the latest student-focused news, exam updates, and educational insights
            </motion.p>
            
            {totalCount > 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-blue-400 text-sm mt-4"
              >
                {totalCount} articles available • Updated daily
              </motion.p>
            )}
          </div>

          {/* Search and Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 space-y-6"
          >
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search news articles..."
                className="w-full"
              />
            </div>
            
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              className="justify-center"
            />
          </motion.div>
        </motion.div>

        {/* Hero Section */}
        {featuredArticle && !searchQuery && selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="container mx-auto px-4 mb-12"
          >
            <NewsHero article={featuredArticle} />
          </motion.div>
        )}

        {/* Results Summary */}
        {(searchQuery || selectedCategory !== 'All') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 mb-8"
          >
            <div className="text-center">
              <p className="text-gray-300">
                {searchQuery ? (
                  <>Showing results for "<span className="text-blue-400 font-medium">{searchQuery}</span>"</>
                ) : (
                  <>Category: <span className="text-blue-400 font-medium">{selectedCategory}</span></>
                )}
                {articles.length > 0 && (
                  <span className="text-gray-400 ml-2">• {articles.length} articles found</span>
                )}
              </p>
            </div>
          </motion.div>
        )}

        {/* News Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="container mx-auto px-4 pb-16"
        >
          {articles.length === 0 && !loading ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Articles Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filters' 
                  : 'No news articles available at the moment'
                }
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <ResponsiveNewsGrid
              articles={articles}
              loading={loading}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsPage;