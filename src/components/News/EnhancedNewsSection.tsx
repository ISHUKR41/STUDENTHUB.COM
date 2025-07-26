import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, TrendingUp, Clock, Eye } from 'lucide-react';
import { NewsNavigation } from './NewsNavigation';
import { SearchBar } from './SearchBar';
import { NewsCard3D } from './NewsCard3D';
import { TrendingSidebar } from './TrendingSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { newsAPI, NewsArticle } from '@/lib/newsData';
import { useToast } from '@/hooks/use-toast';

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

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'featured', label: 'Featured' },
  { value: 'trending', label: 'Most Viewed' },
  { value: 'popular', label: 'Most Liked' }
];

export const EnhancedNewsSection = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<NewsArticle[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  const articlesPerPage = 12;

  useEffect(() => {
    loadNews();
    loadRecentSearches();
  }, []);

  useEffect(() => {
    filterAndSortArticles();
  }, [articles, searchQuery, selectedCategory, sortBy]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const allNews = await newsAPI.getAllNews();
      setArticles(allNews);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load news", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentSearches = () => {
    const saved = localStorage.getItem('newsSearchHistory');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  };

  const saveSearchToHistory = (query: string) => {
    const newHistory = [query, ...recentSearches.filter(q => q !== query)].slice(0, 10);
    setRecentSearches(newHistory);
    localStorage.setItem('newsSearchHistory', JSON.stringify(newHistory));
  };

  const filterAndSortArticles = () => {
    let filtered = [...articles];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query)) ||
        article.category.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort articles
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        break;
      case 'featured':
        filtered.sort((a, b) => {
          if (a.featured !== b.featured) return b.featured ? 1 : -1;
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        });
        break;
      case 'trending':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      saveSearchToHistory(searchQuery.trim());
      // Search functionality is handled by filterAndSortArticles
      filterAndSortArticles();
    }
  };

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    
    // Get suggestions for autocomplete
    if (query.length > 2) {
      try {
        const searchResults = await newsAPI.searchNews(query);
        setSuggestions(searchResults.slice(0, 5));
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  return (
    <div className="min-h-screen bg-background">
      <NewsNavigation />
      
      {/* Hero Section with Search */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 lg:py-32 overflow-hidden"
      >
        {/* Background with 3D elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary-glow/5 to-accent/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Floating news elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Student News Hub
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Stay updated with the latest news, exam updates, scholarships, and career opportunities 
              tailored for students across India.
            </p>
            
            {/* Enhanced Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearch={handleSearch}
              suggestions={suggestions}
              recentSearches={recentSearches}
              onClearSearch={clearSearch}
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              { label: 'Total Articles', value: articles.length, icon: TrendingUp },
              { label: 'Daily Updates', value: '50+', icon: Calendar },
              { label: 'Active Readers', value: '10K+', icon: Eye },
              { label: 'Categories', value: categories.length - 1, icon: Filter }
            ].map((stat, index) => (
              <Card key={stat.label} className="p-6 text-center glassmorphism">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* News Content */}
      <section className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`transition-all duration-300 ${
                      selectedCategory === category 
                        ? 'bg-primary text-primary-foreground shadow-glow' 
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="md:ml-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Results Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="text-muted-foreground">
                Showing {currentArticles.length} of {filteredArticles.length} articles
                {searchQuery && (
                  <span> for "{searchQuery}"</span>
                )}
              </div>
              
              {searchQuery && (
                <Button variant="outline" size="sm" onClick={clearSearch}>
                  Clear Search
                </Button>
              )}
            </motion.div>

            {/* Articles Grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-xl h-64" />
                    </div>
                  ))}
                </motion.div>
              ) : currentArticles.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {currentArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NewsCard3D article={article} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <Button onClick={clearSearch}>
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-12"
              >
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TrendingSidebar />
          </motion.div>
        </div>
      </section>
    </div>
  );
};