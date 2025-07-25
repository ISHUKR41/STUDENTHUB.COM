import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/StudentHub/Header';
import { ToolModal } from '@/components/Tools/ToolModal';
import LazyThreeScene from './LazyThreeScene';
import LazyToolCard from './LazyToolCard';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { 
  Search, 
  Filter,
  FileText,
  Image,
  Wrench,
  Star,
  Sparkles,
  ArrowRight,
  Download,
  Upload,
  Scissors,
  Combine,
  RotateCcw,
  Edit,
  FileSignature,
  FileImage,
  FileOutput,
  Crop,
  Type,
  ClipboardCheck,
  Zap,
  Home,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Mouse,
  Play,
  Pause,
  Settings,
  Heart,
  Globe,
  Palette,
  Lock,
  Unlock,
  Eye,
  FileX,
  Copy,
  RefreshCw,
  Shield,
  Users,
  ArrowUp
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const OptimizedToolsPage = memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedTool, setSelectedTool] = useState<{ id: string; title: string } | null>(null);
  const { toast } = useToast();

  const { targetRef: heroRef, isIntersecting: isHeroVisible } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  const { targetRef: toolsRef, isIntersecting: areToolsVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > window.innerHeight * 0.5);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized tools data
  const tools = useMemo(() => [
    // PDF Tools
    { id: 'merge-pdf', title: 'Merge PDFs', description: 'Combine multiple PDF files into one document', category: 'PDF Tools', icon: Combine, isPopular: true },
    { id: 'split-pdf', title: 'Split PDF', description: 'Split PDF into multiple files or extract pages', category: 'PDF Tools', icon: Scissors },
    { id: 'compress-pdf', title: 'Compress PDF', description: 'Reduce PDF file size while maintaining quality', category: 'PDF Tools', icon: Download },
    { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDF documents to editable Word files', category: 'PDF Tools', icon: FileText, isNew: true },
    { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert Word documents to PDF format', category: 'PDF Tools', icon: FileOutput },
    { id: 'pdf-to-ppt', title: 'PDF to PowerPoint', description: 'Convert PDF to PowerPoint presentations', category: 'PDF Tools', icon: FileSignature },
    { id: 'protect-pdf', title: 'Protect PDF', description: 'Add password protection to PDF files', category: 'PDF Tools', icon: Lock },
    { id: 'unlock-pdf', title: 'Unlock PDF', description: 'Remove password protection from PDF files', category: 'PDF Tools', icon: Unlock },
    { id: 'rotate-pdf', title: 'Rotate PDF', description: 'Rotate PDF pages to correct orientation', category: 'PDF Tools', icon: RotateCcw },
    { id: 'sign-pdf', title: 'Sign PDF', description: 'Add digital signatures to PDF documents', category: 'PDF Tools', icon: Edit },

    // Image Tools
    { id: 'compress-image', title: 'Compress Image', description: 'Reduce image file size without losing quality', category: 'Image Tools', icon: Image, isPopular: true },
    { id: 'resize-image', title: 'Resize Image', description: 'Change image dimensions and resolution', category: 'Image Tools', icon: Crop },
    { id: 'convert-image', title: 'Convert Image', description: 'Convert between different image formats', category: 'Image Tools', icon: RefreshCw },
    { id: 'remove-bg', title: 'Remove Background', description: 'Remove background from images automatically', category: 'Image Tools', icon: Eye, isPro: true },
    { id: 'image-editor', title: 'Image Editor', description: 'Edit images with filters and effects', category: 'Image Tools', icon: Palette },
    { id: 'pdf-to-image', title: 'PDF to Image', description: 'Convert PDF pages to image files', category: 'Image Tools', icon: FileImage },

    // AI & Text Tools  
    { id: 'grammar-checker', title: 'Grammar Checker', description: 'Check and fix grammar errors in your text', category: 'AI Tools', icon: ClipboardCheck, isNew: true },
    { id: 'text-summarizer', title: 'Text Summarizer', description: 'Summarize long text into key points', category: 'AI Tools', icon: FileText, isPro: true },
    { id: 'quick-notepad', title: 'Quick Notepad', description: 'Fast note-taking with auto-save', category: 'Text Tools', icon: Type },
    { id: 'voice-notes', title: 'Voice to Notes', description: 'Convert speech to text notes', category: 'AI Tools', icon: MessageSquare, isNew: true },
    { id: 'study-planner', title: 'AI Study Planner', description: 'Create personalized study schedules', category: 'AI Tools', icon: BookOpen, isPro: true },
    { id: 'flashcards', title: 'Smart Flashcards', description: 'Generate flashcards from your notes', category: 'AI Tools', icon: Sparkles },
    { id: 'formula-solver', title: 'Formula Solver', description: 'Solve mathematical equations step by step', category: 'AI Tools', icon: Zap, isPro: true },
    { id: 'screenshot-ocr', title: 'Screenshot OCR', description: 'Extract text from screenshots', category: 'AI Tools', icon: Copy },

    // File Converters
    { id: 'file-converter', title: 'Universal File Converter', description: 'Convert between various file formats', category: 'Converters', icon: RefreshCw },
    { id: 'text-to-pdf', title: 'Text to PDF', description: 'Convert plain text to PDF documents', category: 'Converters', icon: FileOutput },
  ], []);

  const filters = useMemo(() => [
    { id: 'all', name: 'All Tools', count: tools.length },
    { id: 'pdf-tools', name: 'PDF Tools', count: tools.filter(t => t.category === 'PDF Tools').length },
    { id: 'image-tools', name: 'Image Tools', count: tools.filter(t => t.category === 'Image Tools').length },
    { id: 'ai-tools', name: 'AI Tools', count: tools.filter(t => t.category === 'AI Tools').length },
    { id: 'text-tools', name: 'Text Tools', count: tools.filter(t => t.category === 'Text Tools').length },
    { id: 'converters', name: 'Converters', count: tools.filter(t => t.category === 'Converters').length },
  ], [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || 
                           tool.category.toLowerCase().replace(' ', '-') === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [tools, searchQuery, activeFilter]);

  const handleToolSelect = useCallback((tool: { id: string; title: string }) => {
    setSelectedTool(tool);
  }, []);

  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilter(filterId);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Lazy-loaded 3D Background */}
      <LazyThreeScene 
        isVisible={isHeroVisible} 
        onAnimationToggle={setIsAnimationPlaying}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
            AI-Powered Tools Suite
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your workflow with 30+ powerful tools for PDF manipulation, image processing, AI assistance, and file conversion.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="px-4 py-2 bg-primary/10 text-primary">30+ Tools</Badge>
            <Badge className="px-4 py-2 bg-secondary/10 text-secondary">AI-Powered</Badge>
            <Badge className="px-4 py-2 bg-accent/10 text-accent">Free to Use</Badge>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filter.id)}
                  className="transition-all duration-200"
                >
                  {filter.name} ({filter.count})
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section ref={toolsRef} className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {areToolsVisible && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <LazyToolCard
                  key={tool.id}
                  id={tool.id}
                  title={tool.title}
                  description={tool.description}
                  category={tool.category}
                  icon={tool.icon}
                  isPro={tool.isPro}
                  isNew={tool.isNew}
                  isPopular={tool.isPopular}
                  onToolSelect={handleToolSelect}
                />
              ))}
            </div>
          )}
          
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No tools found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 transform-gpu will-change-transform"
          size="icon"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal
          toolId={selectedTool.id}
          toolTitle={selectedTool.title}
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
});

OptimizedToolsPage.displayName = 'OptimizedToolsPage';

export default OptimizedToolsPage;