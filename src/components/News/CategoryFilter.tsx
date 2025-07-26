import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  articleCounts?: Record<string, number>;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  articleCounts = {}
}: CategoryFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColors = {
    all: 'from-primary to-primary-glow',
    exam: 'from-red-500 to-red-400',
    scholarship: 'from-green-500 to-green-400',
    technology: 'from-blue-500 to-blue-400',
    career: 'from-purple-500 to-purple-400',
    academic: 'from-orange-500 to-orange-400',
    sports: 'from-pink-500 to-pink-400',
    general: 'from-gray-500 to-gray-400'
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      exam: '📚',
      scholarship: '💰',
      technology: '💻',
      career: '🚀',
      academic: '🎓',
      sports: '⚽',
      general: '📰'
    };
    return icons[category.toLowerCase() as keyof typeof icons] || '📄';
  };

  return (
    <div className="w-full">
      {/* Mobile/Collapsed View */}
      <div className="lg:hidden">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full glassmorphism p-4 rounded-xl flex items-center justify-between"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-medium">
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
            </span>
            {articleCounts[selectedCategory] && (
              <Badge variant="secondary" className="text-xs">
                {articleCounts[selectedCategory]}
              </Badge>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 glassmorphism rounded-xl p-4 space-y-2"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    selectedCategory === category
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'hover:bg-muted/50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <span className="capitalize font-medium">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {articleCounts[category] && (
                      <Badge variant="outline" className="text-xs">
                        {articleCounts[category]}
                      </Badge>
                    )}
                    {selectedCategory === category && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">Categories</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-border via-primary/20 to-transparent" />
        </motion.div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => onCategoryChange(category)}
                className={`relative overflow-hidden group transition-all duration-300 ${
                  selectedCategory === category
                    ? `bg-gradient-to-r ${categoryColors[category.toLowerCase() as keyof typeof categoryColors] || categoryColors.all} text-white shadow-glow`
                    : 'hover:border-primary/50 hover:text-primary'
                }`}
              >
                {/* Background Animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Content */}
                <div className="relative flex items-center gap-2">
                  <span className="text-sm">{getCategoryIcon(category)}</span>
                  <span className="capitalize font-medium">{category}</span>
                  {articleCounts[category] && (
                    <Badge 
                      variant={selectedCategory === category ? "secondary" : "outline"}
                      className="text-xs ml-1"
                    >
                      {articleCounts[category]}
                    </Badge>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedCategory === category && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="categoryIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Active Category Info */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 glassmorphism p-3 rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing articles in</span>
                <Badge variant="secondary" className="capitalize">
                  {selectedCategory}
                </Badge>
                {articleCounts[selectedCategory] && (
                  <>
                    <span>•</span>
                    <span>{articleCounts[selectedCategory]} articles found</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};