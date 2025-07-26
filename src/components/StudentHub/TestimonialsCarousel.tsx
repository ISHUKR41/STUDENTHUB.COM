import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  rating: number;
  content: string;
  exam: string;
  year: number;
  avatar: string;
}

export const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      role: 'Medical Student',
      institution: 'AIIMS Delhi',
      rating: 5,
      content: 'STUDENTHUB.COM was my secret weapon for NEET preparation. The previous years\' papers helped me understand the exam pattern perfectly. I cleared NEET with AIR 247!',
      exam: 'NEET UG',
      year: 2024,
      avatar: 'PS'
    },
    {
      id: '2',
      name: 'Arjun Patel',
      role: 'Engineering Student',
      institution: 'IIT Bombay',
      rating: 5,
      content: 'The JEE Main and Advanced papers collection is incredible. The quality of PDFs and the organized structure made my revision so much easier. Highly recommended!',
      exam: 'JEE Advanced',
      year: 2023,
      avatar: 'AP'
    },
    {
      id: '3',
      name: 'Sneha Reddy',
      role: 'Civil Services Aspirant',
      institution: 'Delhi University',
      rating: 5,
      content: 'As a UPSC aspirant, finding authentic previous year papers was crucial. This platform has everything from prelims to mains papers. It\'s a goldmine for serious aspirants.',
      exam: 'UPSC CSE',
      year: 2023,
      avatar: 'SR'
    },
    {
      id: '4',
      name: 'Vikash Kumar',
      role: 'MBA Student',
      institution: 'IIM Calcutta',
      rating: 5,
      content: 'CAT preparation became so much easier with their comprehensive question paper collection. The filtering options helped me focus on specific topics. Scored 99.8 percentile!',
      exam: 'CAT',
      year: 2023,
      avatar: 'VK'
    },
    {
      id: '5',
      name: 'Ananya Singh',
      role: 'Class 12 Student',
      institution: 'Delhi Public School',
      rating: 5,
      content: 'Being a CBSE student, I found all the board papers I needed here. The subject-wise organization saved me so much time during revision. Scored 96% in boards!',
      exam: 'CBSE Class 12',
      year: 2024,
      avatar: 'AS'
    },
    {
      id: '6',
      name: 'Raj Mehta',
      role: 'Banking Professional',
      institution: 'State Bank of India',
      rating: 5,
      content: 'The SSC and banking exam papers helped me crack multiple competitive exams. The quality and authenticity of papers is top-notch. Worth every penny!',
      exam: 'SSC CGL',
      year: 2023,
      avatar: 'RM'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 sm:mb-6">
            Success Stories
          </h2>
          <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed px-4">
            Hear from students who achieved their dreams with our question papers
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Mobile: Single Card Display */}
          <div className="lg:hidden mb-8">
            <Card className="card-feature hover-lift">
              <CardContent className="p-6 sm:p-8 relative">
                <Quote className="absolute top-3 sm:top-4 right-3 sm:right-4 h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4 sm:mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-current text-accent" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-foreground leading-relaxed mb-6 sm:mb-8 italic text-sm sm:text-base">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary text-white font-bold">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-base">
                      {testimonials[currentIndex].avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-sm sm:text-base">{testimonials[currentIndex].name}</h4>
                    <p className="text-xs sm:text-sm text-foreground-secondary">{testimonials[currentIndex].role}</p>
                    <p className="text-xs sm:text-sm text-foreground-secondary">{testimonials[currentIndex].institution}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-medium text-primary">{testimonials[currentIndex].exam}</div>
                    <div className="text-xs sm:text-sm text-foreground-secondary">{testimonials[currentIndex].year}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop: Three Cards Display */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-12">
            {getVisibleTestimonials().map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className={`card-feature hover-lift transition-all duration-500 h-full ${
                  index === 1 ? 'lg:scale-105 lg:shadow-2xl' : 'lg:scale-95 opacity-80 lg:opacity-100'
                }`}
              >
                <CardContent className="p-6 xl:p-8 relative flex flex-col h-full">
                  <Quote className="absolute top-4 right-4 h-6 w-6 xl:h-8 xl:w-8 text-primary/20" />
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4 xl:mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 xl:h-5 xl:w-5 fill-current text-accent" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-foreground leading-relaxed mb-6 xl:mb-8 italic text-sm xl:text-base flex-1">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 xl:gap-4 mt-auto">
                    <Avatar className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-primary text-white font-bold">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm xl:text-base truncate">{testimonial.name}</h4>
                      <p className="text-xs xl:text-sm text-foreground-secondary truncate">{testimonial.role}</p>
                      <p className="text-xs xl:text-sm text-foreground-secondary truncate">{testimonial.institution}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs xl:text-sm font-medium text-primary">{testimonial.exam}</div>
                      <div className="text-xs xl:text-sm text-foreground-secondary">{testimonial.year}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 hover-scale touch-target"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-1 sm:gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all touch-target ${
                    index === currentIndex 
                      ? 'bg-primary w-6 sm:w-8' 
                      : 'bg-border hover:bg-foreground-secondary'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 hover-scale touch-target"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Auto-play indicator */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-foreground-secondary">
              {isAutoPlaying ? 'Auto-playing testimonials' : 'Auto-play paused'}
            </p>
          </div>
        </div>

        {/* Success Statistics */}
        <div className="mt-12 sm:mt-16 glass-intense rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">50K+</div>
              <p className="text-xs sm:text-sm text-foreground-secondary">Success Stories</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text-secondary">4.9/5</div>
              <p className="text-xs sm:text-sm text-foreground-secondary">Average Rating</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text-accent">95%</div>
              <p className="text-xs sm:text-sm text-foreground-secondary">Recommend Us</p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">100%</div>
              <p className="text-xs sm:text-sm text-foreground-secondary">Authentic Papers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};