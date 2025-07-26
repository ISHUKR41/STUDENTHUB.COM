import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Globe, Award, FileText, Trophy } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  color: string;
}

export const StatsCounter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement>(null);

  const stats: StatItem[] = [
    {
      icon: <FileText className="h-8 w-8" />,
      value: 25000,
      label: "Question Papers",
      suffix: "+",
      color: "text-primary"
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: 170,
      label: "Million Annual Users",
      suffix: "M+",
      color: "text-secondary"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      value: 22,
      label: "Languages Supported",
      suffix: "+",
      color: "text-accent"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      value: 500,
      label: "Exam Categories",
      suffix: "+",
      color: "text-science"
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: 50,
      label: "Board Types",
      suffix: "+",
      color: "text-engineering"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      value: 15,
      label: "Years Experience",
      suffix: "+",
      color: "text-medical"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepTime = duration / steps;

    stats.forEach((stat, index) => {
      let currentCount = 0;
      const increment = stat.value / steps;

      const timer = setInterval(() => {
        currentCount += increment;
        
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = Math.min(currentCount, stat.value);
          return newCounts;
        });

        if (currentCount >= stat.value) {
          clearInterval(timer);
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = stat.value;
            return newCounts;
          });
        }
      }, stepTime);
    });
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef} 
      className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-background-secondary/50"
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-3 sm:mb-4">
            Numbers That Speak
          </h2>
          <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Join millions of students who trust STUDENTHUB.COM for their academic success
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`card-feature hover-lift bg-card/50 border-border/50 text-center h-full ${
                isVisible ? 'animate-fadeInScale' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-3 sm:p-4 lg:p-6 flex flex-col justify-center h-full">
                <div className={`${stat.color} mb-2 sm:mb-3 lg:mb-4 flex justify-center`}>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center">
                    {React.cloneElement(stat.icon as React.ReactElement, { 
                      className: "h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" 
                    })}
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                    {Math.floor(counts[index]).toLocaleString()}
                    <span className={stat.color}>{stat.suffix}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground-secondary font-medium leading-tight">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats Bar */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-background/30">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">99.9%</div>
            <p className="text-xs sm:text-sm text-foreground-secondary">Uptime Guarantee</p>
          </div>
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-background/30">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text-secondary">24/7</div>
            <p className="text-xs sm:text-sm text-foreground-secondary">Support Available</p>
          </div>
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-background/30">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text-accent">100%</div>
            <p className="text-xs sm:text-sm text-foreground-secondary">Authentic Papers</p>
          </div>
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-background/30">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">Free</div>
            <p className="text-xs sm:text-sm text-foreground-secondary">Basic Access</p>
          </div>
        </div>
      </div>
    </section>
  );
};