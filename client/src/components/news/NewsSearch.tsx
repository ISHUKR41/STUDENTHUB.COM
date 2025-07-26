import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

interface SearchProps {
  onSearch?: (query: string, category?: string) => void;
}

const NewsSearch: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'All Categories',
    'Academic',
    'Exam',
    'Scholarship',
    'Career',
    'Technology',
    'Sports',
    'General'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedCategory || undefined);
    }
  };

  const handleCategorySelect = (category: string) => {
    const selectedCat = category === 'All Categories' ? '' : category;
    setSelectedCategory(selectedCat);
    if (onSearch) {
      onSearch(searchQuery, selectedCat || undefined);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative max-w-4xl mx-auto"
    >
      {/* Main Search Container */}
      <motion.div
        className="relative bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-lg rounded-2xl border border-gray-600/50 overflow-hidden"
        whileHover={{ boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)' }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSearch} className="flex items-center">
          {/* Search Icon */}
          <div className="pl-6 pr-2">
            <Search className="w-6 h-6 text-cyan-400" />
          </div>

          {/* Search Input */}
          <motion.input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => !searchQuery && setIsExpanded(false)}
            placeholder="Search for news, exams, scholarships..."
            className="flex-1 py-4 px-2 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
            animate={{
              paddingLeft: isExpanded ? '0.5rem' : '0.25rem'
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Filter Button */}
          <motion.button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="p-4 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-5 h-5" />
          </motion.button>

          {/* Search Button */}
          <motion.button
            type="submit"
            className="mr-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Search
          </motion.button>
        </form>

        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 opacity-0"
          animate={{
            opacity: isExpanded ? 1 : 0,
            background: isExpanded 
              ? 'linear-gradient(90deg, rgba(0,212,255,0) 0%, rgba(0,212,255,0.5) 50%, rgba(0,212,255,0) 100%)'
              : 'linear-gradient(90deg, rgba(0,212,255,0) 0%, rgba(0,212,255,0) 50%, rgba(0,212,255,0) 100%)'
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-4 left-0 right-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-600/50 p-6 z-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
              <motion.button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    (selectedCategory === category || 
                     (selectedCategory === '' && category === 'All Categories'))
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Clear Filters */}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 pt-4 border-t border-gray-600/50"
              >
                <motion.button
                  onClick={() => handleCategorySelect('All Categories')}
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  Clear all filters
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Suggestions */}
      <AnimatePresence>
        {isExpanded && searchQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-600/50 overflow-hidden z-20"
          >
            <div className="p-2">
              {['UPSC 2025', 'IIT JEE', 'NEET', 'Delhi University', 'Scholarships'].map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setIsExpanded(false);
                    if (onSearch) onSearch(suggestion);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  <Search className="w-4 h-4 inline mr-3 text-gray-500" />
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: '50%',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default NewsSearch;