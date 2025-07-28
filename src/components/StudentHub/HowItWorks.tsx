import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Download } from 'lucide-react';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Step: React.FC<StepProps> = ({ number, icon, title, description, delay }) => (
  <div 
    className="text-center space-y-4 sm:space-y-6 animate-fadeInUp"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold shadow-glow mx-auto mb-3 sm:mb-4">
        {number}
      </div>
      <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 text-primary">
        <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" 
          })}
        </div>
      </div>
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-foreground px-2">{title}</h3>
    <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed max-w-sm mx-auto px-4">{description}</p>
  </div>
);

const ConnectorLine: React.FC<{ index: number }> = ({ index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 300 + (index * 200));
        }
      },
      { threshold: 0.5 }
    );

    if (lineRef.current) {
      observer.observe(lineRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div 
      ref={lineRef}
      className="hidden lg:flex items-center justify-center h-24"
    >
      <div 
        className={`w-32 h-1 bg-gradient-primary rounded-full transition-all duration-1000 ${
          isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
        }`}
        style={{ transformOrigin: 'left' }}
      >
        <div className="w-full h-full bg-gradient-primary rounded-full animate-shimmer"></div>
      </div>
      <div 
        className={`ml-2 w-3 h-3 bg-primary rounded-full transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        style={{ transitionDelay: '800ms' }}
      ></div>
    </div>
  );
};

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: <Search className="h-8 w-8" />,
      title: "Select Class/Exam",
      description: "Choose your class, exam type, or specific examination from our comprehensive categorized list."
    },
    {
      number: 2,
      icon: <Filter className="h-8 w-8" />,
      title: "Browse & Filter",
      description: "Filter by year, subject, language, and exam pattern. Use our smart search to find exactly what you need."
    },
    {
      number: 3,
      icon: <Download className="h-8 w-8" />,
      title: "Download & Print",
      description: "Instantly download high-quality PDF files. Print or study digitally - whatever works best for you."
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 sm:mb-6">
            How It Works
          </h2>
          <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed px-4">
            Get your question papers in just 3 simple steps. It's that easy!
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-start justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex-1">
                  <Step
                    number={step.number}
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    delay={index * 200}
                  />
                </div>
                {index < steps.length - 1 && <ConnectorLine index={index} />}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8 sm:space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <Step
                  number={step.number}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  delay={index * 200}
                />
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <div className="w-1 h-12 sm:h-16 bg-gradient-primary rounded-full opacity-50"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="mt-16 sm:mt-20">
          <div className="glass-intense rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Try Our Interactive Demo
              </h3>
              <p className="text-foreground-secondary text-sm sm:text-base">
                Experience the process yourself with our live demo
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="card-feature hover-scale cursor-pointer touch-target">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                  <h4 className="font-bold text-foreground mb-2 text-sm sm:text-base">Search Demo</h4>
                  <p className="text-xs sm:text-sm text-foreground-secondary">Try searching for "JEE Main 2023"</p>
                </CardContent>
              </Card>

              <Card className="card-feature hover-scale cursor-pointer touch-target">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Filter className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-secondary mx-auto mb-3 sm:mb-4" />
                  <h4 className="font-bold text-foreground mb-2 text-sm sm:text-base">Filter Demo</h4>
                  <p className="text-xs sm:text-sm text-foreground-secondary">See our advanced filtering in action</p>
                </CardContent>
              </Card>

              <Card className="card-feature hover-scale cursor-pointer touch-target">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Download className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-accent mx-auto mb-3 sm:mb-4" />
                  <h4 className="font-bold text-foreground mb-2 text-sm sm:text-base">Download Demo</h4>
                  <p className="text-xs sm:text-sm text-foreground-secondary">Experience instant PDF downloads</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Success Statistics */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-background-secondary/30">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">2.5s</div>
            <p className="text-xs sm:text-sm text-foreground-secondary">Average Search Time</p>
          </div>
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-background-secondary/30">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text-secondary">99.9%</div>
            <p className="text-xs sm:text-sm text-foreground-secondary">Download Success Rate</p>
          </div>
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-background-secondary/30">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text-accent">24/7</div>
            <p className="text-xs sm:text-sm text-foreground-secondary">Always Available</p>
          </div>
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-background-secondary/30">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">500MB/s</div>
            <p className="text-xs sm:text-sm text-foreground-secondary">Download Speed</p>
          </div>
        </div>
      </div>
    </section>
  );
};