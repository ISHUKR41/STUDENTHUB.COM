import React, { memo, useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LazyToolCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  isPro?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  onToolSelect: (tool: { id: string; title: string }) => void;
  className?: string;
}

const LazyToolCard = memo(({ 
  id, 
  title, 
  description, 
  category, 
  icon: Icon, 
  isPro, 
  isNew, 
  isPopular, 
  onToolSelect,
  className 
}: LazyToolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onToolSelect({ id, title });
  }, [id, title, onToolSelect]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-200 ease-out cursor-pointer",
        "hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1",
        "bg-card/80 backdrop-blur-sm border-border/50",
        "transform-gpu will-change-transform",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex items-center space-x-3 transition-transform duration-200",
            isHovered && "transform scale-105"
          )}>
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className="mt-1 text-xs bg-secondary/50 text-secondary-foreground"
              >
                {category}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            {isPro && (
              <Badge className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                PRO
              </Badge>
            )}
            {isNew && (
              <Badge className="text-xs bg-gradient-to-r from-green-400 to-blue-500 text-white">
                NEW
              </Badge>
            )}
            {isPopular && (
              <Badge className="text-xs bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                HOT
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>
        <Button 
          size="sm" 
          className={cn(
            "w-full transition-all duration-200",
            "transform-gpu will-change-transform",
            isHovered && "bg-primary/90 shadow-md"
          )}
          variant={isHovered ? "default" : "outline"}
        >
          Use Tool
        </Button>
      </CardContent>
      
      {/* Optimized gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-200 pointer-events-none",
        "bg-gradient-to-br from-primary/5 via-transparent to-secondary/5",
        isHovered && "opacity-100"
      )} />
    </Card>
  );
});

LazyToolCard.displayName = 'LazyToolCard';

export default LazyToolCard;