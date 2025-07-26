import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Filter, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { NewsArticle } from '@/lib/newsData';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  suggestions?: NewsArticle[];
  recentSearches?: string[];
  onClearSearch: () => void;
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  onSearch,
  suggestions = [],
  recentSearches = [],
  onClearSearch
}: SearchBarProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (title: string) => {
    onSearchChange(title);
    onSearch();
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
      setShowSuggestions(false);
      setIsSearchFocused(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input Container */}
      <motion.div
        className={`relative glassmorphism transition-all duration-300 ${
          isSearchFocused ? 'ring-2 ring-primary/50 shadow-glow' : ''
        }`}
        animate={{
          scale: isSearchFocused ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-3 p-3">
          <Search className="w-5 h-5 text-primary animate-pulse" />
          <Input
            placeholder="Search news, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={handleInputFocus}
            onKeyPress={handleKeyPress}
            className="border-0 bg-transparent focus:ring-0 text-lg placeholder:text-muted-foreground"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={onClearSearch}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <Button onClick={onSearch} className="btn-hero px-6">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Search Progress Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow"
          initial={{ width: 0 }}
          animate={{ width: isSearchFocused ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (isSearchFocused || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="glassmorphism border border-border/20 p-4 max-h-96 overflow-y-auto">
              {/* Quick Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Suggestions</span>
                  </div>
                  <div className="space-y-2">
                    {suggestions.slice(0, 4).map((article) => (
                      <motion.button
                        key={article.id}
                        onClick={() => handleSuggestionClick(article.title)}
                        className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {article.category.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                              {article.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {article.summary}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {article.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {article.readTime} min read
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && !searchQuery && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 6).map((search, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="text-xs bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchQuery && suggestions.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-muted-foreground">Try different keywords or browse categories</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};