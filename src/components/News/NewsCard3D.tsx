import { useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart, Share2, Clock, Calendar, User, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NewsArticle } from '@/lib/newsData';
import { useToast } from '@/hooks/use-toast';

interface NewsCard3DProps {
  article: NewsArticle;
  index: number;
  featured?: boolean;
}

export const NewsCard3D = ({ article, index, featured = false }: NewsCard3DProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // 3D Transform springs
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = (event.clientX - centerX) / (rect.width / 2);
    const mouseY = (event.clientY - centerY) / (rect.height / 2);
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleCardClick = () => {
    navigate(`/news/${article.slug}`);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/news/${article.slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Article link has been copied to clipboard.",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      exam: 'from-red-500/20 to-red-500/5 border-red-500/30',
      scholarship: 'from-green-500/20 to-green-500/5 border-green-500/30',
      technology: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
      career: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
      academic: 'from-orange-500/20 to-orange-500/5 border-orange-500/30',
      sports: 'from-pink-500/20 to-pink-500/5 border-pink-500/30',
      general: 'from-gray-500/20 to-gray-500/5 border-gray-500/30'
    };
    return colors[category.toLowerCase() as keyof typeof colors] || colors.general;
  };

  return (
    <motion.div
      ref={cardRef}
      className={`perspective-1000 ${featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="preserve-3d relative cursor-pointer group"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
        onClick={handleCardClick}
      >
        {/* Front of Card */}
        <motion.div
          className={`backface-hidden w-full glassmorphism rounded-2xl overflow-hidden ${getCategoryColor(article.category)} ${
            featured ? 'min-h-[400px]' : 'min-h-[350px]'
          }`}
          animate={{
            y: isHovered ? -8 : 0,
            boxShadow: isHovered 
              ? "0 25px 50px -12px rgba(59, 130, 246, 0.35)" 
              : "0 10px 30px -10px rgba(59, 130, 246, 0.2)"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Image Section */}
          <div className="relative overflow-hidden group">
            <motion.img
              src={article.imageUrl}
              alt={article.title}
              className={`w-full object-cover transition-transform duration-700 ${
                featured ? 'h-48' : 'h-36'
              }`}
              whileHover={{ scale: 1.1 }}
              loading="lazy"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Featured Badge */}
            {article.featured && (
              <motion.div
                className="absolute top-4 left-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="bg-gradient-to-r from-accent to-accent-glow text-accent-foreground font-bold shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </motion.div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                onClick={handleFlip}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  📄
                </motion.div>
              </motion.button>
              <motion.button
                onClick={handleShare}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-3 h-3" />
              </motion.button>
            </div>

            {/* Category Badge */}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="backdrop-blur-sm bg-white/20 text-white border-white/30">
                {article.category}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <motion.h3
              className={`font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 ${
                featured ? 'text-xl' : 'text-lg'
              }`}
              layoutId={`title-${article.id}`}
            >
              {article.title}
            </motion.h3>

            {/* Summary */}
            <p className="text-muted-foreground text-sm line-clamp-3">
              {article.summary}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime} min</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{article.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  <span>{article.shares}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-glow">
                Read More →
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Back of Card */}
        <motion.div
          className={`backface-hidden absolute inset-0 rotate-y-180 glassmorphism rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-primary-glow/5 border border-primary/20 ${
            featured ? 'min-h-[400px]' : 'min-h-[350px]'
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-lg text-primary">Quick Preview</h4>
              <Button
                onClick={handleFlip}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h5 className="font-semibold text-sm text-foreground mb-2">Summary</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-sm text-foreground mb-2">Key Topics</h5>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Published</span>
                  <p className="font-medium">{new Date(article.publishDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Read Time</span>
                  <p className="font-medium">{article.readTime} minutes</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Views</span>
                  <p className="font-medium">{article.views.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Engagement</span>
                  <p className="font-medium">{article.likes + article.shares}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <Button 
                onClick={handleCardClick} 
                className="w-full btn-hero"
              >
                Read Full Article
              </Button>
              <Button 
                onClick={handleShare} 
                variant="outline" 
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};