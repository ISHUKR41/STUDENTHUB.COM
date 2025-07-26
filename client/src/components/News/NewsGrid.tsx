import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
// Removed React Three Fiber imports for compatibility
import { Search, Filter, TrendingUp, Clock, Sparkles, RefreshCw, Grid3X3, List } from 'lucide-react';
// Simplified news components without 3D dependencies
import { EnhancedSearchBar } from './EnhancedSearchBar';
import { CategoryFilter } from './CategoryFilter';
import { TrendingSidebar } from './TrendingSidebar';
import { NewsNavbar } from './NewsNavbar';
import { newsAPI, NewsArticle, getCategories } from '@/lib/newsData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
// Removed Three.js import for compatibility

// Simplified parallax effect without React Three Fiber
const useMouseParallax = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;

  return null;
};

// 3D News Grid Layout
const NewsGrid3D = ({ articles }: { articles: NewsArticle[] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {articles.map((article, index) => {
        // Position cards in 3D space with varying depths
        const x = (index % 4 - 1.5) * 3;
        const y = Math.floor(index / 4) * -3;
        const z = (Math.sin(index * 0.5) * 0.5) - 2; // Varying depth
        
        return (
          <mesh key={article.id} position={[x, y, z]}>
            <planeGeometry args={[2.5, 3]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        );
      })}
    </group>
  );
};

export const NewsGrid = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const { toast } = useToast();

  const categories = getCategories();
  const articlesPerPage = 12;

  // Load articles
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const category = selectedCategory === 'all' ? undefined : selectedCategory;
        const [newsResponse, featuredResponse] = await Promise.all([
          newsAPI.getNews(currentPage, articlesPerPage, category),
          newsAPI.getFeaturedNews()
        ]);
        
        setArticles(newsResponse.articles);
        setTotalArticles(newsResponse.total);
        setFeaturedArticles(featuredResponse);
      } catch (error) {
        toast({
          title: "Error loading news",
          description: "Failed to load articles. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentPage, selectedCategory, toast]);

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const searchResults = await newsAPI.searchNews(searchQuery);
      setArticles(searchResults);
      setTotalArticles(searchResults.length);
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to search articles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Ambient Background */}
      <AmbientBackground />

      {/* Enhanced Navigation */}
      <NewsNavbar />

      {/* Main Content with padding for fixed navbar */}
      <div className="pt-16 md:pt-20">
        {/* Search Section */}
        <motion.section 
          className="relative py-8 md:py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold gradient-text mb-4"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Latest Education News
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Stay updated with the latest in education, exams, scholarships, and career opportunities
              </motion.p>
            </div>

            {/* Enhanced Search Bar */}
            <EnhancedSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              onClearSearch={() => setSearchQuery('')}
            />

            {/* Enhanced Category Filters */}
            <div className="mt-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Live Stats */}
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Live Updates</span>
                </div>
                <div className="text-muted-foreground/50">•</div>
                <span>{totalArticles} articles available</span>
                <div className="text-muted-foreground/50">•</div>
                <span>Updated daily</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Hero Section with Featured News */}
        {featuredArticles.length > 0 && (
          <NewsHero3D articles={featuredArticles.slice(0, 3)} />
        )}

        {/* Main Content Grid */}
        <main className="relative">
          <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* News Articles Grid */}
            <div className="xl:col-span-3">
              <motion.div 
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-foreground">
                  Latest News
                  {selectedCategory !== 'all' && (
                    <span className="text-primary ml-2">• {selectedCategory}</span>
                  )}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {totalArticles} articles found
                </div>
              </motion.div>

              {/* 3D Grid Container */}
              <div className="relative min-h-[400px]">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* 3D Canvas Overlay for Parallax */}
                    <div className="absolute inset-0 pointer-events-none">
                      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                        <CameraController />
                        <NewsGrid3D articles={articles} />
                      </Canvas>
                    </div>

                    {/* Actual News Cards */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence mode="wait">
                        {articles.map((article, index) => (
                          <NewsCard3D
                            key={article.id}
                            article={article}
                            index={index}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                {/* Load More Button */}
                {!loading && articles.length < totalArticles && (
                  <motion.div 
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <Button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="btn-hero"
                    >
                      Load More Articles
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <TrendingSidebar />
            </div>
          </div>
          </div>
        </main>

        {/* Floating Action Button for Admin */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          className="rounded-full w-14 h-14 shadow-glow"
          onClick={() => window.open('/admin/news', '_blank')}
        >
          <TrendingUp className="w-6 h-6" />
        </Button>
        </motion.div>
      </div>
    </div>
  );
};