import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NewsArticle } from '@/lib/newsData';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';

interface NewsHeroProps {
  articles: NewsArticle[];
}

export const NewsHero = ({ articles }: NewsHeroProps) => {
  const featuredArticle = articles[0];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-accent text-accent-foreground">
            Breaking News
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            {featuredArticle.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {featuredArticle.summary}
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{featuredArticle.readTime}m read</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{featuredArticle.views.toLocaleString()} views</span>
            </div>
          </div>
          
          <Link
            to={`/news/${featuredArticle.slug}`}
            className="btn-hero inline-block"
          >
            Read Full Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
};