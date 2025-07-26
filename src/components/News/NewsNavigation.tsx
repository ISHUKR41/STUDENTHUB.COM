import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Newspaper, 
  TrendingUp, 
  Search, 
  User, 
  Settings, 
  Bell,
  Menu,
  X,
  Calendar,
  Tag,
  BarChart3,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Enhanced3DLogo } from './Enhanced3DLogo';

const navigationItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'All News', path: '/news', icon: Newspaper },
  { name: 'Trending', path: '/news?category=trending', icon: TrendingUp },
  { name: 'Education', path: '/news?category=education', icon: Users },
  { name: 'Technology', path: '/news?category=technology', icon: BarChart3 },
  { name: 'Career', path: '/news?category=career', icon: Calendar },
  { name: 'Tools', path: '/tools', icon: Settings },
];

export const NewsNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <Enhanced3DLogo className="w-12 h-12 lg:w-16 lg:h-16" />
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden md:block"
              >
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  Student News Hub
                </h1>
                <p className="text-sm text-muted-foreground">Stay Updated, Stay Ahead</p>
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link to={item.path}>
                    <Button
                      variant={isActiveRoute(item.path) ? "default" : "ghost"}
                      className={`relative group transition-all duration-300 ${
                        isActiveRoute(item.path) 
                          ? 'bg-primary text-primary-foreground shadow-glow' 
                          : 'hover:bg-muted/80'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                      
                      {/* Active indicator */}
                      {isActiveRoute(item.path) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -bottom-1 left-1/2 w-2 h-2 bg-accent rounded-full transform -translate-x-1/2"
                        />
                      )}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive">
                    <span className="sr-only">New notifications</span>
                  </Badge>
                </Button>
              </motion.div>

              {/* Search Toggle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="lg:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button
                          variant={isActiveRoute(item.path) ? "default" : "ghost"}
                          className={`w-full justify-start ${
                            isActiveRoute(item.path) 
                              ? 'bg-primary text-primary-foreground' 
                              : ''
                          }`}
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20" />
    </>
  );
};