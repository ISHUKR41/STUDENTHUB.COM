import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const trendingSearches = [
  'UPSC Civil Services 2025',
  'NEET Results 2025',
  'IIM MBA Admissions',
  'Engineering Placements',
  'Delhi University B.Tech',
  'Chemistry Olympiad',
  'Digital Education Budget',
  'Campus Recruitment 2025'
];

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
  placeholder = "Search news, scholarships, exams..." 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Filter trending searches based on query
      const filtered = trendingSearches.filter(search =>
        search.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && isFocused);
    } else {
      setSuggestions(trendingSearches);
      setShowSuggestions(isFocused);
    }
  }, [query, isFocused]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Main Search Bar */}
      <motion.form
        onSubmit={handleSubmit}
        className={`
          relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300
          ${isFocused 
            ? 'bg-white/10 border-blue-400/50 shadow-lg shadow-blue-500/20' 
            : 'bg-white/5 border-white/10 hover:border-white/20'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileFocus={{ scale: 1.02 }}
      >
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10"
          animate={{ 
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative flex items-center px-6 py-4">
          {/* Search Icon */}
          <motion.div
            animate={{ 
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? '#60A5FA' : '#9CA3AF'
            }}
            transition={{ duration: 0.2 }}
          >
            <Search size={20} />
          </motion.div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            placeholder={placeholder}
            className="flex-1 ml-4 bg-transparent text-white placeholder-white/50 outline-none text-lg"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                onClick={clearSearch}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="ml-2 p-1 text-white/50 hover:text-white/80 transition-colors"
              >
                <X size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Search Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300 shadow-lg"
          >
            Search
          </motion.button>
        </div>

        {/* Animated Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          animate={{
            background: isFocused 
              ? 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
              : 'transparent'
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white/70">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">
                  {query ? 'Suggestions' : 'Trending Searches'}
                </span>
              </div>
            </div>

            {/* Suggestions List */}
            <div className="py-2 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    x: 5
                  }}
                  className="w-full px-6 py-3 text-left text-white/80 hover:text-white transition-all duration-200 flex items-center gap-3"
                >
                  <Search size={14} className="text-white/40" />
                  <span>{suggestion}</span>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-2 border-t border-white/10 text-center">
              <span className="text-xs text-white/40">
                Press Enter to search or click on suggestions
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcut Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? 1 : 0 }}
        className="absolute -bottom-8 left-0 text-xs text-white/40"
      >
        Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">Enter</kbd> to search
      </motion.div>
    </div>
  );
};