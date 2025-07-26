// Mock News Database and API Functions
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  fullContent: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  readTime: number;
  featured: boolean;
  priority: number;
  imageUrl: string;
  sourceLink?: string;
  views: number;
  likes: number;
  shares: number;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  totalPages: number;
}

// Mock news data
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'JEE Advanced 2024 Results Announced - Record Breaking Performance',
    slug: 'jee-advanced-2024-results-announced',
    summary: 'JEE Advanced 2024 results show unprecedented performance with over 40,000 students qualifying for IIT admissions.',
    fullContent: `# JEE Advanced 2024 Results Announced - Record Breaking Performance

The Joint Entrance Examination (JEE) Advanced 2024 results have been declared, marking a historic achievement in competitive examination performance.`,
    category: 'Exam',
    tags: ['JEE', 'IIT', 'Results', 'Engineering'],
    author: 'Education Desk',
    publishDate: '2024-01-15',
    readTime: 4,
    featured: true,
    priority: 1,
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
    sourceLink: 'https://example.com/jee-results',
    views: 15432,
    likes: 892,
    shares: 234,
    status: 'PUBLISHED',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    title: 'New Scholarship Program Launches for STEM Students',
    slug: 'new-scholarship-program-stem-students',
    summary: 'Government announces ₹500 crore scholarship initiative to support 10,000 STEM students annually.',
    fullContent: `# New Scholarship Program Launches for STEM Students

The Ministry of Education has announced a groundbreaking scholarship program.`,
    category: 'Scholarship',
    tags: ['Scholarship', 'STEM', 'Education', 'Government'],
    author: 'Policy Reporter',
    publishDate: '2024-01-14',
    readTime: 3,
    featured: false,
    priority: 2,
    imageUrl: 'https://images.unsplash.com/photo-1427751840561-9852520f8ce8?w=800&h=400&fit=crop',
    views: 8765,
    likes: 456,
    shares: 123,
    status: 'PUBLISHED',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  }
];

// Generate more mock articles
const generateMoreNews = (): NewsArticle[] => {
  const categories = ['Academic', 'Exam', 'Scholarship', 'Career', 'Technology', 'Sports', 'General'];
  const moreNews: NewsArticle[] = [];

  for (let i = 3; i <= 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    moreNews.push({
      id: i.toString(),
      title: `${category} News Update ${i}: Important Information for Students`,
      slug: `${category.toLowerCase()}-news-update-${i}`,
      summary: `Latest developments in ${category.toLowerCase()} sector affecting students across India.`,
      fullContent: `# ${category} News Update ${i}

This is a detailed article about the latest developments in the ${category.toLowerCase()} sector.`,
      category,
      tags: [category, 'News', 'Students', 'Update'],
      author: 'News Team',
      publishDate: new Date(2024, 0, Math.floor(Math.random() * 15) + 1).toISOString().split('T')[0],
      readTime: Math.floor(Math.random() * 5) + 2,
      featured: Math.random() > 0.8,
      priority: Math.floor(Math.random() * 5) + 1,
      imageUrl: `/placeholder.svg`,
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 500) + 50,
      shares: Math.floor(Math.random() * 200) + 20,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return moreNews;
};

// Complete news database
export const newsDatabase: NewsArticle[] = [...mockNewsData, ...generateMoreNews()];

// Mock API functions for development
export const newsAPI = {
  // Get all published news with pagination
  getNews: async (page = 1, limit = 20, category?: string): Promise<{ articles: NewsArticle[], total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = newsDatabase.filter(article => article.status === 'PUBLISHED');
    
    if (category && category !== 'all') {
      filtered = filtered.filter(article => article.category.toLowerCase() === category.toLowerCase());
    }
    
    filtered.sort((a, b) => {
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
    
    const start = (page - 1) * limit;
    const articles = filtered.slice(start, start + limit);
    
    return {
      articles,
      total: filtered.length
    };
  },

  // Get single article by slug
  getArticleBySlug: async (slug: string): Promise<NewsArticle | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const article = newsDatabase.find(article => 
      article.slug === slug && article.status === 'PUBLISHED'
    );
    
    if (article) {
      article.views += 1;
    }
    
    return article || null;
  },

  // Search articles
  searchNews: async (query: string): Promise<NewsArticle[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const searchTerm = query.toLowerCase();
    return newsDatabase.filter(article => 
      article.status === 'PUBLISHED' && (
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    ).slice(0, 10);
  },

  // Get featured articles
  getFeaturedNews: async (): Promise<NewsArticle[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return newsDatabase
      .filter(article => article.status === 'PUBLISHED' && article.featured)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5);
  },

  // Get trending articles  
  getTrendingNews: async (): Promise<NewsArticle[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return newsDatabase
      .filter(article => article.status === 'PUBLISHED')
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  },

  // Get all news
  getAllNews: async (): Promise<NewsArticle[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return newsDatabase.filter(article => article.status === 'PUBLISHED');
  },

  // Admin functions
  updateArticleStatus: async (id: string, status: 'DRAFT' | 'PUBLISHED'): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const article = newsDatabase.find(a => a.id === id);
    if (article) {
      article.status = status;
      article.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  },

  // PDF upload simulation
  uploadPDF: async (file: File): Promise<{ success: boolean, count: number, articles?: NewsArticle[] }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newArticles: NewsArticle[] = [];
    for (let i = 1; i <= 5; i++) {
      const article: NewsArticle = {
        id: Date.now().toString() + i,
        title: `PDF Import Article ${i}: News Update`,
        slug: `pdf-import-article-${Date.now()}-${i}`,
        summary: `This article was automatically extracted from the uploaded PDF.`,
        fullContent: `# PDF Import Article ${i}

This article was automatically extracted from the uploaded PDF document.`,
        category: ['Exam', 'Scholarship', 'Career', 'Academic', 'Technology'][i-1] as NewsArticle['category'],
        tags: ['PDF Import', 'Draft', 'Review Needed'],
        author: 'PDF Import System',
        publishDate: new Date().toISOString().split('T')[0],
        readTime: 3,
        featured: false,
        priority: 3,
        imageUrl: '/placeholder.svg',
        views: 0,
        likes: 0,
        shares: 0,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      newArticles.push(article);
      newsDatabase.unshift(article);
    }
    
    return {
      success: true,
      count: newArticles.length,
      articles: newArticles
    };
  }
};

// Utility functions
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'exam': 'bg-blue-500',
    'scholarship': 'bg-green-500',
    'career': 'bg-purple-500',
    'technology': 'bg-orange-500',
    'academic': 'bg-indigo-500',
    'sports': 'bg-red-500',
    'general': 'bg-gray-500'
  };
  return colors[category.toLowerCase()] || 'bg-gray-500';
};

export const getCategories = (): string[] => {
  return ['All', 'Academic', 'Exam', 'Scholarship', 'Career', 'Technology', 'Sports', 'General'];
};