import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Heart, Share2, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'wouter';

interface NewsArticle {
  id: number;
  title: string;
  subtitle?: string;
  summary: string;
  fullContent: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  readTime: number;
  featured: boolean;
  priority: number;
  images: Array<{url: string, alt: string, caption: string}>;
  views: number;
  likes: number;
  shares: number;
}

const NewsDetail: React.FC = () => {
  const [match, params] = useRoute('/news/:id');
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchArticle(parseInt(params.id));
    }
  }, [params?.id]);

  const fetchArticle = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      setError('Failed to load article');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!article) return;
    
    try {
      const response = await fetch(`/api/news/${article.id}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setLiked(!liked);
        setArticle(prev => prev ? {
          ...prev,
          likes: liked ? prev.likes - 1 : prev.likes + 1
        } : null);
      }
    } catch (err) {
      console.error('Error liking article:', err);
    }
  };

  const handleShare = async () => {
    if (!article) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
      
      // Update share count
      fetch(`/api/news/${article.id}/share`, { method: 'POST' });
      setArticle(prev => prev ? { ...prev, shares: prev.shares + 1 } : null);
    } catch (err) {
      console.error('Error sharing article:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-700 rounded mb-6"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Article Not Found</h2>
          <p className="text-gray-300 mb-6">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
          <Link href="/news" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/news" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to News
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-4">
            <span className="inline-block bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          
          {article.subtitle && (
            <h2 className="text-xl md:text-2xl text-gray-300 mb-6 font-light">
              {article.subtitle}
            </h2>
          )}

          {/* Article Meta */}
          <div className="flex flex-wrap gap-6 text-gray-400 text-sm mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{article.likes.toLocaleString()}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{article.shares.toLocaleString()}</span>
            </button>
          </div>
        </motion.div>

        {/* Featured Image */}
        {article.images && article.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={article.images[0].url}
                alt={article.images[0].alt}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            {article.images[0].caption && (
              <p className="text-gray-400 text-sm mt-2 text-center italic">
                {article.images[0].caption}
              </p>
            )}
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
            <div className="prose prose-lg prose-invert max-w-none">
              {article.fullContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-200 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to News Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/news"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All News
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsDetail;