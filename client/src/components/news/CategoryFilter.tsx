import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  Award, 
  Briefcase, 
  Monitor, 
  Trophy, 
  Globe,
  ChevronDown
} from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons = {
  'All': Globe,
  'Academic': BookOpen,
  'Exam': FileText,
  'Scholarship': Award,
  'Career': Briefcase,
  'Technology': Monitor,
  'Sports': Trophy,
  'General': Globe
};

const categoryColors = {
  'All': 'from-gray-500 to-gray-600',
  'Academic': 'from-blue-500 to-blue-600',
  'Exam': 'from-red-500 to-red-600',
  'Scholarship': 'from-green-500 to-green-600',
  'Career': 'from-purple-500 to-purple-600',
  'Technology': 'from-cyan-500 to-cyan-600',
  'Sports': 'from-orange-500 to-orange-600',
  'General': 'from-gray-500 to-gray-600'
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedIcon = categoryIcons[selectedCategory as keyof typeof categoryIcons] || Globe;
  const selectedColor = categoryColors[selectedCategory as keyof typeof categoryColors] || categoryColors.All;

  return (
    <div className="relative">
      {/* Desktop Horizontal Filter */}
      <div className="hidden md:flex items-center gap-2 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        {categories.map((category) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons] || Globe;
          const isSelected = selectedCategory === category;
          const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.All;

          return (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                flex items-center gap-2 whitespace-nowrap
                ${isSelected 
                  ? 'text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {/* Selected Background */}
              {isSelected && (
                <motion.div
                  layoutId="categoryBackground"
                  className={`absolute inset-0 bg-gradient-to-r ${colorClass} rounded-xl`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Content */}
              <div className="relative flex items-center gap-2">
                <Icon size={16} />
                <span>{category}</span>
              </div>

              {/* Glow Effect */}
              {isSelected && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${colorClass} rounded-xl blur-xl opacity-30`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mobile Dropdown Filter */}
      <div className="md:hidden">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full px-4 py-3 bg-gradient-to-r ${selectedColor} rounded-2xl text-white font-medium
            flex items-center justify-between shadow-lg backdrop-blur-xl
          `}
        >
          <div className="flex items-center gap-3">
            {React.createElement(selectedIcon, { size: 20 })}
            <span>{selectedCategory}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              {categories.map((category, index) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons] || Globe;
                const isSelected = selectedCategory === category;
                const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.All;

                return (
                  <motion.button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                      setIsOpen(false);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      x: 5
                    }}
                    className={`
                      w-full px-4 py-3 text-left transition-all duration-200
                      flex items-center gap-3 relative overflow-hidden
                      ${isSelected ? 'text-white' : 'text-white/80 hover:text-white'}
                    `}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="mobileSelectedBg"
                        className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-20`}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="relative flex items-center gap-3">
                      <Icon size={18} />
                      <span className="font-medium">{category}</span>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-green-400"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Category Count Badges */}
      <div className="hidden lg:flex items-center gap-1 mt-2 text-xs text-white/40">
        <span>Filter by category</span>
        <motion.div
          className="px-2 py-1 bg-white/5 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          {categories.length} options
        </motion.div>
      </div>
    </div>
  );
};