import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlayCircle, TrendingUp, Clock, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '@/lib/newsData';

interface NewsHero3DProps {
  articles: NewsArticle[];
}

export const NewsHero3D = ({ articles }: NewsHero3DProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto-advance slides
  useEffect(() => {
    if (isAutoPlaying && articles.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, articles.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentArticle = articles[currentIndex];

  if (!currentArticle) return null;

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background-secondary to-primary/5"
      style={{ y, opacity }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-32 h-32 rounded-full blur-3xl ${
              i % 3 === 0 ? 'bg-primary/20' : 
              i % 3 === 1 ? 'bg-secondary/20' : 'bg-accent/20'
            }`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Content Side */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Category & Meta */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-bold px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                BREAKING NEWS
              </Badge>
              <Badge variant="outline" className="text-sm">
                {currentArticle.category}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(currentArticle.publishDate).toLocaleDateString()}
              </div>
            </div>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentIndex}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
              >
                <span className="gradient-text">
                  {currentArticle.title}
                </span>
              </motion.h1>
            </AnimatePresence>

            {/* Summary */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`summary-${currentIndex}`}
                className="text-xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {currentArticle.summary}
              </motion.p>
            </AnimatePresence>

            {/* Stats */}
            <motion.div
              className="flex items-center gap-6 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{currentArticle.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{currentArticle.readTime} min read</span>
              </div>
              <div className="text-muted-foreground">
                By {currentArticle.author}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                onClick={() => navigate(`/news/${currentArticle.slug}`)}
                className="btn-hero text-lg px-8 py-4"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Read Full Story
              </Button>
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 px-6 py-4"
              >
                Share Story
              </Button>
            </motion.div>

            {/* Article Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full hover:bg-primary/10"
                  disabled={articles.length <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full hover:bg-primary/10"
                  disabled={articles.length <= 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Slide Indicators */}
              <div className="flex items-center gap-2">
                {articles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-primary w-8'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              {/* Auto-play Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`text-xs ${isAutoPlaying ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {isAutoPlaying ? 'Auto ⏸' : 'Auto ▶️'}
              </Button>
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* 3D Card Container */}
              <div className="perspective-1000">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    className="preserve-3d glassmorphism rounded-3xl overflow-hidden shadow-glow"
                    initial={{ 
                      opacity: 0, 
                      rotateY: 90,
                      scale: 0.8 
                    }}
                    animate={{ 
                      opacity: 1, 
                      rotateY: 0,
                      scale: 1 
                    }}
                    exit={{ 
                      opacity: 0, 
                      rotateY: -90,
                      scale: 0.8 
                    }}
                    transition={{ 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{
                      rotateY: 5,
                      rotateX: 5,
                      scale: 1.05,
                    }}
                  >
                    {/* Card Image */}
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={currentArticle.imageUrl}
                        alt={currentArticle.title}
                        className="w-full h-80 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Floating Elements */}
                      <motion.div
                        className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full p-3"
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1] 
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <TrendingUp className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>

                    {/* Card Content */}
                    <div className="p-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {currentArticle.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {currentArticle.readTime} min read
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold line-clamp-2">
                        {currentArticle.title}
                      </h3>
                      
                      <p className="text-muted-foreground line-clamp-3">
                        {currentArticle.summary}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">
                          {currentArticle.author}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{currentArticle.views.toLocaleString()} views</span>
                          <span>{currentArticle.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Background Decoration */}
              <div className="absolute -inset-10 -z-10">
                <motion.div
                  className="w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {articles.length > 1 && (
              <motion.div
                className="mt-8 flex gap-4 overflow-x-auto pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {articles.map((article, index) => (
                  <motion.button
                    key={article.id}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-primary shadow-glow scale-110'
                        : 'border-border/30 hover:border-primary/50'
                    }`}
                    whileHover={{ scale: index === currentIndex ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2" />
        </div>
      </motion.div>
    </motion.section>
  );
};