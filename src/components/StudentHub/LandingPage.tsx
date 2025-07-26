import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { FeaturesGrid } from './FeaturesGrid';
import { CategoryCarousel } from './CategoryCarousel';
import { HowItWorks } from './HowItWorks';
import { TrendingDownloads } from './TrendingDownloads';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';
import { FooterSection } from './FooterSection';
import { StatsCounter } from './StatsCounter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Hero Section with 3D Globe */}
      <HeroSection />
      
      {/* Stats Counter */}
      <StatsCounter />
      
      {/* Key Features Grid */}
      <FeaturesGrid />
      
      {/* Category Carousel */}
      <CategoryCarousel />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Trending Downloads */}
      <TrendingDownloads />
      
      {/* Testimonials */}
      <TestimonialsCarousel />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};