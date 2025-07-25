import React, { useMemo, memo } from 'react';
import LazyToolCard from './LazyToolCard';
import { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  isPro?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

interface VirtualizedToolGridProps {
  tools: Tool[];
  onToolSelect: (tool: { id: string; title: string }) => void;
  searchQuery: string;
  activeFilter: string;
  containerHeight: number;
  containerWidth: number;
}

const ITEM_WIDTH = 340;
const ITEM_HEIGHT = 220;
const GUTTER_SIZE = 20;

const VirtualizedToolGrid = memo(({ 
  tools, 
  onToolSelect, 
  searchQuery, 
  activeFilter 
}: VirtualizedToolGridProps) => {
  
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || 
                           tool.category.toLowerCase() === activeFilter.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  }, [tools, searchQuery, activeFilter]);

  if (filteredTools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground">No tools found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
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
          onToolSelect={onToolSelect}
        />
      ))}
    </div>
  );
});

VirtualizedToolGrid.displayName = 'VirtualizedToolGrid';

export default VirtualizedToolGrid;