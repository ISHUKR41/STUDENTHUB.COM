import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsAPI, NewsArticle } from '@/lib/newsData';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const TrendingSidebar = () => {
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const trending = await newsAPI.getTrendingNews();
        setTrendingNews(trending.slice(0, 5));
      } catch (error) {
        console.error('Failed to load trending news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      {/* Trending Section */}
      <div className="bg-gradient-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Trending Now</h3>
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))
          ) : (
            trendingNews.map((article, index) => (
              <motion.div
                key={article.id}
                className="group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/news/${article.slug}`}
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span>{article.views.toLocaleString()}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{article.readTime}m</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-primary p-6 rounded-xl text-primary-foreground">
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-sm opacity-90 mb-4">
          Get the latest student news delivered to your inbox.
        </p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-lg text-foreground"
          />
          <button className="w-full bg-background text-foreground py-2 rounded-lg font-medium hover:bg-muted transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </motion.div>
  );
};