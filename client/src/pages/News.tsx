import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// Lazy load components for performance
const NewsHero = lazy(() => import('../components/News/NewsHero'));
const NewsGrid = lazy(() => import('../components/News/NewsGrid'));
const NewsSearch = lazy(() => import('../components/News/NewsSearch'));
const ParticleBackground = lazy(() => import('../components/3D/ParticleBackground'));

const News: React.FC = () => {
  const [heroRef, heroInView] = useIntersectionObserver({ threshold: 0.1 });
  const [gridRef, gridInView] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Particle Background - Lazy loaded */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      {/* Header Section */}
      <header className="relative z-10 py-6 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-4">
            StudentHub News
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Stay updated with the latest educational news, exam notifications, and career opportunities
          </p>
        </motion.div>
      </header>

      {/* Search Section */}
      <section className="relative z-10 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse" />
          }>
            <NewsSearch />
          </Suspense>
        </div>
      </section>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 py-12 px-4 md:px-8">
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

      {/* Main News Grid Section */}
      <section ref={gridRef} className="relative z-10 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={gridInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-8 text-center"
          >
            Latest News & Updates
          </motion.h2>
          
          {gridInView && (
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            }>
              <NewsGrid />
            </Suspense>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-8">Browse by Category</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Academic', 'Exam', 'Scholarship', 'Career', 'Technology', 'Sports'].map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 backdrop-blur-sm"
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default News;