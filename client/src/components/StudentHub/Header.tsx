import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Link } from 'wouter';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'PYQs', href: '/#pyqs' },
    { label: 'News', href: '/#news' },
    { label: 'Tools', href: '/tools' },
    { label: 'Test', href: '/#test' },
    { label: 'Books', href: '/#books' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-lg shadow-lg py-1 sm:py-2' 
          : 'bg-transparent py-2 sm:py-4'
      }`}
    >
      <nav className="container mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Enhanced Logo with 3D effects */}
        <div className="flex items-center space-x-1 sm:space-x-2 group cursor-pointer hover:scale-105 transition-all duration-300">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-primary rounded-xl opacity-20 group-hover:animate-pulse blur-sm"></div>
            <div className="p-1.5 sm:p-2 bg-gradient-primary rounded-lg group-hover:shadow-glow transition-all duration-300 relative z-10">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:h-5 md:h-6 md:w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="relative">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold gradient-text group-hover:animate-pulse">
              <span className="hidden sm:inline">📚 STUDENTHUB.COM</span>
              <span className="sm:hidden">📚 STUDENTHUB</span>
            </span>
            <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-foreground-secondary hover:text-primary transition-colors duration-300 font-medium text-sm xl:text-base py-2 px-1 touch-target hover:scale-105 transform"
              style={{ willChange: 'transform, color' }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button className="btn-hero text-sm xl:text-base px-4 xl:px-6 py-2 xl:py-3 touch-target hover:shadow-glow transition-all duration-300 transform hover:scale-105">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground hover:text-primary transition-colors touch-target"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
      >
        <div className="glass border-t border-border/20 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block text-foreground-secondary hover:text-primary transition-all duration-300 font-medium py-3 px-2 rounded-lg hover:bg-background/20 touch-target transform hover:translate-x-2"
              onClick={() => setIsMenuOpen(false)}
              style={{ willChange: 'transform, color, background-color' }}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border/20 mt-4">
            <Button className="btn-hero w-full touch-target text-base py-3">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};