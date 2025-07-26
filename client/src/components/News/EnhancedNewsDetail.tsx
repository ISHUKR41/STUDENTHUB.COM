import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  BookmarkPlus,
  Tag,
  User,
  MessageCircle,
  TrendingUp,
  ExternalLink,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { NewsArticle, newsAPI } from '@/lib/newsData';

export const EnhancedNewsDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (slug) {
      loadArticle();
      // Increment view count
      incrementViewCount();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      const mockArticle: NewsArticle = {
        id: '1',
        title: 'Revolutionary AI Technology Transforms Student Learning Experience',
        slug: slug || '',
        summary: 'New artificial intelligence tools are revolutionizing how students learn and interact with educational content.',
        fullContent: `
          <h2>The Future of Student Learning</h2>
          <p>Artificial Intelligence is rapidly transforming the educational landscape, offering unprecedented opportunities for personalized learning experiences. Students across the globe are now benefiting from AI-powered tools that adapt to their individual learning styles and pace.</p>
          
          <h3>Key Benefits of AI in Education</h3>
          <ul>
            <li><strong>Personalized Learning Paths:</strong> AI algorithms analyze student performance and create customized learning experiences.</li>
            <li><strong>Instant Feedback:</strong> Students receive immediate feedback on their work, helping them improve faster.</li>
            <li><strong>24/7 Availability:</strong> AI tutors are available round the clock to assist students with their queries.</li>
            <li><strong>Adaptive Assessment:</strong> Tests and quizzes adjust difficulty based on student performance.</li>
          </ul>
          
          <h3>Real-World Applications</h3>
          <p>Several educational institutions have already implemented AI-powered solutions:</p>
          <blockquote>
            "The implementation of AI tutoring systems has increased student engagement by 40% and improved test scores by an average of 25%." - Dr. Sarah Johnson, Education Technology Researcher
          </blockquote>
          
          <h3>Challenges and Considerations</h3>
          <p>While AI offers numerous benefits, there are important considerations:</p>
          <ul>
            <li>Data privacy and security concerns</li>
            <li>The need for digital literacy among educators</li>
            <li>Ensuring AI tools complement rather than replace human instruction</li>
          </ul>
          
          <h3>Looking Ahead</h3>
          <p>As AI technology continues to evolve, we can expect even more innovative applications in education. The key is to implement these tools thoughtfully, ensuring they enhance the learning experience while maintaining the human element that is so crucial to education.</p>
        `,
        category: 'Technology',
        tags: ['AI', 'Education', 'Technology', 'Learning', 'Innovation', 'Students', 'Future', 'Digital'],
        author: 'Dr. Alex Kumar',
        publishDate: new Date().toISOString(),
        readTime: 8,
        views: 1247,
        likes: 89,
        shares: 34,
        imageUrl: '/placeholder.svg',
        featured: true,
        status: 'PUBLISHED',
        priority: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setArticle(mockArticle);
      
      // Load related articles
      const related = await newsAPI.getAllNews();
      setRelatedArticles(related.slice(0, 3));
    } catch (error) {
      toast({ title: "Error", description: "Failed to load article", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    // API call to increment view count
    if (article) {
      setArticle(prev => prev ? { ...prev, views: prev.views + 1 } : null);
    }
  };

  const handleLike = async () => {
    if (!article) return;
    
    try {
      const newLikeStatus = !liked;
      setLiked(newLikeStatus);
      
      // Update like count
      const newLikeCount = newLikeStatus ? article.likes + 1 : article.likes - 1;
      setArticle(prev => prev ? { ...prev, likes: newLikeCount } : null);
      
      toast({ 
        title: newLikeStatus ? "Liked!" : "Like removed", 
        description: newLikeStatus ? "Article added to your liked posts" : "Article removed from liked posts"
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update like", variant: "destructive" });
    }
  };

  const handleShare = async (platform?: string) => {
    if (!article) return;

    const url = window.location.href;
    const text = `Check out this article: ${article.title}`;

    if (platform) {
      let shareUrl = '';
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
          break;
      }
      window.open(shareUrl, '_blank');
    } else {
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Article link copied to clipboard" });
    }

    // Update share count
    setArticle(prev => prev ? { ...prev, shares: prev.shares + 1 } : null);
    setShowShareMenu(false);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({ 
      title: bookmarked ? "Bookmark removed" : "Bookmarked!", 
      description: bookmarked ? "Article removed from bookmarks" : "Article saved to bookmarks"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article not found</h1>
          <Link to="/news">
            <Button>Back to News</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-96 lg:h-[500px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="container mx-auto px-4 lg:px-6 pb-12">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/news">
                <Button variant="ghost" className="mb-6 text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to News
                </Button>
              </Link>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  {article.category}
                </Badge>
                {article.featured && (
                  <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                    Featured
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              
              <p className="text-lg text-white/90 mb-6 max-w-3xl">
                {article.summary}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="p-8">
              {/* Article Actions */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`${liked ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                    {article.likes}
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="text-muted-foreground"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      {article.shares}
                    </Button>
                    
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute top-full mt-2 right-0 bg-background border border-border rounded-lg p-2 shadow-lg z-50"
                        >
                          <div className="flex flex-col gap-1 min-w-[140px]">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare('facebook')}
                              className="justify-start"
                            >
                              <Facebook className="w-4 h-4 mr-2" />
                              Facebook
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare('twitter')}
                              className="justify-start"
                            >
                              <Twitter className="w-4 h-4 mr-2" />
                              Twitter
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare('linkedin')}
                              className="justify-start"
                            >
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare('whatsapp')}
                              className="justify-start"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              WhatsApp
                            </Button>
                            <Separator className="my-1" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare()}
                              className="justify-start"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`${bookmarked ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <BookmarkPlus className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Article Body */}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: article.fullContent }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge variant="outline" className="hover:bg-primary/10">
                        #{tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Related Articles */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Link to={`/news/${related.slug}`} className="block group">
                      <div className="flex gap-3">
                        <img
                          src={related.imageUrl}
                          alt={related.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {related.readTime} min read
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};