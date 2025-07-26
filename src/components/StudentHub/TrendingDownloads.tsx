import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Star, Calendar, FileText, TrendingUp } from 'lucide-react';

interface PaperData {
  id: string;
  title: string;
  exam: string;
  year: number;
  subject: string;
  downloads: number;
  rating: number;
  pages: number;
  language: string;
  category: string;
  trending?: boolean;
  premium?: boolean;
}

export const TrendingDownloads: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'popular'>('trending');

  const trendingPapers: PaperData[] = [
    {
      id: '1',
      title: 'JEE Main January 2024 - Mathematics',
      exam: 'JEE Main',
      year: 2024,
      subject: 'Mathematics',
      downloads: 45230,
      rating: 4.8,
      pages: 28,
      language: 'English',
      category: 'Engineering',
      trending: true,
    },
    {
      id: '2',
      title: 'NEET UG 2024 - Biology Question Paper',
      exam: 'NEET UG',
      year: 2024,
      subject: 'Biology',
      downloads: 52100,
      rating: 4.9,
      pages: 32,
      language: 'English',
      category: 'Medical',
      trending: true,
    },
    {
      id: '3',
      title: 'CBSE Class 12 Physics 2024',
      exam: 'CBSE Class 12',
      year: 2024,
      subject: 'Physics',
      downloads: 38900,
      rating: 4.7,
      pages: 24,
      language: 'English',
      category: 'Board',
      trending: true,
    },
    {
      id: '4',
      title: 'CAT 2023 - Quantitative Aptitude',
      exam: 'CAT',
      year: 2023,
      subject: 'Quantitative Aptitude',
      downloads: 29400,
      rating: 4.6,
      pages: 20,
      language: 'English',
      category: 'Management',
      premium: true,
    },
    {
      id: '5',
      title: 'UPSC Prelims 2023 - General Studies',
      exam: 'UPSC CSE',
      year: 2023,
      subject: 'General Studies',
      downloads: 67800,
      rating: 4.9,
      pages: 36,
      language: 'English',
      category: 'Competitive',
      trending: true,
    },
    {
      id: '6',
      title: 'SSC CGL 2023 - Reasoning Ability',
      exam: 'SSC CGL',
      year: 2023,
      subject: 'Reasoning',
      downloads: 41200,
      rating: 4.5,
      pages: 22,
      language: 'Hindi',
      category: 'Competitive',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Engineering': 'text-engineering bg-engineering/10 border-engineering/20',
      'Medical': 'text-medical bg-medical/10 border-medical/20',
      'Board': 'text-science bg-science/10 border-science/20',
      'Management': 'text-commerce bg-commerce/10 border-commerce/20',
      'Competitive': 'text-competitive bg-competitive/10 border-competitive/20',
    };
    return colors[category] || 'text-primary bg-primary/10 border-primary/20';
  };

  const PaperCard: React.FC<{ paper: PaperData; index: number }> = ({ paper, index }) => (
    <Card 
      className="card-feature hover-lift group relative overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {paper.trending && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-accent text-accent-foreground">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        </div>
      )}
      
      {paper.premium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-accent text-accent-foreground">
            Premium
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {paper.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={getCategoryColor(paper.category)}>
                {paper.exam}
              </Badge>
              <span className="text-sm text-foreground-secondary">•</span>
              <span className="text-sm text-foreground-secondary">{paper.year}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-foreground-secondary">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{paper.downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-accent" />
                <span>{paper.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{paper.pages}p</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {paper.language}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="flex-1 hover:bg-background/80">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" className="flex-1 btn-hero text-sm py-2">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 bg-background-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-6">
            Trending Downloads
          </h2>
          <p className="text-foreground-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover what students are downloading right now. Stay updated with the latest question papers.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="glass rounded-xl p-1 flex">
            {[
              { key: 'trending', label: 'Trending Now', icon: <TrendingUp className="h-4 w-4" /> },
              { key: 'recent', label: 'Recent Additions', icon: <Calendar className="h-4 w-4" /> },
              { key: 'popular', label: 'Most Popular', icon: <Star className="h-4 w-4" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-background/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPapers.map((paper, index) => (
            <PaperCard key={paper.id} paper={paper} index={index} />
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="btn-ghost">
            View All Papers
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 glass-intense rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold gradient-text">1M+</div>
              <p className="text-sm text-foreground-secondary">Downloads This Month</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold gradient-text-secondary">500+</div>
              <p className="text-sm text-foreground-secondary">New Papers Added</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold gradient-text-accent">4.8/5</div>
              <p className="text-sm text-foreground-secondary">Average Rating</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold gradient-text">24hrs</div>
              <p className="text-sm text-foreground-secondary">Latest Updates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};