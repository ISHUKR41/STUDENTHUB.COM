import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Newspaper, Wrench, BookOpen, Phone, Info, User, Search } from 'lucide-react';
import { Enhanced3DLogo } from './Enhanced3DLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'News', href: '/news', icon: Newspaper, badge: 'New' },
  { label: 'Tools', href: '/tools', icon: Wrench },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Phone },
];

export const NewsNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50'
            : 'bg-background/80 backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <Enhanced3DLogo onClick={() => window.location.href = '/'} />
              <div className="hidden sm:block">
                <motion.h1 
                  className="text-xl md:text-2xl font-bold gradient-text"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  StudentHub
                </motion.h1>
                <motion.p 
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Latest Education News
                </motion.p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={item.href}>
                      <motion.div
                        className={`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Active indicator */}
                        {active && (
                          <motion.div
                            className="absolute bottom-0 left-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-primary-glow rounded-full"
                            layoutId="activeIndicator"
                            initial={{ x: '-50%' }}
                          />
                        )}
                        
                        {/* Hover effect */}
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          layout
                        />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Search shortcut (desktop) */}
              <motion.div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg text-muted-foreground text-sm cursor-pointer hover:bg-muted transition-colors"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                  searchInput?.focus();
                }}
              >
                <Search className="w-4 h-4" />
                <span>Search news...</span>
                <kbd className="px-1.5 py-0.5 bg-background/50 rounded text-xs">⌘K</kbd>
              </motion.div>

              {/* Admin button (if logged in) */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex items-center gap-2"
                  onClick={() => window.open('/admin/news', '_blank')}
                >
                  <User className="w-4 h-4" />
                  Admin
                </Button>
              </motion.div>

              {/* Mobile menu button */}
              <motion.button
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu content */}
            <motion.div
              className="absolute top-16 md:top-20 left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-6">
                <div className="grid gap-3">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link to={item.href}>
                          <motion.div
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                              active
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                            }`}
                            whileHover={{ x: 4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs ml-auto">
                                {item.badge}
                              </Badge>
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  {/* Mobile admin button */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    className="pt-3 border-t border-border/50"
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => window.open('/admin/news', '_blank')}
                    >
                      <User className="w-5 h-5" />
                      Admin Panel
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut listener */}
      <div
        className="fixed inset-0 pointer-events-none"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            searchInput?.focus();
          }
        }}
        tabIndex={-1}
      />
    </>
  );
};