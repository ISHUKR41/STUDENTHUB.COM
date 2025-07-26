import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Eye, Bookmark, MessageCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface NewsInteractionsProps {
  articleId: string;
  initialViews: number;
  initialLikes: number;
  initialShares: number;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface InteractionData {
  views: number;
  likes: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export const NewsInteractions = ({
  articleId,
  initialViews,
  initialLikes,
  initialShares,
  className = "",
  showLabels = false,
  size = 'md'
}: NewsInteractionsProps) => {
  const [interactions, setInteractions] = useState<InteractionData>({
    views: initialViews,
    likes: initialLikes,
    shares: initialShares,
    isLiked: false,
    isBookmarked: false
  });
  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  const { toast } = useToast();

  // Load user interactions from localStorage
  useEffect(() => {
    const userInteractions = localStorage.getItem(`interactions-${articleId}`);
    if (userInteractions) {
      try {
        const parsed = JSON.parse(userInteractions);
        setInteractions(prev => ({
          ...prev,
          isLiked: parsed.isLiked || false,
          isBookmarked: parsed.isBookmarked || false
        }));
      } catch (error) {
        console.error('Failed to load user interactions:', error);
      }
    }
  }, [articleId]);

  // Save user interactions to localStorage
  const saveUserInteractions = (data: Partial<InteractionData>) => {
    const current = localStorage.getItem(`interactions-${articleId}`);
    const updated = {
      ...(current ? JSON.parse(current) : {}),
      ...data
    };
    localStorage.setItem(`interactions-${articleId}`, JSON.stringify(updated));
  };

  // Update article data in database (mock implementation)
  const updateArticleData = async (field: 'views' | 'likes' | 'shares', increment: number) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/news/${articleId}/interactions`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ field, increment })
      // });
      
      // For now, just store in localStorage
      const key = `article-data-${articleId}`;
      const current = localStorage.getItem(key);
      const data = current ? JSON.parse(current) : { views: initialViews, likes: initialLikes, shares: initialShares };
      data[field] += increment;
      localStorage.setItem(key, JSON.stringify(data));
      
      return data[field];
    } catch (error) {
      console.error('Failed to update article data:', error);
      throw error;
    }
  };

  const handleLike = async () => {
    if (isAnimating === 'like') return;
    
    setIsAnimating('like');
    
    try {
      const newLikedState = !interactions.isLiked;
      const increment = newLikedState ? 1 : -1;
      
      // Update local state immediately for responsiveness
      setInteractions(prev => ({
        ...prev,
        isLiked: newLikedState,
        likes: Math.max(0, prev.likes + increment)
      }));
      
      // Save user interaction
      saveUserInteractions({ isLiked: newLikedState });
      
      // Update in database
      await updateArticleData('likes', increment);
      
      if (newLikedState) {
        toast({
          title: "Article liked!",
          description: "Thank you for your feedback",
        });
      }
    } catch (error) {
      // Revert on error
      setInteractions(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1)
      }));
      
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsAnimating(null), 300);
    }
  };

  const handleShare = async () => {
    if (isAnimating === 'share') return;
    
    setIsAnimating('share');
    
    try {
      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this news article',
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Article link has been copied to clipboard",
        });
      }
      
      // Update share count
      setInteractions(prev => ({
        ...prev,
        shares: prev.shares + 1
      }));
      
      await updateArticleData('shares', 1);
      
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Share failed",
          description: "Unable to share. Please try copying the URL manually.",
          variant: "destructive"
        });
      }
    } finally {
      setTimeout(() => setIsAnimating(null), 300);
    }
  };

  const handleBookmark = () => {
    if (isAnimating === 'bookmark') return;
    
    setIsAnimating('bookmark');
    
    const newBookmarkedState = !interactions.isBookmarked;
    
    setInteractions(prev => ({
      ...prev,
      isBookmarked: newBookmarkedState
    }));
    
    saveUserInteractions({ isBookmarked: newBookmarkedState });
    
    toast({
      title: newBookmarkedState ? "Article bookmarked!" : "Bookmark removed",
      description: newBookmarkedState 
        ? "You can find this article in your bookmarks" 
        : "Article removed from bookmarks",
    });
    
    setTimeout(() => setIsAnimating(null), 300);
  };

  // Track view when component mounts
  useEffect(() => {
    const hasViewed = sessionStorage.getItem(`viewed-${articleId}`);
    if (!hasViewed) {
      setInteractions(prev => ({
        ...prev,
        views: prev.views + 1
      }));
      
      updateArticleData('views', 1);
      sessionStorage.setItem(`viewed-${articleId}`, 'true');
    }
  }, [articleId]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Views */}
      <div className="flex items-center gap-1 text-muted-foreground">
        <Eye className={iconSizes[size]} />
        <span className={sizeClasses[size]}>
          {interactions.views.toLocaleString()}
          {showLabels && <span className="ml-1 hidden sm:inline">views</span>}
        </span>
      </div>

      {/* Like Button */}
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isAnimating === 'like'}
          className={`relative p-1 h-auto ${interactions.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
        >
          <motion.div
            animate={{
              scale: isAnimating === 'like' ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Heart 
              className={`${iconSizes[size]} ${interactions.isLiked ? 'fill-current' : ''}`} 
            />
          </motion.div>
          
          <span className={`ml-1 ${sizeClasses[size]}`}>
            {interactions.likes}
            {showLabels && <span className="ml-1 hidden sm:inline">likes</span>}
          </span>

          {/* Like animation particles */}
          <AnimatePresence>
            {isAnimating === 'like' && interactions.isLiked && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-red-500 rounded-full"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      scale: 0,
                      opacity: 1
                    }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 40,
                      y: (Math.random() - 0.5) * 40,
                      scale: 1,
                      opacity: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.6,
                      delay: i * 0.1 
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Share Button */}
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          disabled={isAnimating === 'share'}
          className="p-1 h-auto text-muted-foreground hover:text-blue-500"
        >
          <motion.div
            animate={{
              rotate: isAnimating === 'share' ? [0, 15, -15, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Share2 className={iconSizes[size]} />
          </motion.div>
          
          <span className={`ml-1 ${sizeClasses[size]}`}>
            {interactions.shares}
            {showLabels && <span className="ml-1 hidden sm:inline">shares</span>}
          </span>
        </Button>
      </motion.div>

      {/* Bookmark Button */}
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          disabled={isAnimating === 'bookmark'}
          className={`p-1 h-auto ${interactions.isBookmarked ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
        >
          <motion.div
            animate={{
              scale: isAnimating === 'bookmark' ? [1, 1.2, 1] : 1,
              rotate: isAnimating === 'bookmark' ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Bookmark 
              className={`${iconSizes[size]} ${interactions.isBookmarked ? 'fill-current' : ''}`} 
            />
          </motion.div>
        </Button>
      </motion.div>

      {/* Trending indicator for high engagement */}
      {interactions.likes > 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1 text-green-500"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <TrendingUp className="w-3 h-3" />
          </motion.div>
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            Trending
          </Badge>
        </motion.div>
      )}
    </div>
  );
};