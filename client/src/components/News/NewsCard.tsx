import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
// Removed React Three Fiber and drei imports
import { Link } from 'wouter';
import { Clock, Eye, Heart, Share2, Tag } from 'lucide-react';
import { NewsArticle, formatDate, getCategoryColor } from '@/lib/newsData';
import { Badge } from '@/components/ui/badge';
// Removed Three.js import

// GLSL Shaders for image effects
const fragmentShader = `
  uniform float time;
  uniform sampler2D texture1;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    // Subtle glitch effect on hover
    float noise = sin(uv.y * 50.0 + time * 8.0) * 0.002;
    uv.x += noise;
    
    // RGB shift effect
    float r = texture2D(texture1, uv + vec2(0.001, 0.0)).r;
    float g = texture2D(texture1, uv).g;
    float b = texture2D(texture1, uv - vec2(0.001, 0.0)).b;
    
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

interface ImagePlaneProps {
  imageUrl: string;
  isHovered: boolean;
}

const ImagePlane = ({ imageUrl, isHovered }: ImagePlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imageUrl);
  
  const uniforms = useRef({
    time: { value: 0 },
    texture1: { value: texture }
  });

  useFrame((state) => {
    if (uniforms.current) {
      uniforms.current.time.value = state.clock.elapsedTime;
    }
    
    if (meshRef.current && isHovered) {
      meshRef.current.scale.setScalar(1.05);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <Plane ref={meshRef} args={[4, 2.25]}>
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </Plane>
  );
};

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

export const NewsCard = ({ article, index }: NewsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="relative"
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        glareEnable={true}
        glareMaxOpacity={0.2}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="20px"
        scale={1.02}
        className="w-full"
      >
        <div
          className="relative bg-gradient-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 bg-gradient-primary opacity-0 -z-10"
            animate={{ opacity: isHovered ? 0.1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Featured badge */}
          {article.featured && (
            <div className="absolute top-4 left-4 z-20">
              <Badge className="bg-accent text-accent-foreground">
                ⭐ Featured
              </Badge>
            </div>
          )}

          {/* 3D Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[2, 2, 2]} intensity={0.4} />
              <ImagePlane imageUrl={article.imageUrl} isHovered={isHovered} />
            </Canvas>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Category and meta info */}
            <div className="flex items-center justify-between text-sm">
              <Badge 
                variant="secondary" 
                className={`${getCategoryColor(article.category)} bg-muted/50`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {article.category}
              </Badge>
              
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}m read</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <motion.h3 
              className="text-xl font-semibold text-foreground leading-tight hover:text-primary transition-colors cursor-pointer"
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/news/${article.slug}`}>
                {article.title}
              </Link>
            </motion.h3>

            {/* Summary */}
            <motion.p 
              className="text-muted-foreground text-sm leading-relaxed"
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {article.summary}
            </motion.p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                {formatDate(article.publishDate)} • {article.author}
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-destructive transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{article.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">{article.shares}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hover effect particles */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full opacity-70"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: '100%',
                    scale: 0 
                  }}
                  animate={{ 
                    y: '0%',
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity 
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Tilt>
    </motion.div>
  );
};