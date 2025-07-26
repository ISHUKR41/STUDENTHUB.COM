import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ArrowRight,
  Heart
} from 'lucide-react';

export const FooterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setEmail('');
    setIsSubscribing(false);
    
    // Here you would typically show a success toast
    console.log('Newsletter subscription:', email);
  };

  const footerSections = [
    {
      title: 'Classes & Boards',
      links: [
        { label: 'CBSE Papers', href: '#cbse' },
        { label: 'ICSE Papers', href: '#icse' },
        { label: 'State Boards', href: '#state-boards' },
        { label: 'Class 9', href: '#class-9' },
        { label: 'Class 10', href: '#class-10' },
        { label: 'Class 11', href: '#class-11' },
        { label: 'Class 12', href: '#class-12' }
      ]
    },
    {
      title: 'Competitive Exams',
      links: [
        { label: 'JEE Main & Advanced', href: '#jee' },
        { label: 'NEET UG', href: '#neet' },
        { label: 'UPSC Civil Services', href: '#upsc' },
        { label: 'SSC Exams', href: '#ssc' },
        { label: 'Banking Exams', href: '#banking' },
        { label: 'CAT & Management', href: '#cat' },
        { label: 'GATE & Engineering', href: '#gate' }
      ]
    },
    {
      title: 'Professional Courses',
      links: [
        { label: 'CA Papers', href: '#ca' },
        { label: 'CS Papers', href: '#cs' },
        { label: 'CMA Papers', href: '#cma' },
        { label: 'Law Entrance (CLAT)', href: '#clat' },
        { label: 'Architecture (NATA)', href: '#nata' },
        { label: 'Design Entrance', href: '#design' },
        { label: 'PhD Entrance', href: '#phd' }
      ]
    },
    {
      title: 'Resources & Support',
      links: [
        { label: 'How to Use', href: '#how-to' },
        { label: 'Paper Request', href: '#request' },
        { label: 'Quality Guarantee', href: '#quality' },
        { label: 'Help Center', href: '#help' },
        { label: 'Contact Support', href: '#support' },
        { label: 'API Documentation', href: '#api' },
        { label: 'Bulk Downloads', href: '#bulk' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: <Youtube className="h-5 w-5" />, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' }
  ];

  const companyInfo = [
    { icon: <Mail className="h-4 w-4" />, text: 'ishu_2312res305@iitp.ac.in', href: 'mailto:ishu_2312res305@iitp.ac.in' },
    { icon: <Phone className="h-4 w-4" />, text: '+917541024846', href: 'tel:+917541024846' },
    { icon: <MapPin className="h-4 w-4" />, text: 'New Delhi, India', href: '#' }
  ];

  return (
    <footer className="bg-background-tertiary border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-12">
            {/* Company Info & Newsletter */}
            <div className="sm:col-span-2 lg:col-span-2">
              {/* Logo & Description */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-gradient-primary rounded-lg">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">
                  <span className="hidden sm:inline">STUDENTHUB.COM</span>
                  <span className="sm:hidden">STUDENTHUB</span>
                </span>
              </div>
              
              <p className="text-foreground-secondary leading-relaxed mb-6">
                India's largest and most trusted platform for authentic question papers. 
                Empowering over 170 million students annually with quality educational resources 
                from Class 9 to PhD level.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                {companyInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 text-foreground-secondary hover:text-primary transition-colors group"
                  >
                    <span className="text-primary group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    {item.text}
                  </a>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">Stay Updated</h4>
                <p className="text-sm text-foreground-secondary">
                  Get notified about new question papers and features.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-background border-border focus:border-primary"
                      required
                    />
                    <Button 
                      type="submit"
                      disabled={isSubscribing}
                      className="btn-hero px-4"
                    >
                      {isSubscribing ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-foreground-secondary">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={section.title} className="lg:col-span-1">
                <h4 className="text-lg font-semibold text-foreground mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-foreground-secondary hover:text-primary transition-colors text-sm leading-relaxed hover:translate-x-1 transform transition-transform duration-200 inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media & Stats */}
        <div className="py-8 border-t border-border/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-foreground-secondary text-sm font-medium">Follow us:</span>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`p-2 rounded-lg bg-background hover:bg-background-secondary transition-all hover-scale ${social.color}`}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold gradient-text">25K+</div>
                <div className="text-foreground-secondary">Papers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold gradient-text-secondary">170M+</div>
                <div className="text-foreground-secondary">Users</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold gradient-text-accent">99.9%</div>
                <div className="text-foreground-secondary">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-foreground-secondary">
            {/* Copyright */}
            <div className="flex items-center gap-2">
              <span>© 2024 STUDENTHUB.COM</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> in India
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </a>
              <a href="#security" className="hover:text-primary transition-colors">
                Security
              </a>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap justify-center lg:justify-end gap-4">
            <div className="px-3 py-1 bg-background border border-border rounded-lg text-xs text-foreground-secondary">
              SSL Secured
            </div>
            <div className="px-3 py-1 bg-background border border-border rounded-lg text-xs text-foreground-secondary">
              GDPR Compliant  
            </div>
            <div className="px-3 py-1 bg-background border border-border rounded-lg text-xs text-foreground-secondary">
              ISO 27001 Certified
            </div>
            <div className="px-3 py-1 bg-background border border-border rounded-lg text-xs text-foreground-secondary">
              100% Authentic Papers
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-4 border-t border-border/30 text-center">
          <p className="text-xs text-foreground-secondary leading-relaxed max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> STUDENTHUB.COM is an independent educational platform. 
            We are not affiliated with any examination board, university, or government organization. 
            All question papers are sourced from publicly available official sources and are provided 
            for educational purposes only. Trademarks and copyrights belong to their respective owners.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-primary text-primary-foreground rounded-full shadow-glow hover:scale-110 transition-all z-40"
        title="Back to top"
      >
        <ArrowRight className="h-5 w-5 rotate-[-90deg]" />
      </button>
    </footer>
  );
};