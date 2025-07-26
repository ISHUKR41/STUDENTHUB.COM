import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import * as THREE from 'three';

export const HeroSection: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameId = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x1E88E5, 1.2);
    directionalLight.position.set(8, 8, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ffff, 0.8, 20);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Central Knowledge Hub (replacing globe)
    const hubGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const hubMaterial = new THREE.MeshPhongMaterial({
      color: 0x1E88E5,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
      emissive: 0x112244,
      emissiveIntensity: 0.1
    });
    const knowledgeHub = new THREE.Mesh(hubGeometry, hubMaterial);
    scene.add(knowledgeHub);

    // Create floating books
    const books: THREE.Group[] = [];
    const bookGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1);
    
    for (let i = 0; i < 12; i++) {
      const bookGroup = new THREE.Group();
      
      const bookMaterial = new THREE.MeshPhongMaterial({
        color: [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd][i % 6],
        shininess: 100
      });
      
      const book = new THREE.Mesh(bookGeometry, bookMaterial);
      bookGroup.add(book);
      
      const radius = 4 + Math.random() * 3;
      const angle = (i / 12) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 6;
      
      bookGroup.position.x = Math.cos(angle) * radius;
      bookGroup.position.y = height;
      bookGroup.position.z = Math.sin(angle) * radius;
      
      books.push(bookGroup);
      scene.add(bookGroup);
    }

    // Create floating math equations (using shapes to represent equations)
    const mathElements: THREE.Group[] = [];
    
    for (let i = 0; i < 15; i++) {
      const mathGroup = new THREE.Group();
      
      // Create different math symbol shapes
      if (i % 4 === 0) {
        // Plus sign for addition
        const plus1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.05, 0.05),
          new THREE.MeshPhongMaterial({ color: 0xffd700 })
        );
        const plus2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.3, 0.05),
          new THREE.MeshPhongMaterial({ color: 0xffd700 })
        );
        mathGroup.add(plus1, plus2);
      } else if (i % 4 === 1) {
        // Circle for pi, infinity
        const circle = new THREE.Mesh(
          new THREE.TorusGeometry(0.15, 0.03, 8, 16),
          new THREE.MeshPhongMaterial({ color: 0x32cd32 })
        );
        mathGroup.add(circle);
      } else if (i % 4 === 2) {
        // Triangle for delta, angles
        const triangle = new THREE.Mesh(
          new THREE.ConeGeometry(0.1, 0.2, 3),
          new THREE.MeshPhongMaterial({ color: 0xff4757 })
        );
        mathGroup.add(triangle);
      } else {
        // Square root symbol approximation
        const root1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.03, 0.03),
          new THREE.MeshPhongMaterial({ color: 0x8e44ad })
        );
        const root2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 0.15, 0.03),
          new THREE.MeshPhongMaterial({ color: 0x8e44ad })
        );
        root2.position.set(-0.06, -0.06, 0);
        mathGroup.add(root1, root2);
      }
      
      const radius = 3.5 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 8;
      
      mathGroup.position.x = Math.cos(angle) * radius;
      mathGroup.position.y = height;
      mathGroup.position.z = Math.sin(angle) * radius;
      
      mathElements.push(mathGroup);
      scene.add(mathGroup);
    }

    // Create physics elements (atoms, waves, molecules)
    const physicsElements: THREE.Group[] = [];
    
    for (let i = 0; i < 10; i++) {
      const physicsGroup = new THREE.Group();
      
      if (i % 3 === 0) {
        // Atom model with nucleus and electron orbits
        const nucleus = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          new THREE.MeshPhongMaterial({ color: 0xff0000 })
        );
        physicsGroup.add(nucleus);
        
        // Electron orbits
        for (let j = 0; j < 3; j++) {
          const orbit = new THREE.Mesh(
            new THREE.TorusGeometry(0.2 + j * 0.1, 0.01, 4, 16),
            new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true, opacity: 0.6 })
          );
          orbit.rotation.x = Math.random() * Math.PI;
          orbit.rotation.y = Math.random() * Math.PI;
          physicsGroup.add(orbit);
        }
      } else if (i % 3 === 1) {
        // Wave representation
        const waveGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
        const wave = new THREE.Mesh(waveGeometry, new THREE.MeshPhongMaterial({ color: 0x00bfff }));
        wave.rotation.z = Math.PI / 2;
        physicsGroup.add(wave);
      } else {
        // DNA helix representation
        const helix1 = new THREE.Mesh(
          new THREE.TorusGeometry(0.1, 0.02, 8, 16),
          new THREE.MeshPhongMaterial({ color: 0xff6b35 })
        );
        const helix2 = new THREE.Mesh(
          new THREE.TorusGeometry(0.1, 0.02, 8, 16),
          new THREE.MeshPhongMaterial({ color: 0x74b9ff })
        );
        helix2.position.y = 0.2;
        physicsGroup.add(helix1, helix2);
      }
      
      const radius = 5 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 6;
      
      physicsGroup.position.x = Math.cos(angle) * radius;
      physicsGroup.position.y = height;
      physicsGroup.position.z = Math.sin(angle) * radius;
      
      physicsElements.push(physicsGroup);
      scene.add(physicsGroup);
    }

    camera.position.z = 10;

    // Enhanced Animation with performance optimization
    let lastTime = 0;
    const animate = (currentTime: number) => {
      frameId.current = requestAnimationFrame(animate);
      
      const deltaTime = currentTime - lastTime;
      if (deltaTime < 16) return; // Limit to ~60fps
      lastTime = currentTime;
      
      const time = currentTime * 0.001;
      
      // Rotate knowledge hub smoothly
      knowledgeHub.rotation.y += 0.008;
      knowledgeHub.rotation.x += 0.003;
      
      // Animate books with smooth orbital motion
      books.forEach((book, index) => {
        book.rotation.x += 0.01;
        book.rotation.y += 0.005;
        book.rotation.z += 0.003;
        
        // Floating motion
        book.position.y += Math.sin(time * 0.5 + index) * 0.01;
        
        // Orbital motion
        const baseAngle = (index / books.length) * Math.PI * 2;
        const radius = 4 + Math.sin(time * 0.3 + index) * 0.5;
        book.position.x = Math.cos(baseAngle + time * 0.1) * radius;
        book.position.z = Math.sin(baseAngle + time * 0.1) * radius;
      });
      
      // Animate math elements
      mathElements.forEach((element, index) => {
        element.rotation.x += 0.02;
        element.rotation.y += 0.015;
        element.position.y += Math.sin(time + index * 0.5) * 0.008;
        
        // Gentle orbital motion
        const baseAngle = (index / mathElements.length) * Math.PI * 2;
        const radius = 3.5 + Math.sin(time * 0.4 + index) * 0.3;
        element.position.x = Math.cos(baseAngle + time * 0.15) * radius;
        element.position.z = Math.sin(baseAngle + time * 0.15) * radius;
      });
      
      // Animate physics elements
      physicsElements.forEach((element, index) => {
        element.rotation.y += 0.02;
        element.position.y += Math.sin(time * 0.7 + index) * 0.01;
        
        const baseAngle = (index / physicsElements.length) * Math.PI * 2;
        const radius = 5 + Math.sin(time * 0.2 + index) * 0.4;
        element.position.x = Math.cos(baseAngle + time * 0.08) * radius;
        element.position.z = Math.sin(baseAngle + time * 0.08) * radius;
      });
      
      renderer.render(scene, camera);
    };

    animate(0);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Three.js Canvas */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 opacity-80 sm:opacity-100"
        style={{ background: 'transparent' }}
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-20">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 animate-fadeInUp">
          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight">
            <span className="gradient-text block">
              ALL IN ONE
            </span>
            <span className="text-foreground block mt-1 sm:mt-2">
              Solutions for Students
            </span>
          </h1>

          {/* Enhanced Subheadline with detailed features */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 text-sm sm:text-base lg:text-lg text-foreground-secondary leading-relaxed">
              <div className="mb-2 sm:mb-3">🎓 <strong className="text-primary">Past Year Questions:</strong> <span className="hidden sm:inline">25,000+ Papers from Class 9 to PhD Level</span><span className="sm:hidden">25,000+ Papers</span></div>
              <div className="mb-2 sm:mb-3">📚 <strong className="text-secondary">Study Materials:</strong> <span className="hidden sm:inline">Books, Notes, Video Lectures & Live Classes</span><span className="sm:hidden">Books & Notes</span></div>
              <div className="mb-2 sm:mb-3">🧪 <strong className="text-accent">Practice Tests:</strong> <span className="hidden sm:inline">Mock Tests, Chapter-wise Tests & Full-Length Exams</span><span className="sm:hidden">Mock Tests</span></div>
              <div className="mb-2 sm:mb-3">📰 <strong className="text-primary">Latest Updates:</strong> <span className="hidden sm:inline">Exam News, Results, Cut-offs & Notifications</span><span className="sm:hidden">Exam News</span></div>
              <div className="mb-0">🛠️ <strong className="text-secondary">Smart Tools:</strong> <span className="hidden sm:inline">AI Study Planner, Performance Analytics & Doubt Solver</span><span className="sm:hidden">AI Tools</span></div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto mt-8 sm:mt-12">
            <div className="glass p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text">25K+</div>
              <div className="text-foreground-secondary text-xs sm:text-sm lg:text-base">Question Papers</div>
            </div>
            <div className="glass p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text">170M+</div>
              <div className="text-foreground-secondary text-xs sm:text-sm lg:text-base">Annual Users</div>
            </div>
            <div className="glass p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text">500+</div>
              <div className="text-foreground-secondary text-xs sm:text-sm lg:text-base">Exams Covered</div>
            </div>
            <div className="glass p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text">22+</div>
              <div className="text-foreground-secondary text-xs sm:text-sm lg:text-base">Languages</div>
            </div>
          </div>

          {/* Exam Categories */}
          <div className="mt-6 sm:mt-8 max-w-5xl mx-auto">
            <div className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <div className="text-xs sm:text-sm lg:text-base text-foreground-secondary leading-relaxed space-y-2 sm:space-y-0">
                <div><strong className="text-primary">Boards:</strong> CBSE • ICSE • State Boards</div>
                <div><strong className="text-secondary">Engineering:</strong> JEE • BITSAT • VITEEE • State CETs</div>
                <div><strong className="text-accent">Medical:</strong> NEET • AIIMS • JIPMER</div>
                <div><strong className="text-primary">Competitive:</strong> UPSC • SSC • Banking • Railways • Defense</div>
                <div><strong className="text-secondary">Management:</strong> CAT • XAT • MAT • SNAP</div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-8 sm:mt-12">
            <Button size="lg" className="btn-hero group text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl touch-target">
              🚀 <span className="hidden sm:inline">Start Learning Now</span><span className="sm:hidden">Start Learning</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="btn-ghost group text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl border-white/20 text-white hover:bg-white/10 touch-target">
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              📖 <span className="hidden sm:inline">Browse Question Papers</span><span className="sm:hidden">Browse Papers</span>
            </Button>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-sm sm:text-base text-foreground-secondary mb-4 sm:mb-6">
              Trusted by students from 1000+ top institutions across India
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 opacity-70 max-w-3xl mx-auto">
              {[
                { name: 'IIT', desc: 'Indian Institute of Technology' },
                { name: 'AIIMS', desc: 'All India Institute of Medical Sciences' },
                { name: 'NIT', desc: 'National Institute of Technology' },
                { name: 'IIM', desc: 'Indian Institute of Management' },
                { name: 'DU', desc: 'Delhi University' },
                { name: 'BHU', desc: 'Banaras Hindu University' }
              ].map((institute) => (
                <div key={institute.name} className="text-center group cursor-pointer touch-target">
                  <div className="text-sm sm:text-lg lg:text-xl font-bold text-foreground-secondary group-hover:text-primary transition-colors">
                    {institute.name}
                  </div>
                  <div className="text-xs text-foreground-secondary/60 hidden sm:group-hover:block">
                    {institute.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-20 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-accent/10 rounded-full blur-2xl animate-bounce-subtle"></div>
      </div>
    </section>
  );
};