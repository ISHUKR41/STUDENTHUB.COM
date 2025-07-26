import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Archive, Search, Filter, Clock, TrendingUp, BookOpen } from 'lucide-react';
import { HolographicCard, HolographicButton, LoadingHologram } from '../3D/HolographicUI';
import { FloatingCardsGrid } from '../3D/FloatingCards';

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

interface ArchiveFilters {
  year?: number;
  month?: number;
  category?: string;
  searchTerm?: string;
}

interface NewsArchiveProps {
  onArticleClick?: (article: NewsArticle) => void;
}

export const NewsArchive: React.FC<NewsArchiveProps> = ({ onArticleClick }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ArchiveFilters>({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('grid');

  // Mock archive data - in real app this would come from API
  const mockArchiveData: NewsArticle[] = [
    {
      id: '1',
      title: 'UPSC Civil Services 2024 Results Announced',
      summary: 'The Union Public Service Commission has declared the final results for Civil Services Examination 2024. A total of 1016 candidates have been recommended for appointment.',
      category: 'Exam',
      publishDate: '2024-12-15',
      readTime: 5,
      views: 15420,
      likes: 342,
      shares: 89,
      featured: true,
      status: 'archived',
      images: [{ url: '/api/placeholder/400/200', alt: 'UPSC Results' }]
    },
    {
      id: '2',
      title: 'IIT JEE Advanced 2024: Top Rankers Share Success Stories',
      summary: 'Meet the toppers of JEE Advanced 2024 and learn about their preparation strategies, study schedules, and the resources that helped them achieve success.',
      category: 'Academic',
      publishDate: '2024-11-20',
      readTime: 8,
      views: 22150,
      likes: 567,
      shares: 234,
      featured: false,
      status: 'archived',
      images: [{ url: '/api/placeholder/400/200', alt: 'JEE Toppers' }]
    },
    {
      id: '3',
      title: 'National Scholarship Portal 2024-25 Applications Open',
      summary: 'Students can now apply for various scholarships through the National Scholarship Portal. The deadline for applications is January 31, 2025.',
      category: 'Scholarship',
      publishDate: '2024-10-10',
      readTime: 4,
      views: 8930,
      likes: 156,
      shares: 67,
      featured: false,
      status: 'archived',
      images: [{ url: '/api/placeholder/400/200', alt: 'Scholarships' }]
    },
    {
      id: '4',
      title: 'Delhi University Admissions 2024: Complete Guide',
      summary: 'Everything you need to know about DU admissions 2024, including cutoffs, courses, and application process.',
      category: 'Academic',
      publishDate: '2024-09-15',
      readTime: 6,
      views: 12750,
      likes: 298,
      shares: 143,
      featured: false,
      status: 'archived',
      images: [{ url: '/api/placeholder/400/200', alt: 'DU Admissions' }]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadArchiveData = async () => {
      setLoading(true);
      // In real app: const response = await fetch('/api/news/archive');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setArticles(mockArchiveData);
      setLoading(false);
    };

    loadArchiveData();
  }, []);

  const getAvailableYears = () => {
    const years = articles.map(article => new Date(article.publishDate).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  };

  const getMonthsForYear = (year: number) => {
    const months = articles
      .filter(article => new Date(article.publishDate).getFullYear() === year)
      .map(article => new Date(article.publishDate).getMonth());
    return Array.from(new Set(months)).sort((a, b) => b - a);
  };

  const getFilteredArticles = () => {
    return articles.filter(article => {
      const articleDate = new Date(article.publishDate);
      
      if (filters.year && articleDate.getFullYear() !== filters.year) return false;
      if (filters.month && articleDate.getMonth() !== filters.month) return false;
      if (filters.category && article.category !== filters.category) return false;
      if (filters.searchTerm && !article.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) 
          && !article.summary.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
      
      return true;
    });
  };

  const categories = ['Academic', 'Exam', 'Scholarship', 'Career', 'Technology', 'Sports', 'General'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingHologram />
          <p className="text-gray-400 mt-4">Loading archive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Archive Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Archive className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              News Archive
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our permanent collection of educational news and updates. 
            Every article is preserved for future reference and learning.
          </p>
        </motion.div>

        {/* Archive Controls */}
        <HolographicCard className="mb-8">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search archived articles..."
                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Year Filter */}
              <div>
                <label className="block text-cyan-400 text-sm font-semibold mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Year
                </label>
                <select
                  className="w-full p-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  value={filters.year || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    year: e.target.value ? parseInt(e.target.value) : undefined,
                    month: undefined 
                  }))}
                >
                  <option value="">All Years</option>
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div>
                <label className="block text-cyan-400 text-sm font-semibold mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Month
                </label>
                <select
                  className="w-full p-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  value={filters.month !== undefined ? filters.month : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    month: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  disabled={!filters.year}
                >
                  <option value="">All Months</option>
                  {filters.year && getMonthsForYear(filters.year).map(month => (
                    <option key={month} value={month}>{monthNames[month]}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-cyan-400 text-sm font-semibold mb-2">
                  <Filter className="inline w-4 h-4 mr-1" />
                  Category
                </label>
                <select
                  className="w-full p-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  value={filters.category || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    category: e.target.value || undefined 
                  }))}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <HolographicButton
                  variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid View
                </HolographicButton>
                <HolographicButton
                  variant={viewMode === 'timeline' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                >
                  Timeline View
                </HolographicButton>
              </div>

              {/* Clear Filters */}
              {(filters.year || filters.month || filters.category || filters.searchTerm) && (
                <HolographicButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({})}
                >
                  Clear Filters
                </HolographicButton>
              )}
            </div>
          </div>
        </HolographicCard>

        {/* Archive Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <HolographicCard className="text-center">
            <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{articles.length}</div>
            <div className="text-gray-400 text-sm">Total Articles</div>
          </HolographicCard>
          
          <HolographicCard className="text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Views</div>
          </HolographicCard>
          
          <HolographicCard className="text-center">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{getAvailableYears().length}</div>
            <div className="text-gray-400 text-sm">Years Covered</div>
          </HolographicCard>
          
          <HolographicCard className="text-center">
            <Archive className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{getFilteredArticles().length}</div>
            <div className="text-gray-400 text-sm">Filtered Results</div>
          </HolographicCard>
        </div>

        {/* Articles Display */}
        <AnimatePresence mode="wait">
          {getFilteredArticles().length > 0 ? (
            <motion.div
              key="articles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {viewMode === 'grid' ? (
                <FloatingCardsGrid 
                  articles={getFilteredArticles()} 
                  onCardClick={onArticleClick}
                />
              ) : (
                <div className="space-y-6">
                  {getFilteredArticles().map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="cursor-pointer" onClick={() => onArticleClick?.(article)}>
                        <HolographicCard className="flex items-start gap-4 hover:scale-[1.02] transition-transform">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-16 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
                              {article.title}
                            </h3>
                            <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
                              {new Date(article.publishDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-3">{article.summary}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="px-2 py-1 bg-cyan-400/20 rounded text-cyan-400">
                              {article.category}
                            </span>
                            <span>{article.readTime} min read</span>
                            <span>{article.views.toLocaleString()} views</span>
                          </div>
                        </div>
                        </HolographicCard>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Archive className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Articles Found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewsArchive;