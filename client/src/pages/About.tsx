import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/StudentHub/Header';
import { 
  BookOpen, 
  Users, 
  Globe, 
  Shield, 
  Heart, 
  Lightbulb,
  ChevronRight,
  Play,
  Pause,
  ArrowUp,
  Target,
  Star,
  Award,
  TrendingUp,
  Download,
  Languages,
  MessageCircle,
  Smartphone,
  Brain,
  ChevronDown,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
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

    // Create floating papers and books
    const geometry = new THREE.BoxGeometry(0.1, 0.15, 0.01);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x3B82F6 }),
      new THREE.MeshBasicMaterial({ color: 0x10B981 }),
      new THREE.MeshBasicMaterial({ color: 0xF59E0B }),
      new THREE.MeshBasicMaterial({ color: 0xEF4444 }),
    ];

    const papers: THREE.Mesh[] = [];
    for (let i = 0; i < 50; i++) {
      const paper = new THREE.Mesh(geometry, materials[i % materials.length]);
      paper.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      paper.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(paper);
      papers.push(paper);
    }

    camera.position.z = 15;

    const animate = () => {
      if (!isAnimationPlaying) return;
      
      papers.forEach((paper, index) => {
        paper.rotation.x += 0.01;
        paper.rotation.y += 0.01;
        paper.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
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

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isAnimationPlaying]);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const coreValues = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Accessibility",
      description: "Resources for every region and language across India, breaking down barriers to quality education."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Accuracy",
      description: "Vetted, high-quality papers from trusted sources, verified by our expert team."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "Cutting-edge 3D/AI tools and smart features for modern, interactive learning."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Strong peer support network via WhatsApp and Telegram study groups."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Integrity",
      description: "Transparent, student-first approach with honest pricing and genuine care."
    }
  ];

  const offerings = [
    {
      title: "Extensive PYQ Library",
      description: "25,000+ Previous Year Question Papers covering all major competitive exams",
      icon: <BookOpen className="w-6 h-6" />,
      features: ["NEET, JEE, UPSC, SSC", "State Board Exams", "University Papers"]
    },
    {
      title: "Smart File Tools",
      description: "AI-powered conversion tools for all your academic needs",
      icon: <Lightbulb className="w-6 h-6" />,
      features: ["PDF↔Word Converter", "Image Resizer & OCR", "PPT↔PDF Tools"]
    },
    {
      title: "Multi-Language Support",
      description: "Content available in 22+ regional languages",
      icon: <Languages className="w-6 h-6" />,
      features: ["Hindi, English, Tamil", "Bengali, Telugu, Marathi", "And 16+ more languages"]
    },
    {
      title: "Vibrant Community",
      description: "Active study groups and peer support networks",
      icon: <MessageCircle className="w-6 h-6" />,
      features: ["WhatsApp Study Groups", "Telegram Channels", "Student Forums"]
    },
    {
      title: "Mobile App & AI Features",
      description: "Next-generation mobile experience with AI recommendations",
      icon: <Smartphone className="w-6 h-6" />,
      features: ["Smart Recommendations", "Offline Study Mode", "Progress Tracking"]
    }
  ];

  const milestones = [
    { 
      year: "2022", 
      event: "StudentHub launched with 1,000 question papers and big dreams",
      stats: "1K Papers • 10K Users"
    },
    { 
      year: "2023", 
      event: "Major growth milestone - reached 10,000+ papers and 50M users",
      stats: "10K Papers • 50M Users"
    },
    { 
      year: "2024", 
      event: "Introduced smart conversion tools and expanded to 22 languages",
      stats: "20K Papers • 120M Users • 22 Languages"
    },
    { 
      year: "2025", 
      event: "Achieved 170M users milestone and launched AI-powered features",
      stats: "25K Papers • 170M Users • AI Features"
    }
  ];

  const team = [
    {
      name: "Dr. Ananya Sharma",
      role: "Founder & CEO",
      quote: "Education should be accessible to everyone, everywhere.",
      expertise: "Educational Technology, 15+ years"
    },
    {
      name: "Rajesh Kumar",
      role: "Chief Technology Officer",
      quote: "Technology can revolutionize how students learn.",
      expertise: "AI/ML, Full-Stack Development"
    },
    {
      name: "Priya Patel",
      role: "Head of Content & Academics",
      quote: "Quality content is the foundation of great education.",
      expertise: "Curriculum Design, Academic Research"
    },
    {
      name: "Amit Singh",
      role: "Community & Growth Manager",
      quote: "Building bridges between students across India.",
      expertise: "Community Building, Digital Marketing"
    },
    {
      name: "Dr. Kavya Nair",
      role: "Head of Quality Assurance",
      quote: "Every paper we upload can change a student's future.",
      expertise: "Educational Assessment, Quality Control"
    },
    {
      name: "Vikash Yadav",
      role: "Student Success Manager",
      quote: "Students succeed when they have the right tools and support.",
      expertise: "Student Psychology, Success Coaching"
    }
  ];

  const testimonials = [
    {
      name: "Rahul Verma",
      exam: "JEE Main 2024 - AIR 2,847",
      quote: "StudentHub's organized PYQs and practice tests were game-changers. The 3D tools helped me visualize complex physics problems!",
      location: "Mumbai, Maharashtra"
    },
    {
      name: "Sneha Agarwal",
      exam: "NEET 2024 - AIR 1,245",
      quote: "The multi-language support was incredible. I could study biology in both English and Hindi, which really helped my understanding.",
      location: "Jaipur, Rajasthan"
    },
    {
      name: "Arjun Kumar",
      exam: "UPSC CSE 2023 - Rank 67",
      quote: "The community support and comprehensive material collection saved me thousands of rupees and months of preparation time.",
      location: "Delhi"
    },
    {
      name: "Meera Krishnan",
      exam: "CA Foundation 2024",
      quote: "File conversion tools were a lifesaver! Converting PDFs to Word for note-making became so easy.",
      location: "Chennai, Tamil Nadu"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Browse & Search",
      description: "Navigate through our organized categories or use smart search to find exactly what you need",
      icon: <Search className="w-8 h-8" />
    },
    {
      step: 2,
      title: "Download & Convert",
      description: "Download high-quality PDFs instantly, or use our tools to convert to your preferred format",
      icon: <Download className="w-8 h-8" />
    },
    {
      step: 3,
      title: "Practice & Share",
      description: "Study with our materials, join community discussions, and share your success stories",
      icon: <Users className="w-8 h-8" />
    }
  ];

  const roadmapItems = [
    "Mobile App Launch (iOS & Android)",
    "AI-Powered Study Recommendations",
    "Offline Content Packages",
    "Virtual Study Rooms",
    "Live Doubt Solving Sessions",
    "Partnerships with Top Coaching Institutes",
    "Advanced Analytics Dashboard",
    "Multilingual Voice Search"
  ];

  return (
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
        <div className="text-center space-y-8 animate-fadeInUp">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              About StudentHub.com
            </h1>
            <p className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto">
              Empowering Every Student—from Class 9 to PhD
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary animate-bounce">25,000+</div>
              <div className="text-sm text-foreground-secondary">Question Papers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary animate-bounce" style={{animationDelay: '0.1s'}}>170M+</div>
              <div className="text-sm text-foreground-secondary">Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary animate-bounce" style={{animationDelay: '0.2s'}}>22+</div>
              <div className="text-sm text-foreground-secondary">Languages</div>
            </div>
          </div>

          <Button 
            onClick={toggleAnimation}
            variant="outline"
            className="mt-8 group"
          >
            {isAnimationPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimationPlaying ? 'Pause' : 'Play'} 3D Animation
          </Button>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Our Story</h2>
          <div className="space-y-6 text-lg text-foreground-secondary leading-relaxed">
            <p className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <strong>StudentHub was born from a simple observation:</strong> students across India were struggling to find quality previous year papers and study materials. In 2022, a group of passionate educators and technologists came together to solve this fundamental problem in Indian education. What started as late-night conversations about the digital divide in education became a mission to democratize academic resources.
            </p>
            <p className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <strong>The core problem was clear:</strong> students in tier-2 and tier-3 cities had limited access to quality study materials, especially previous year question papers. Many were paying hefty amounts for outdated or incomplete resources. Our founders realized that technology could bridge this gap, making premium educational content accessible to every student, regardless of their location or economic background.
            </p>
            <p className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <strong>The "aha moment" came</strong> when our team met Rajesh, a student from rural Bihar who traveled 200km just to access question papers for JEE preparation. His dedication inspired us to create a platform that would bring quality education resources directly to students' fingertips. Today, students like Rajesh can access world-class materials from anywhere in India, and that's what drives us every day.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="h-80 cursor-pointer group perspective-1000">
              <div className="relative w-full h-full preserve-3d group-hover:rotate-y-180 transition-transform duration-700">
                <CardContent className="absolute inset-0 flex items-center justify-center backface-hidden p-8">
                  <div className="text-center">
                    <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-foreground-secondary">
                      To democratize exam preparation by providing free and premium question papers, smart file conversion tools, and vibrant community support for every Indian student.
                    </p>
                  </div>
                </CardContent>
                <CardContent className="absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180 p-8 bg-primary text-primary-foreground">
                  <div className="text-center">
                    <Star className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">How We Achieve This</h3>
                    <p>
                      Through cutting-edge 3D technology, AI-powered tools, strategic partnerships with educators, and an unwavering student-first approach to everything we build and deliver.
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="h-80 cursor-pointer group perspective-1000">
              <div className="relative w-full h-full preserve-3d group-hover:rotate-y-180 transition-transform duration-700">
                <CardContent className="absolute inset-0 flex items-center justify-center backface-hidden p-8">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="text-foreground-secondary">
                      To become India's ultimate one-stop hub for academic resources and study utilities, transforming how students learn and succeed.
                    </p>
                  </div>
                </CardContent>
                <CardContent className="absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180 p-8 bg-secondary text-secondary-foreground">
                  <div className="text-center">
                    <Award className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
                    <p>
                      Empowering 170 million students across India to access quality education, save money on resources, and achieve their academic dreams with confidence and community support.
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Core Values</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {coreValues.map((value, index) => (
              <Card 
                key={value.title} 
                className="text-center p-6 hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="space-y-4">
                  <div className="text-primary group-hover:scale-110 group-hover:animate-pulse transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{value.title}</h3>
                  <p className="text-sm text-foreground-secondary">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((offering, index) => (
              <Card 
                key={offering.title}
                className="group hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                    {offering.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{offering.title}</h3>
                  <p className="text-foreground-secondary">{offering.description}</p>
                  <ul className="text-sm text-foreground-secondary space-y-1">
                    {offering.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-2 transition-transform duration-300">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Key Milestones</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.year}
                className="flex items-center space-x-6 group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
                  {milestone.year}
                </div>
                <div className="flex-1 p-6 bg-card rounded-xl group-hover:shadow-lg transition-shadow duration-300 border border-border/20">
                  <p className="text-lg font-medium mb-2">{milestone.event}</p>
                  <p className="text-sm text-primary font-semibold">{milestone.stats}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card 
                key={member.name}
                className="text-center group hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                    <p className="text-xs text-foreground-secondary mt-1">{member.expertise}</p>
                  </div>
                  <p className="text-sm text-foreground-secondary italic">"{member.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Student Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className="hover:shadow-glow hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-foreground-secondary italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-primary text-sm font-medium">{testimonial.exam}</p>
                    <p className="text-xs text-foreground-secondary">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="text-center space-y-4 group">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-glow mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-primary group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-foreground-secondary leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">What's Next - Our Roadmap</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {roadmapItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-4 bg-card rounded-lg hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <span className="text-foreground group-hover:text-primary transition-colors duration-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold gradient-text mb-8">Ready to Transform Your Study Experience?</h2>
          <p className="text-xl text-foreground-secondary mb-8">
            Join millions of students who are already using StudentHub to achieve their academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="btn-hero group">
                <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Explore Our Library
              </Button>
            </Link>
            <Link to="/#tools">
              <Button size="lg" variant="outline" className="group">
                <Lightbulb className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Try Our Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-glow z-50"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default About;