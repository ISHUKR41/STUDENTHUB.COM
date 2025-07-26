import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface NewsCardData {
  id: number;
  title: string;
  summary: string;
  category: string;
  publishDate: string;
  readTime: number;
  views: number;
  featured: boolean;
  priority: number;
}

// Animated background cards using CSS
const BackgroundCards: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-48 h-32 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-xl backdrop-blur-sm border border-cyan-400/20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
          style={{
            left: `${10 + i * 20}%`,
            top: `${20 + Math.sin(i) * 30}%`,
          }}
        />
      ))}
    </div>
  );
};

// Individual News Card Component
const NewsCard: React.FC<{ 
  news: NewsCardData; 
  index: number;
  onCardClick: (news: NewsCardData) => void;
}> = ({ news, index, onCardClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Academic': 'from-blue-500 to-cyan-500',
      'Exam': 'from-red-500 to-pink-500',
      'Scholarship': 'from-green-500 to-emerald-500',
      'Career': 'from-purple-500 to-violet-500',
      'Technology': 'from-orange-500 to-yellow-500',
      'Sports': 'from-indigo-500 to-blue-500',
      'General': 'from-gray-500 to-slate-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-slate-500';
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        rotateX: -5,
        z: 50,
        transition: { duration: 0.3 }
      }}
      className="group cursor-pointer perspective-1000"
      onClick={() => onCardClick(news)}
    >
      <div className="relative h-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl overflow-hidden backdrop-blur-lg border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 transform-gpu">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Category Badge */}
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(news.category)} text-white`}>
              {news.category}
            </span>
            {news.featured && (
              <span className="ml-2 inline-block px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                FEATURED
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-3">
            {news.title}
          </h3>

          {/* Summary */}
          <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
            {news.summary}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>{news.readTime} min read</span>
              <span>{news.views} views</span>
            </div>
            <span>
              {new Date(news.publishDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />

        {/* Animated Particles on Hover */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100"
              initial={{ x: 0, y: 0 }}
              animate={{
                x: Math.random() * 300,
                y: Math.random() * 200,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const NewsGrid: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsCardData | null>(null);
  const [newsData, setNewsData] = useState<NewsCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockNews: NewsCardData[] = [
      {
        id: 1,
        title: "UPSC Civil Services Notification 2025 Released",
        summary: "Union Public Service Commission announces Civil Services Examination 2025 with 979 vacancies for IAS, IPS, IFS and other services.",
        category: "Exam",
        publishDate: "2025-01-22",
        readTime: 5,
        views: 1250,
        featured: true,
        priority: 1
      },
      {
        id: 2,
        title: "IP University Begins 2025 Admissions from February 1",
        summary: "Guru Gobind Singh Indraprastha University opens admission process for over 40,000 seats across UG, PG, and PhD programs.",
        category: "Academic",
        publishDate: "2025-01-25",
        readTime: 3,
        views: 890,
        featured: false,
        priority: 2
      },
      {
        id: 3,
        title: "IIM Shortlist 2025 Released for MBA Admissions",
        summary: "All 21 IIMs complete shortlisting process for MBA/PGP admission 2025-27 batch with WAT-PI rounds concluded.",
        category: "Career",
        publishDate: "2025-01-24",
        readTime: 4,
        views: 2100,
        featured: true,
        priority: 1
      },
      {
        id: 4,
        title: "Delhi University B.Tech Admission Schedule 2025-26 Announced",
        summary: "University of Delhi releases detailed admission schedule for B.Tech programs in Computer Science, Electronics, and Electrical Engineering.",
        category: "Academic",
        publishDate: "2025-01-23",
        readTime: 3,
        views: 675,
        featured: false,
        priority: 3
      },
      {
        id: 5,
        title: "India Wins 4 Medals at International Chemistry Olympiad 2025",
        summary: "Indian students secure 2 gold and 2 silver medals at 57th International Chemistry Olympiad in Dubai, ranking 6th globally.",
        category: "Academic",
        publishDate: "2025-01-26",
        readTime: 4,
        views: 1450,
        featured: true,
        priority: 1
      },
      {
        id: 6,
        title: "National Education Policy 2025 Updates Announced",
        summary: "NEP 2025 brings major changes including modified no detention policy, emphasis on vocational education, and digital learning initiatives.",
        category: "Academic",
        publishDate: "2025-01-21",
        readTime: 6,
        views: 3200,
        featured: false,
        priority: 2
      }
    ];

    setTimeout(() => {
      setNewsData(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCardClick = (news: NewsCardData) => {
    setSelectedNews(news);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Animated Background Cards */}
      <BackgroundCards />

      {/* News Grid */}
      <div className="relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {newsData.map((news, index) => (
            <NewsCard
              key={news.id}
              news={news}
              index={index}
              onCardClick={handleCardClick}
            />
          ))}
        </motion.div>
      </div>

      {/* Modal for Selected News */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-cyan-400/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(selectedNews.category)} text-white mb-4`}>
                  {selectedNews.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {selectedNews.title}
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  {selectedNews.summary}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>{selectedNews.readTime} min read</span>
                    <span>{selectedNews.views} views</span>
                  </div>
                  <span>
                    {new Date(selectedNews.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white hover:shadow-lg transition-all duration-300"
                >
                  Read Full Article
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-transparent border-2 border-gray-600 text-gray-300 rounded-full font-semibold hover:border-gray-400 hover:text-white transition-all duration-300"
                  onClick={() => setSelectedNews(null)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper function for category colors
const getCategoryColor = (category: string) => {
  const colors = {
    'Academic': 'from-blue-500 to-cyan-500',
    'Exam': 'from-red-500 to-pink-500',
    'Scholarship': 'from-green-500 to-emerald-500',
    'Career': 'from-purple-500 to-violet-500',
    'Technology': 'from-orange-500 to-yellow-500',
    'Sports': 'from-indigo-500 to-blue-500',
    'General': 'from-gray-500 to-slate-500'
  };
  return colors[category as keyof typeof colors] || 'from-gray-500 to-slate-500';
};

export default NewsGrid;