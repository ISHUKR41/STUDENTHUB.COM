import React, { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface NewsHotspot {
  id: string;
  title: string;
  lat: number;
  lng: number;
  category: string;
  intensity: number;
}

interface NewsGlobeProps {
  hotspots?: NewsHotspot[];
}

// CSS-based 3D Globe Component (without Three.js dependency issues)
const NewsGlobe: React.FC<NewsGlobeProps> = ({ hotspots = [] }) => {
  const globeRef = useRef<HTMLDivElement>(null);

  // Convert lat/lng to 3D sphere coordinates for CSS positioning
  const convertCoordinates = (lat: number, lng: number, radius: number = 150) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    
    const x = Math.cos(latRad) * Math.cos(lngRad) * radius;
    const y = Math.sin(latRad) * radius;
    const z = Math.cos(latRad) * Math.sin(lngRad) * radius;
    
    return { x, y, z };
  };

  // Default hotspots for demonstration
  const defaultHotspots: NewsHotspot[] = [
    { id: '1', title: 'UPSC Updates', lat: 28.6139, lng: 77.2090, category: 'Exam', intensity: 0.9 },
    { id: '2', title: 'IIT News', lat: 19.0760, lng: 72.8777, category: 'Academic', intensity: 0.8 },
    { id: '3', title: 'JEE Results', lat: 12.9716, lng: 77.5946, category: 'Exam', intensity: 0.7 },
    { id: '4', title: 'Scholarship Alert', lat: 22.5726, lng: 88.3639, category: 'Scholarship', intensity: 0.6 },
    { id: '5', title: 'Career Fair', lat: 26.9124, lng: 75.7873, category: 'Career', intensity: 0.5 },
  ];

  const activeHotspots = hotspots.length > 0 ? hotspots : defaultHotspots;

  const getCategoryColor = (category: string) => {
    const colors = {
      'Academic': '#00d4ff',
      'Exam': '#ff6b35',
      'Scholarship': '#39ff14',
      'Career': '#9c27b0',
      'Technology': '#ffd700',
      'Sports': '#ff1744',
      'General': '#ffffff'
    };
    return colors[category as keyof typeof colors] || '#ffffff';
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Globe Base */}
      <motion.div
        ref={globeRef}
        className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-black/40 backdrop-blur-sm border border-cyan-400/30"
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(156, 39, 176, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)
          `,
          boxShadow: `
            inset 0 0 50px rgba(0, 212, 255, 0.1),
            0 0 100px rgba(0, 212, 255, 0.3),
            0 0 200px rgba(156, 39, 176, 0.2)
          `
        }}
      >
        {/* Globe Grid Lines */}
        <div className="absolute inset-0 rounded-full opacity-30">
          {/* Longitude lines */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`lng-${i}`}
              className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent transform -translate-x-1/2"
              style={{
                transform: `translateX(-50%) rotateZ(${i * 30}deg)`
              }}
            />
          ))}
          
          {/* Latitude lines */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`lat-${i}`}
              className="absolute left-1/2 top-1/2 border border-cyan-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${100 - i * 15}%`,
                height: `${100 - i * 15}%`,
              }}
            />
          ))}
        </div>

        {/* News Hotspots */}
        {activeHotspots.map((hotspot, index) => {
          const coords = convertCoordinates(hotspot.lat, hotspot.lng);
          const isVisible = coords.z > 0; // Only show points on the front side
          
          return (
            <motion.div
              key={hotspot.id}
              className="absolute w-3 h-3 rounded-full cursor-pointer group"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isVisible ? 1 : 0.3, 
                opacity: isVisible ? hotspot.intensity : 0.2,
              }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5 
              }}
              whileHover={{ scale: 2, zIndex: 10 }}
              style={{
                left: `${50 + (coords.x / 150) * 40}%`,
                top: `${50 - (coords.y / 150) * 40}%`,
                backgroundColor: getCategoryColor(hotspot.category),
                boxShadow: `0 0 20px ${getCategoryColor(hotspot.category)}`,
                zIndex: Math.round(coords.z),
              }}
            >
              {/* Pulsing effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                style={{
                  backgroundColor: getCategoryColor(hotspot.category),
                }}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                {hotspot.title}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/80" />
              </div>
            </motion.div>
          );
        })}

        {/* Central glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-cyan-400/10 via-transparent to-transparent" />
        
        {/* Rotating outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/20"
          animate={{
            rotateZ: [0, -360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Globe Statistics */}
      <div className="absolute -bottom-16 left-0 right-0 text-center">
        <motion.div
          className="inline-block px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-cyan-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <span className="text-cyan-400 text-sm font-semibold">
            {activeHotspots.length} Active News Hotspots
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsGlobe;