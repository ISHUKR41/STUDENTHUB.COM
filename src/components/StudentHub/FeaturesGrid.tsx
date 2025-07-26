import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  FolderTree, 
  Eye, 
  Crown, 
  RefreshCw, 
  Languages 
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  color, 
  delay = 0 
}) => (
  <Card 
    className="card-feature hover-lift group cursor-pointer h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <CardHeader className="text-center pb-3 sm:pb-4">
      <div className={`${color} mb-3 sm:mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300`}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" 
          })}
        </div>
      </div>
      <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0 flex-1">
      <p className="text-foreground-secondary text-center leading-relaxed text-sm sm:text-base">
        {description}
      </p>
    </CardContent>
  </Card>
);

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <Download className="h-10 w-10" />,
      title: "Instant PDF Downloads",
      description: "Download any question paper instantly in high-quality PDF format. No waiting, no registration required for basic access.",
      color: "text-primary",
    },
    {
      icon: <FolderTree className="h-10 w-10" />,
      title: "Organized by Class & Exam",
      description: "Smart categorization by class, subject, exam type, and year. Find exactly what you need in seconds.",
      color: "text-secondary",
    },
    {
      icon: <Eye className="h-10 w-10" />,
      title: "3D-Rendered Previews",
      description: "Interactive 3D preview of question papers before download. See exactly what you're getting with our advanced viewer.",
      color: "text-accent",
    },
    {
      icon: <Crown className="h-10 w-10" />,
      title: "Free & Premium Papers",
      description: "Access thousands of papers for free, or upgrade to premium for exclusive latest papers and advanced features.",
      color: "text-engineering",
    },
    {
      icon: <RefreshCw className="h-10 w-10" />,
      title: "Weekly Updates",
      description: "Our database is updated weekly with new question papers. Never miss the latest exam patterns and questions.",
      color: "text-medical",
    },
    {
      icon: <Languages className="h-10 w-10" />,
      title: "Multi-Language Support",
      description: "Question papers available in 22+ Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, and more.",
      color: "text-competitive",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 sm:mb-6">
            Why Choose STUDENTHUB.COM?
          </h2>
          <p className="text-foreground-secondary text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed px-4">
            Discover the features that make us India's most trusted platform for question papers and academic resources
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="glass-intense rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
              Ready to Experience the Future of Learning?
            </h3>
            <p className="text-foreground-secondary mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Join over 170 million students who have already discovered the power of organized, instant access to quality question papers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="btn-hero touch-target text-sm sm:text-base px-6 sm:px-8 py-3">
                Start Free Today
              </button>
              <button className="btn-ghost touch-target text-sm sm:text-base px-6 sm:px-8 py-3">
                Explore Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};