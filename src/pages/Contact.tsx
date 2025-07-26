import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/StudentHub/Header';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin,
  Send,
  CheckCircle,
  ArrowUp,
  ChevronDown,
  Users,
  BookOpen,
  Clock,
  Globe,
  Headphones,
  MessageCircle,
  Star,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    requestType: 'book',
    course: '',
    materialName: '',
    author: '',
    subject: '',
    format: [] as string[],
    urgency: 'no-hurry',
    comments: '',
    joinGroup: [] as string[]
  });
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene for contact page
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create floating contact icons and shapes
    const createContactScene = () => {
      // Email icons
      const emailGeometry = new THREE.BoxGeometry(0.1, 0.07, 0.02);
      const emailMaterial = new THREE.MeshBasicMaterial({ color: 0x3B82F6 });
      
      // Phone icons
      const phoneGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8);
      const phoneMaterial = new THREE.MeshBasicMaterial({ color: 0x10B981 });
      
      // Chat bubbles
      const chatGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const chatMaterial = new THREE.MeshBasicMaterial({ color: 0xF59E0B });

      const contactElements: THREE.Mesh[] = [];
      
      // Create floating contact elements
      for (let i = 0; i < 30; i++) {
        let element;
        const type = i % 3;
        
        if (type === 0) {
          element = new THREE.Mesh(emailGeometry, emailMaterial);
        } else if (type === 1) {
          element = new THREE.Mesh(phoneGeometry, phoneMaterial);
        } else {
          element = new THREE.Mesh(chatGeometry, chatMaterial);
        }
        
        element.position.set(
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          Math.random() * 10 - 5
        );
        element.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        
        scene.add(element);
        contactElements.push(element);
      }
      
      return contactElements;
    };

    const contactElements = createContactScene();
    camera.position.z = 10;

    const animate = () => {
      contactElements.forEach((element, index) => {
        element.rotation.x += 0.005;
        element.rotation.y += 0.005;
        element.position.y += Math.sin(Date.now() * 0.002 + index) * 0.002;
        element.position.x += Math.cos(Date.now() * 0.001 + index) * 0.001;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
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
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name as keyof typeof prev].includes(value)
        ? (prev[name as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[name as keyof typeof prev] as string[]), value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Open Google Form in new tab
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSczWJI6cXslwpNgayBkuH0pnKfCZx0weAYi2lbnkLLpb76Myg/viewform", "_blank");
    
    setIsSubmitted(true);
    toast({
      title: "Request Submitted Successfully! 🎉",
      description: "We'll try to upload your requested material soon and send you the link via email or WhatsApp within 1-3 days.",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Get comprehensive help via email",
      action: "ishu_2312res305@iitp.ac.in",
      href: "mailto:ishu_2312res305@iitp.ac.in",
      color: "text-blue-500 hover:text-blue-600"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Live Chat",
      description: "Instant chat with our support team",
      action: "Start Chat",
      href: "#",
      color: "text-green-500 hover:text-green-600"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Support",
      description: "Call us directly for urgent help",
      action: "+91 7541024846",
      href: "tel:+917541024846",
      color: "text-orange-500 hover:text-orange-600"
    }
  ];

  const supportTeam = [
    {
      name: "Ananya",
      role: "Senior Support Manager",
      greeting: "Hi! I'm here to help with any questions about our platform!",
      specialty: "General Support & Platform Navigation"
    },
    {
      name: "Rajesh",
      role: "Technical Support Lead",
      greeting: "Hey there! I can help you with technical issues and file tools!",
      specialty: "Technical Issues & File Conversion Tools"
    },
    {
      name: "Priya",
      role: "Academic Content Specialist",
      greeting: "Hello! I assist with finding the right study materials for you!",
      specialty: "Content Requests & Academic Guidance"
    },
    {
      name: "Amit",
      role: "Community Manager",
      greeting: "Welcome! I can help you join our study groups and community!",
      specialty: "Community Groups & Student Networks"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to get requested materials?",
      answer: "We typically upload requested materials within 1-3 days and notify you via email or WhatsApp. For urgent requests (exam next day), we prioritize and try to fulfill within 24 hours."
    },
    {
      question: "Is there a limit to how many requests I can make?",
      answer: "No, you can request as many materials as you need. We're here to help with your studies! However, please be specific about your requirements to help us serve you better."
    },
    {
      question: "What formats are available for downloads?",
      answer: "We provide materials primarily in PDF format, but our smart tools can convert to Word, images, PowerPoint, and other formats. You can also request specific formats when making a request."
    },
    {
      question: "How do I join study groups?",
      answer: "You can join our WhatsApp and Telegram groups by requesting access in the form below, or through the community links we provide. We have subject-specific and exam-specific groups."
    },
    {
      question: "Are the materials free?",
      answer: "Yes! Most of our question papers and basic tools are completely free. We also offer premium features and advanced tools for enhanced study experience."
    },
    {
      question: "How do I report incorrect or poor quality materials?",
      answer: "Please email us at the support address with details about the specific material. We take quality seriously and will investigate and fix issues promptly."
    }
  ];

  const officeLocation = {
    address: "IIT Patna Campus, Bihta, Patna, Bihar 801106",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM",
    timezone: "IST (Indian Standard Time)"
  };

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
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto">
              We're here to help—questions, feedback & support
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary flex items-center justify-center">
                <Clock className="w-8 h-8 mr-2" />
                24/7
              </div>
              <div className="text-sm text-foreground-secondary">Support Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary flex items-center justify-center">
                <Star className="w-8 h-8 mr-2" />
                99.9%
              </div>
              <div className="text-sm text-foreground-secondary">Response Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1-3</div>
              <div className="text-sm text-foreground-secondary">Days Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">Multiple Ways to Reach Us</h2>
          <p className="text-center text-foreground-secondary mb-12 max-w-2xl mx-auto">
            Choose the contact method that works best for you. Our team is ready to help!
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card 
                key={method.title}
                className="group hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20"
                onClick={() => method.href !== "#" && window.open(method.href, "_blank")}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`group-hover:scale-110 transition-transform duration-300 flex justify-center ${method.color}`}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                    <p className="text-foreground-secondary mb-4">{method.description}</p>
                  </div>
                  <Button 
                    variant="outline"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 w-full"
                  >
                    {method.action}
                    {method.href !== "#" && <ExternalLink className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office Location & Info */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold gradient-text">Our Office</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-foreground-secondary">{officeLocation.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Office Hours</p>
                    <p className="text-foreground-secondary">{officeLocation.hours}</p>
                    <p className="text-xs text-foreground-secondary">{officeLocation.timezone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Online Support</p>
                    <p className="text-foreground-secondary">Available 24/7 via email and chat</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-6 shadow-glow">
              <CardContent className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => window.open("mailto:ishu_2312res305@iitp.ac.in", "_blank")}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us Now
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => window.open("tel:+917541024846", "_blank")}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Team */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">Meet Our Support Team</h2>
          <p className="text-center text-foreground-secondary mb-12 max-w-2xl mx-auto">
            Our dedicated team members are here to provide personalized assistance
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTeam.map((member, index) => (
              <Card 
                key={member.name}
                className="group hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {member.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                  </div>
                  <div className="bg-background-secondary p-3 rounded-lg">
                    <p className="text-sm italic">"{member.greeting}"</p>
                  </div>
                  <p className="text-xs text-foreground-secondary">{member.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Book/PYQ Request Form */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">📘 Request Missing Book or PYQ</h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Can't find what you're looking for? Fill out this form and we'll try to upload it for you! 
              We've already uploaded thousands of books and question papers, but if something's missing, we're here to help.
            </p>
            <div className="flex justify-center space-x-6 mt-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>High Quality</span>
              </div>
            </div>
          </div>

          <Card className="shadow-glow border-2 border-primary/20">
            <CardContent className="p-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="border-b border-border/20 pb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="focus:ring-2 focus:ring-primary transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                          className="focus:ring-2 focus:ring-primary transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="whatsapp">WhatsApp Number (Optional but recommended)</Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXXXXXXX"
                        className="focus:ring-2 focus:ring-primary transition-all duration-300"
                      />
                      <p className="text-xs text-foreground-secondary mt-1">
                        We'll send you the download link faster on WhatsApp!
                      </p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="border-b border-border/20 pb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary" />
                      What do you need?
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Request Type *</Label>
                        <div className="flex gap-4">
                          {[
                            { value: 'book', label: '📚 Book', desc: 'Textbooks, reference books' },
                            { value: 'pyq', label: '📄 PYQ', desc: 'Previous year papers' },
                            { value: 'both', label: '📚📄 Both', desc: 'Books and question papers' }
                          ].map((type) => (
                            <label key={type.value} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-background-secondary transition-colors duration-300">
                              <input
                                type="radio"
                                name="requestType"
                                value={type.value}
                                checked={formData.requestType === type.value}
                                onChange={handleInputChange}
                                className="text-primary focus:ring-primary"
                              />
                              <div>
                                <span className="font-medium">{type.label}</span>
                                <p className="text-xs text-foreground-secondary">{type.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="course">Class/Course/Exam *</Label>
                          <Input
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            placeholder="e.g., Class 12, B.Tech CS, JEE Main, NEET"
                            required
                            className="focus:ring-2 focus:ring-primary transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="e.g., Physics, Chemistry, Mathematics"
                            required
                            className="focus:ring-2 focus:ring-primary transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="materialName">Book/Paper Name *</Label>
                        <Input
                          id="materialName"
                          name="materialName"
                          value={formData.materialName}
                          onChange={handleInputChange}
                          placeholder="e.g., HC Verma Physics Part 1, UPSC GS Paper 1 - 2022"
                          required
                          className="focus:ring-2 focus:ring-primary transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="author">Author/Publisher (Optional)</Label>
                        <Input
                          id="author"
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          placeholder="Author name or publisher (helps us find the exact book)"
                          className="focus:ring-2 focus:ring-primary transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="border-b border-border/20 pb-6">
                    <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Preferred Format</Label>
                        <div className="flex flex-wrap gap-4">
                          {['PDF', 'Scan/Image', 'No Preference'].map((format) => (
                            <label key={format} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.format.includes(format)}
                                onChange={() => handleCheckboxChange('format', format)}
                                className="text-primary focus:ring-primary"
                              />
                              <span>{format}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>How urgently do you need it?</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { value: 'urgent', label: '🔥 Urgent (1 day)', desc: 'Exam tomorrow!' },
                            { value: 'soon', label: '⏰ Soon (2-3 days)', desc: 'Need for study' },
                            { value: 'no-hurry', label: '📅 No hurry (within a week)', desc: 'General preparation' }
                          ].map((option) => (
                            <label key={option.value} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-background-secondary transition-colors duration-300">
                              <input
                                type="radio"
                                name="urgency"
                                value={option.value}
                                checked={formData.urgency === option.value}
                                onChange={handleInputChange}
                                className="text-primary focus:ring-primary"
                              />
                              <div>
                                <span className="font-medium">{option.label}</span>
                                <p className="text-xs text-foreground-secondary">{option.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comments">Extra Comments (Optional)</Label>
                      <Textarea
                        id="comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        placeholder="Any specific year, chapter, edition, or additional details that might help us find exactly what you need..."
                        className="focus:ring-2 focus:ring-primary transition-all duration-300"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Want to join our study groups?</Label>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { value: 'WhatsApp', icon: '💬', desc: 'Quick updates & discussions' },
                          { value: 'Telegram', icon: '📱', desc: 'Study channels & resources' },
                          { value: 'No', icon: '❌', desc: 'Just the material, please' }
                        ].map((platform) => (
                          <label key={platform.value} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-background-secondary transition-colors duration-300">
                            <input
                              type="checkbox"
                              checked={formData.joinGroup.includes(platform.value)}
                              onChange={() => handleCheckboxChange('joinGroup', platform.value)}
                              className="text-primary focus:ring-primary"
                            />
                            <div>
                              <span>{platform.icon} {platform.value}</span>
                              <p className="text-xs text-foreground-secondary">{platform.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full btn-hero group"
                  >
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Submit Request
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-6 py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-2xl font-bold text-green-500">Request Submitted Successfully! 🎉</h3>
                  <p className="text-foreground-secondary max-w-md mx-auto">
                    Thank you for your request! We'll try to upload your book or paper soon and will send you the link by email or WhatsApp within 1-3 days.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground-secondary">
                      ✅ Request received and being processed<br/>
                      📧 You'll get email updates<br/>
                      💬 WhatsApp notifications (if provided)<br/>
                      🎯 Expected delivery: 1-3 days
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                  >
                    Submit Another Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">Frequently Asked Questions</h2>
          <p className="text-center text-foreground-secondary mb-12">
            Quick answers to common questions about our services
          </p>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-glow transition-all duration-300">
                <CardContent 
                  className="p-6"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-primary transition-transform duration-300 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {openFAQ === index && (
                    <div className="mt-4 text-foreground-secondary animate-fadeInUp">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links & Community */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Join Our Community</h2>
          <p className="text-foreground-secondary mb-8">
            Connect with thousands of students and get instant updates
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">WhatsApp Groups</h3>
                <p className="text-sm text-foreground-secondary mb-4">
                  Join subject-wise study groups for instant help and updates
                </p>
                <Button variant="outline" size="sm">Join Groups</Button>
              </CardContent>
            </Card>
            <Card className="hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Send className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Telegram Channels</h3>
                <p className="text-sm text-foreground-secondary mb-4">
                  Get daily updates, tips, and exclusive content
                </p>
                <Button variant="outline" size="sm">Follow Channels</Button>
              </CardContent>
            </Card>
            <Card className="hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Student Forums</h3>
                <p className="text-sm text-foreground-secondary mb-4">
                  Discuss doubts, share experiences, and help each other
                </p>
                <Button variant="outline" size="sm">Join Forums</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-glow z-50 group"
          size="icon"
        >
          <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        </Button>
      )}
    </div>
  );
};

export default Contact;