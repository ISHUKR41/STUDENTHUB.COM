import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Filter, Sparkles, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { NewsArticle, newsAPI } from '@/lib/newsData';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

interface EnhancedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onResultSelect?: (article: NewsArticle) => void;
}

export const EnhancedSearchBar = ({
  searchQuery,
  onSearchChange,
  onSearch,
  onClearSearch,
  onResultSelect
}: EnhancedSearchBarProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<NewsArticle[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (!query.trim() || query.length < 2) return;
    
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(s => s !== query)].slice(0, 6);
      localStorage.setItem('recent-searches', JSON.stringify(updated));
      return updated;
    });
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const results = await newsAPI.searchNews(query);
        setSuggestions(results.slice(0, 5));
      } catch (error) {
        console.error('Search failed:', error);
        toast({
          title: "Search Error",
          description: "Failed to search articles. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [toast]
  );

  // Handle search query changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  }, [searchQuery, debouncedSearch]);

  // Click outside handler
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setIsSearchFocused(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (article: NewsArticle) => {
    onSearchChange(article.title);
    saveRecentSearch(article.title);
    onSearch();
    setShowSuggestions(false);
    setIsSearchFocused(false);
    onResultSelect?.(article);
  };

  const handleRecentSearchClick = (search: string) => {
    onSearchChange(search);
    onSearch();
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        saveRecentSearch(searchQuery);
        onSearch();
      }
      setShowSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  const handleClear = () => {
    onClearSearch();
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      {/* Search Input Container */}
      <motion.div
        className={`relative overflow-hidden transition-all duration-500 ${
          isSearchFocused 
            ? 'ring-2 ring-primary/50 shadow-glow bg-card/95 backdrop-blur-xl' 
            : 'bg-card/80 backdrop-blur-md hover:bg-card/90'
        }`}
        style={{
          borderRadius: '20px',
          border: '1px solid hsl(var(--border) / 0.3)'
        }}
        animate={{
          scale: isSearchFocused ? 1.02 : 1,
          y: isSearchFocused ? -2 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary-glow/5 to-accent/5 opacity-0"
          animate={{
            opacity: isSearchFocused ? 1 : 0,
            background: isSearchFocused 
              ? 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary-glow) / 0.1), hsl(var(--accent) / 0.1))'
              : 'transparent'
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative flex items-center gap-3 p-4">
          {/* Search Icon */}
          <motion.div
            animate={{
              scale: isSearchFocused ? 1.1 : 1,
              rotate: isSearching ? 360 : 0
            }}
            transition={{
              scale: { duration: 0.2 },
              rotate: { duration: 1, repeat: isSearching ? Infinity : 0, ease: "linear" }
            }}
          >
            <Search className={`w-5 h-5 transition-colors ${
              isSearchFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
          </motion.div>

          {/* Input Field */}
          <Input
            ref={inputRef}
            placeholder="Search news, topics, authors, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={handleInputFocus}
            onKeyPress={handleKeyPress}
            className="border-0 bg-transparent focus:ring-0 text-base placeholder:text-muted-foreground/70 font-medium flex-1"
            style={{ fontSize: '16px' }} // Prevent zoom on iOS
          />

          {/* Loading indicator */}
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-muted-foreground text-sm"
            >
              <motion.div
                className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Searching...</span>
            </motion.div>
          )}

          {/* Clear Button */}
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={handleClear}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Search Button */}
          <Button 
            onClick={() => {
              if (searchQuery.trim()) {
                saveRecentSearch(searchQuery);
                onSearch();
              }
            }}
            className="btn-hero px-6 py-2 text-sm font-medium"
            disabled={!searchQuery.trim() || isSearching}
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>

          {/* Keyboard shortcut hint */}
          <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Search Progress Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-primary-glow to-accent"
          initial={{ width: 0 }}
          animate={{ width: isSearchFocused ? '100%' : 0 }}
          transition={{ duration: 0.4 }}
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
            className="absolute top-full mt-3 w-full z-50"
          >
            <Card className="bg-card/95 backdrop-blur-xl border border-border/30 p-6 max-h-96 overflow-y-auto shadow-2xl">
              {/* Live Search Results */}
              {suggestions.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                    </motion.div>
                    <span className="text-sm font-semibold text-foreground">Live Results</span>
                    <Badge variant="secondary" className="text-xs">
                      {suggestions.length} found
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((article, index) => (
                      <motion.button
                        key={article.id}
                        onClick={() => handleSuggestionClick(article)}
                        className="w-full text-left p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 group border border-transparent hover:border-border/50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4, scale: 1.01 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 via-primary-glow/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <span className="text-xs font-bold text-primary">
                              {article.category.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {article.summary}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <Badge variant="secondary" className="text-xs">
                                {article.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {article.readTime} min read
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {article.views.toLocaleString()} views
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
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="text-xs bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground px-3 py-2 rounded-full transition-all duration-300 hover:scale-105"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
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
              {searchQuery && suggestions.length === 0 && !isSearching && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Try different keywords or browse categories
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSearchChange('')}
                    className="text-xs"
                  >
                    Clear search
                  </Button>
                </motion.div>
              )}

              {/* Search Tips */}
              {!searchQuery && (
                <motion.div
                  className="mt-6 pt-6 border-t border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p className="font-medium">Search Tips:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Use keywords like "JEE", "NEET", "scholarship"</li>
                      <li>• Search by author name or category</li>
                      <li>• Use quotes for exact phrases</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};