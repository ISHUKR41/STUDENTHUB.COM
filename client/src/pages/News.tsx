import React, { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Archive, Globe, Newspaper, TrendingUp } from 'lucide-react';
import { HolographicButton } from '../components/3D/HolographicUI';

// Lazy load components for performance
const NewsHero = lazy(() => import('../components/News/NewsHero'));
const NewsGrid = lazy(() => import('../components/News/NewsGrid'));
const NewsSearch = lazy(() => import('../components/News/NewsSearch'));
const ParticleBackground = lazy(() => import('../components/3D/ParticleBackground'));
const NewsGlobe = lazy(() => import('../components/3D/NewsGlobe'));
const NewsArchive = lazy(() => import('../components/News/NewsArchive'));

const News: React.FC = () => {
  const [heroRef, heroInView] = useIntersectionObserver({ threshold: 0.1 });
  const [gridRef, gridInView] = useIntersectionObserver({ threshold: 0.1 });
  const [currentView, setCurrentView] = useState<'news' | 'archive'>('news');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Particle Background - Lazy loaded */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      {/* Enhanced Header Section */}
      <header className="relative z-10 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Newspaper className="w-12 h-12 text-cyan-400" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
                StudentHub News
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Experience the future of educational news with our 3D-powered, permanently archived news portal
            </p>
            
            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <HolographicButton
                variant={currentView === 'news' ? 'primary' : 'secondary'}
                onClick={() => setCurrentView('news')}
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Latest News
              </HolographicButton>
              <HolographicButton
                variant={currentView === 'archive' ? 'primary' : 'secondary'}
                onClick={() => setCurrentView('archive')}
                className="flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                News Archive
              </HolographicButton>
            </div>
          </motion.div>

          {/* 3D News Globe */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Suspense fallback={
              <div className="w-80 h-80 bg-gray-800/50 rounded-full animate-pulse flex items-center justify-center">
                <Globe className="w-16 h-16 text-gray-600 animate-spin" />
              </div>
            }>
              <NewsGlobe />
            </Suspense>
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'news' ? (
            <motion.div
              key="news-view"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Search Section */}
              <section className="py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                  <Suspense fallback={
                    <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse" />
                  }>
                    <NewsSearch />
                  </Suspense>
                </div>
              </section>

              {/* Hero Section */}
              <section ref={heroRef} className="py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                  {heroInView && (
                    <Suspense fallback={
                      <div className="h-96 bg-gray-800/50 rounded-2xl animate-pulse" />
                    }>
                      <NewsHero />
                    </Suspense>
                  )}
                </div>
              </section>

              {/* News Grid Section */}
              <section ref={gridRef} className="py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                  {gridInView && (
                    <Suspense fallback={
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-64 bg-gray-800/50 rounded-xl animate-pulse" />
                        ))}
                      </div>
                    }>
                      <NewsGrid />
                    </Suspense>
                  )}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="archive-view"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <Archive className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400">Loading archive...</p>
                  </div>
                </div>
              }>
                <NewsArchive onArticleClick={setSelectedArticle} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default News;