import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface CategoryData {
  id: string;
  title: string;
  description: string;
  paperCount: number;
  subjects: string[];
  color: string;
  gradient: string;
}

export const CategoryCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: CategoryData[] = [
    {
      id: 'class-9-12',
      title: 'Classes 9-12 (Boards)',
      description: 'CBSE, ICSE, State Boards - Science, Commerce, Arts',
      paperCount: 8500,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi'],
      color: 'text-science',
      gradient: 'from-science/20 to-science/5'
    },
    {
      id: 'engineering',
      title: 'Engineering Entrance',
      description: 'JEE Main, JEE Advanced, BITSAT, State Engineering Exams',
      paperCount: 2300,
      subjects: ['JEE Main', 'JEE Advanced', 'BITSAT', 'WBJEE', 'MHT CET'],
      color: 'text-engineering',
      gradient: 'from-engineering/20 to-engineering/5'
    },
    {
      id: 'medical',
      title: 'Medical & Allied Health',
      description: 'NEET UG, AIIMS, JIPMER, Nursing, Pharmacy',
      paperCount: 1800,
      subjects: ['NEET UG', 'AIIMS', 'JIPMER', 'Nursing', 'Pharmacy'],
      color: 'text-medical',
      gradient: 'from-medical/20 to-medical/5'
    },
    {
      id: 'competitive',
      title: 'Competitive Exams',
      description: 'UPSC, SSC, Banking, Railways, Defense',
      paperCount: 4200,
      subjects: ['UPSC CSE', 'SSC CGL', 'IBPS PO', 'RRB NTPC', 'NDA'],
      color: 'text-competitive',
      gradient: 'from-competitive/20 to-competitive/5'
    },
    {
      id: 'management',
      title: 'Management & Law',
      description: 'CAT, XAT, CLAT, Law Entrance, MBA Programs',
      paperCount: 1600,
      subjects: ['CAT', 'XAT', 'CLAT', 'LSAT', 'MAT'],
      color: 'text-commerce',
      gradient: 'from-commerce/20 to-commerce/5'
    },
    {
      id: 'professional',
      title: 'Professional Courses',
      description: 'CA, CS, CMA, Architecture, Design',
      paperCount: 2100,
      subjects: ['CA', 'CS', 'CMA', 'NATA', 'CEED'],
      color: 'text-accent',
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      id: 'postgraduate',
      title: 'Postgraduate & Research',
      description: 'GATE, JAM, UGC NET, PhD Entrance',
      paperCount: 1800,
      subjects: ['GATE', 'JAM', 'UGC NET', 'CSIR NET', 'PhD'],
      color: 'text-arts',
      gradient: 'from-arts/20 to-arts/5'
    },
    {
      id: 'graduation',
      title: 'Graduation Programs',
      description: 'University Exams, Semester Papers, Bachelor Degrees',
      paperCount: 2700,
      subjects: ['BA', 'BSc', 'BCom', 'BBA', 'BCA'],
      color: 'text-primary',
      gradient: 'from-primary/20 to-primary/5'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-background-secondary/30">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 sm:mb-6">
            Explore by Category
          </h2>
          <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed px-4">
            From Class 9 to PhD level - find question papers for every examination and course in India
          </p>
        </div>

        {/* Mobile: Show All Cards in Grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
          {categories.slice(0, 4).map((category, index) => (
            <Card 
              key={category.id}
              className={`card-feature hover-lift bg-gradient-to-br ${category.gradient} border-border/50 group cursor-pointer`}
            >
              <CardContent className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="space-y-1 sm:space-y-2 flex-1 pr-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className={`${category.color} bg-background/50 text-xs`}>
                    {category.paperCount.toLocaleString()}+
                  </Badge>
                </div>

                {/* Subjects Tags - Mobile */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {category.subjects.slice(0, 3).map((subject) => (
                      <span
                        key={subject}
                        className="px-2 py-1 bg-background/30 rounded-full text-xs text-foreground-secondary border border-border/30"
                      >
                        {subject}
                      </span>
                    ))}
                    {category.subjects.length > 3 && (
                      <span className="px-2 py-1 bg-background/30 rounded-full text-xs text-foreground-secondary border border-border/30">
                        +{category.subjects.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between hover:bg-background/50 group/btn text-sm touch-target"
                >
                  <span>View Papers</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop: Carousel Controls */}
        <div className="hidden lg:flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('left')}
              className="rounded-full w-10 h-10 xl:w-12 xl:h-12 p-0 hover-scale touch-target"
            >
              <ChevronLeft className="h-4 w-4 xl:h-5 xl:w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('right')}
              className="rounded-full w-10 h-10 xl:w-12 xl:h-12 p-0 hover-scale touch-target"
            >
              <ChevronRight className="h-4 w-4 xl:h-5 xl:w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop: Category Cards Carousel */}
        <div 
          ref={scrollContainerRef}
          className="hidden lg:flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <Card 
              key={category.id}
              className={`card-feature hover-lift flex-shrink-0 w-72 xl:w-80 bg-gradient-to-br ${category.gradient} border-border/50 group cursor-pointer`}
            >
              <CardContent className="p-5 xl:p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h3 className="text-lg xl:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-foreground-secondary text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className={`${category.color} bg-background/50`}>
                    {category.paperCount.toLocaleString()}+
                  </Badge>
                </div>

                {/* Subjects Tags */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {category.subjects.slice(0, 4).map((subject) => (
                      <span
                        key={subject}
                        className="px-3 py-1 bg-background/30 rounded-full text-xs text-foreground-secondary border border-border/30"
                      >
                        {subject}
                      </span>
                    ))}
                    {category.subjects.length > 4 && (
                      <span className="px-3 py-1 bg-background/30 rounded-full text-xs text-foreground-secondary border border-border/30">
                        +{category.subjects.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between hover:bg-background/50 group/btn touch-target"
                >
                  <span>View Papers</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">25K+</div>
              <p className="text-xs sm:text-sm text-foreground-secondary">Total Papers</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text-secondary">500+</div>
              <p className="text-xs sm:text-sm text-foreground-secondary">Exam Types</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text-accent">50+</div>
              <p className="text-xs sm:text-sm text-foreground-secondary">Boards Covered</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">15+</div>
              <p className="text-xs sm:text-sm text-foreground-secondary">Years Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};