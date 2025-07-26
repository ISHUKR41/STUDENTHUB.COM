import React, { useEffect, useState } from 'react';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Smooth page load transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium gradient-text">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
      {children}
    </div>
  );
};

export default PageTransition;