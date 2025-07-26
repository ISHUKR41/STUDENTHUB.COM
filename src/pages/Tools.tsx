import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/StudentHub/Header';
import { ToolModal } from '@/components/Tools/ToolModal';
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
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/ui/page-transition';

const Tools = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<{ id: string; title: string } | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 3D Scene Setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    sceneRef.current = scene;

    // Create floating tool icons
    const createToolIcon = (type: string, position: THREE.Vector3, color: number) => {
      let geometry;
      
      switch(type) {
        case 'pdf':
          geometry = new THREE.BoxGeometry(0.08, 0.12, 0.02);
          break;
        case 'image':
          geometry = new THREE.PlaneGeometry(0.1, 0.08);
          break;
        case 'tools':
          geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8);
          break;
        default:
          geometry = new THREE.SphereGeometry(0.05, 16, 16);
      }
      
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      return mesh;
    };

    const toolIcons: THREE.Mesh[] = [];
    const toolTypes = ['pdf', 'image', 'tools', 'star'];
    const colors = [0x3B82F6, 0x10B981, 0xF59E0B, 0xEF4444, 0x8B5CF6];

    for (let i = 0; i < 60; i++) {
      const type = toolTypes[i % toolTypes.length];
      const color = colors[i % colors.length];
      const position = new THREE.Vector3(
        Math.random() * 25 - 12.5,
        Math.random() * 20 - 10,
        Math.random() * 15 - 7.5
      );
      
      const icon = createToolIcon(type, position, color);
      scene.add(icon);
      toolIcons.push(icon);
    }

    camera.position.z = 12;

    const animate = () => {
      if (!isAnimationPlaying) return;
      
      toolIcons.forEach((icon, index) => {
        icon.rotation.x += 0.008;
        icon.rotation.y += 0.008;
        icon.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        icon.position.x += Math.cos(Date.now() * 0.0008 + index) * 0.001;
      });

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight * 0.5);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      camera.position.x += (x * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (y * 0.3 - camera.position.y) * 0.02;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isAnimationPlaying]);

  // Featured Tools Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex(prev => (prev + 1) % featuredTools.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAnimation = () => {
    setIsAnimationPlaying(!isAnimationPlaying);
    if (!isAnimationPlaying && sceneRef.current) {
      const animate = () => {
        if (!isAnimationPlaying) return;
        animationIdRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
  };

  // Tool Categories and Data
  const toolCategories = [
    { id: 'all', label: 'All Tools', icon: <Wrench className="w-4 h-4" />, count: 30 },
    { id: 'pdf', label: 'PDF Tools', icon: <FileText className="w-4 h-4" />, count: 18 },
    { id: 'image', label: 'Image Tools', icon: <Image className="w-4 h-4" />, count: 8 },
    { id: 'text', label: 'Text & File', icon: <Type className="w-4 h-4" />, count: 6 },
    { id: 'new', label: 'New & Popular', icon: <Sparkles className="w-4 h-4" />, count: 4 }
  ];

  const pdfTools = [
    { id: 'merge-pdf', title: 'Merge PDF', description: 'Combine multiple PDFs into one file', icon: <Combine className="w-6 h-6" />, popular: true },
    { id: 'split-pdf', title: 'Split PDF', description: 'Extract pages or split into multiple files', icon: <Scissors className="w-6 h-6" />, popular: true },
    { id: 'compress-pdf', title: 'Compress PDF', description: 'Reduce file size without quality loss', icon: <Settings className="w-6 h-6" />, popular: true },
    { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDF to editable Word document', icon: <FileOutput className="w-6 h-6" />, popular: false },
    { id: 'pdf-to-ppt', title: 'PDF to PowerPoint', description: 'Transform PDF into presentation slides', icon: <FileOutput className="w-6 h-6" />, popular: false },
    { id: 'pdf-to-excel', title: 'PDF to Excel', description: 'Extract tables to Excel spreadsheet', icon: <FileOutput className="w-6 h-6" />, popular: false },
    { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert Word documents to PDF format', icon: <FileText className="w-6 h-6" />, popular: true },
    { id: 'ppt-to-pdf', title: 'PowerPoint to PDF', description: 'Convert presentations to PDF', icon: <FileText className="w-6 h-6" />, popular: false },
    { id: 'excel-to-pdf', title: 'Excel to PDF', description: 'Convert spreadsheets to PDF', icon: <FileText className="w-6 h-6" />, popular: false },
    { id: 'edit-pdf', title: 'Edit PDF', description: 'Modify text and images in PDF files', icon: <Edit className="w-6 h-6" />, popular: true },
    { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Convert PDF pages to image files', icon: <FileImage className="w-6 h-6" />, popular: false },
    { id: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert images to PDF documents', icon: <FileText className="w-6 h-6" />, popular: true },
    { id: 'sign-pdf', title: 'Sign PDF', description: 'Add digital signatures to documents', icon: <FileSignature className="w-6 h-6" />, popular: false },
    { id: 'watermark-pdf', title: 'Watermark PDF', description: 'Add watermarks for document protection', icon: <Shield className="w-6 h-6" />, popular: false },
    { id: 'rotate-pdf', title: 'Rotate PDF', description: 'Rotate pages to correct orientation', icon: <RotateCcw className="w-6 h-6" />, popular: false },
    { id: 'unlock-pdf', title: 'Unlock PDF', description: 'Remove passwords from PDF files', icon: <Unlock className="w-6 h-6" />, popular: false },
    { id: 'protect-pdf', title: 'Protect PDF', description: 'Add password protection to PDFs', icon: <Lock className="w-6 h-6" />, popular: false },
    { id: 'ocr-pdf', title: 'OCR PDF', description: 'Extract text from scanned documents', icon: <Eye className="w-6 h-6" />, popular: true }
  ];

  const imageTools = [
    { id: 'resize-image', title: 'Resize Image', description: 'Change image dimensions and size', icon: <Settings className="w-6 h-6" />, popular: true },
    { id: 'crop-image', title: 'Crop Image', description: 'Remove unwanted parts of images', icon: <Crop className="w-6 h-6" />, popular: true },
    { id: 'compress-image', title: 'Compress Image', description: 'Reduce image file size efficiently', icon: <Settings className="w-6 h-6" />, popular: true },
    { id: 'convert-image', title: 'Convert Image', description: 'Change format: JPG, PNG, WebP, AVIF', icon: <RefreshCw className="w-6 h-6" />, popular: false },
    { id: 'pdf-to-image', title: 'PDF ↔ Image', description: 'Convert between PDF and image formats', icon: <FileImage className="w-6 h-6" />, popular: false },
    { id: 'screenshot-ocr', title: 'Screenshot OCR', description: 'Extract text from screenshots', icon: <Eye className="w-6 h-6" />, popular: true },
    { id: 'image-editor', title: 'Image Editor', description: 'Edit images with filters and effects', icon: <Palette className="w-6 h-6" />, popular: false },
    { id: 'background-remover', title: 'Background Remover', description: 'Remove or replace image backgrounds', icon: <FileX className="w-6 h-6" />, popular: true }
  ];

  const textFileTools = [
    { id: 'text-to-pdf', title: 'Text to PDF', description: 'Convert plain text to PDF documents', icon: <FileText className="w-6 h-6" />, popular: false },
    { id: 'notepad', title: 'Quick Notepad', description: 'Write and save notes instantly', icon: <Edit className="w-6 h-6" />, popular: true },
    { id: 'text-summary', title: 'Text Summarizer', description: 'Generate concise summaries of long text', icon: <ClipboardCheck className="w-6 h-6" />, popular: true },
    { id: 'grammar-checker', title: 'Grammar Checker', description: 'Check and fix grammar mistakes', icon: <ClipboardCheck className="w-6 h-6" />, popular: false },
    { id: 'file-converter', title: 'File Converter', description: 'Convert between various file formats', icon: <RefreshCw className="w-6 h-6" />, popular: false },
    { id: 'zip-extractor', title: 'ZIP Extractor', description: 'Extract files from compressed archives', icon: <FileX className="w-6 h-6" />, popular: true }
  ];

  const newAdvancedTools = [
    { id: 'ai-study-planner', title: 'AI Study Planner', description: 'Create personalized study schedules', icon: <Zap className="w-6 h-6" />, popular: true, new: true },
    { id: 'smart-flashcards', title: 'Smart Flashcards', description: 'AI-powered memory enhancement', icon: <Sparkles className="w-6 h-6" />, popular: true, new: true },
    { id: 'voice-notes', title: 'Voice to Notes', description: 'Convert speech to organized notes', icon: <Users className="w-6 h-6" />, popular: false, new: true },
    { id: 'formula-solver', title: 'Formula Solver', description: 'Solve complex mathematical equations', icon: <Zap className="w-6 h-6" />, popular: true, new: true }
  ];

  const featuredTools = [
    { ...pdfTools[0], category: 'PDF' },
    { ...imageTools[0], category: 'Image' },
    { ...textFileTools[1], category: 'Text' },
    { ...newAdvancedTools[0], category: 'AI' }
  ];

  const getAllTools = () => {
    const allTools = [
      ...pdfTools.map(tool => ({ ...tool, category: 'pdf' as const })),
      ...imageTools.map(tool => ({ ...tool, category: 'image' as const })),
      ...textFileTools.map(tool => ({ ...tool, category: 'text' as const })),
      ...newAdvancedTools.map(tool => ({ ...tool, category: 'new' as const, new: true }))
    ];

    let filtered = allTools;

    if (activeFilter !== 'all') {
      filtered = allTools.filter(tool => tool.category === activeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(tool => 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleToolClick = (toolId: string, toolTitle: string) => {
    setSelectedTool({ id: toolId, title: toolTitle });
  };

  const closeToolModal = () => {
    setSelectedTool(null);
  };

  const handleRequestTool = () => {
    toast({
      title: "Tool Request Submitted! 📝",
      description: "We'll consider adding your requested tool in our next update."
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header Navigation */}
      <Header />
      
      {/* 3D Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 -z-10"
        style={{ pointerEvents: 'none' }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center space-y-8 animate-fadeInUp max-w-5xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              All-In-One Tool Hub
            </h1>
            <p className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
              Edit, convert, organize, sign, or extract files. Everything you need, all in one place.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary animate-bounce flex items-center justify-center">
                <Wrench className="w-8 h-8 mr-2" />
                30+
              </div>
              <div className="text-sm text-foreground-secondary">Professional Tools</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary animate-bounce" style={{animationDelay: '0.1s'}}>
                <span className="flex items-center justify-center">
                  <Zap className="w-8 h-8 mr-2" />
                  100%
                </span>
              </div>
              <div className="text-sm text-foreground-secondary">Free to Use</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary animate-bounce" style={{animationDelay: '0.2s'}}>
                <span className="flex items-center justify-center">
                  <Globe className="w-8 h-8 mr-2" />
                  24/7
                </span>
              </div>
              <div className="text-sm text-foreground-secondary">Available</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button 
              size="lg"
              className="btn-hero group"
              onClick={() => document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Using Tools Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={toggleAnimation}
              className="group"
            >
              {isAnimationPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isAnimationPlaying ? 'Pause' : 'Play'} 3D Animation
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">Find Your Perfect Tool</h2>
            <p className="text-foreground-secondary max-w-2xl mx-auto">
              Search through our collection or filter by category to find exactly what you need
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary w-5 h-5" />
            <Input
              placeholder="Find your tool... (e.g., merge PDF, resize image)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg rounded-xl glass border-2 border-border/20 focus:border-primary/50 transition-all duration-300"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {toolCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeFilter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(category.id)}
                className={`group transition-all duration-300 ${
                  activeFilter === category.id 
                    ? 'shadow-glow scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.label}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {searchQuery && (
            <div className="text-center">
              <p className="text-foreground-secondary">
                Found <span className="font-bold text-primary">{getAllTools().length}</span> tools matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Tools Carousel */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">Featured & Most Popular</h2>
            <p className="text-foreground-secondary max-w-2xl mx-auto">
              Our top-rated tools that students love the most
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
            >
              {featuredTools.map((tool, index) => (
                <div key={tool.id} className="w-full flex-shrink-0 px-4">
                  <Card 
                    className="group cursor-pointer perspective-1000 h-64 hover:shadow-glow transition-all duration-500"
                onClick={() => handleToolClick(tool.id, tool.title)}
                  >
                    <div className="relative w-full h-full preserve-3d group-hover:rotate-y-12 transition-transform duration-700">
                      <CardContent className="absolute inset-0 flex items-center justify-center backface-hidden p-8">
                        <div className="text-center space-y-6">
                          <div className="text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300 mx-auto flex justify-center">
                            {tool.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {tool.title}
                            </h3>
                            <p className="text-foreground-secondary mb-4">{tool.description}</p>
                            <Badge variant="secondary" className="text-xs">
                              {tool.category} Tool
                            </Badge>
                          </div>
                          <Button 
                            variant="outline"
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                          >
                            Try Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {featuredTools.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentCarouselIndex === index ? 'bg-primary scale-125' : 'bg-muted hover:bg-primary/50'
                  }`}
                  onClick={() => setCurrentCarouselIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools-grid" className="py-20 px-4 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              {activeFilter === 'all' ? 'All Tools' : toolCategories.find(c => c.id === activeFilter)?.label}
            </h2>
            <p className="text-foreground-secondary max-w-2xl mx-auto">
              Professional-grade tools designed specifically for students and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getAllTools().map((tool, index) => (
              <Card 
                key={tool.id}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow card-feature ${
                  hoveredTool === tool.id ? 'shadow-glow scale-105' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                onClick={() => handleToolClick(tool.id, tool.title)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300">
                      {tool.icon}
                    </div>
                    <div className="flex space-x-1">
                      {tool.popular && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {'new' in tool && tool.new && (
                        <Badge className="text-xs bg-accent text-accent-foreground">
                          <Sparkles className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-secondary text-sm mb-4 group-hover:text-foreground transition-colors">
                    {tool.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Use Tool
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {getAllTools().length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No tools found</h3>
              <p className="text-foreground-secondary mb-6">
                Try adjusting your search or filter to find what you're looking for
              </p>
              <Button onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>
                Show All Tools
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Request New Tool Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-intense text-center p-8 shadow-glow animate-pulse-glow">
            <CardContent className="space-y-6">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                Can't find what you need?
              </h2>
              <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
                Request a new tool and we'll try to build it for our community! We're always adding new features based on student feedback.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg"
                  className="btn-hero group"
                  onClick={handleRequestTool}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Request a Tool
                  <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <Link to="/contact">
                    Contact Support
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Secondary CTA & Footer Links */}
      <section className="py-20 px-4 bg-background-secondary border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold gradient-text">Explore More StudentHub</h3>
              <p className="text-foreground-secondary text-lg">
                Discover thousands of study materials, practice papers, and join our vibrant student community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="btn-hero group">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="group">
                  <Link to="/#pyqs">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore Library
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">Quick Links</h4>
                <div className="space-y-2 text-sm">
                  <Link to="/#faq" className="block text-foreground-secondary hover:text-primary transition-colors">
                    FAQ & Help
                  </Link>
                  <Link to="/contact" className="block text-foreground-secondary hover:text-primary transition-colors">
                    Support Center
                  </Link>
                  <Link to="/about" className="block text-foreground-secondary hover:text-primary transition-colors">
                    About Us
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">Community</h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-foreground-secondary hover:text-primary transition-colors">
                    Study Groups
                  </a>
                  <a href="#" className="block text-foreground-secondary hover:text-primary transition-colors">
                    Social Media
                  </a>
                  <a href="#" className="block text-foreground-secondary hover:text-primary transition-colors">
                    Student Forum
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal
          isOpen={!!selectedTool}
          onClose={closeToolModal}
          toolId={selectedTool.id}
          toolTitle={selectedTool.title}
        />
      )}

      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-50 shadow-glow hover:shadow-intense transition-all duration-300 rounded-full"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
      </div>
    </PageTransition>
  );
};

export default Tools;