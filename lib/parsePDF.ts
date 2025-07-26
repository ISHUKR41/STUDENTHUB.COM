import pdf from 'pdf-parse';

export interface ParsedNewsItem {
  title: string;
  summary: string;
  fullContent: string;
  category: string;
  tags: string[];
}

export async function parsePDFToNews(buffer: Buffer): Promise<ParsedNewsItem[]> {
  try {
    const data = await pdf(buffer);
    const text = data.text;
    
    // Split the PDF content into sections
    // This is a basic parser - in production, you'd want more sophisticated parsing
    const sections = text.split(/\n\s*\n/).filter(section => section.trim().length > 50);
    
    const newsItems: ParsedNewsItem[] = [];
    
    for (let i = 0; i < sections.length && newsItems.length < 50; i++) {
      const section = sections[i].trim();
      
      // Extract title (first line or first sentence)
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) continue;
      
      let title = lines[0].trim();
      if (title.length > 150) {
        // If first line is too long, take first sentence
        const firstSentence = title.split('.')[0];
        title = firstSentence.length > 10 ? firstSentence : title.substring(0, 150);
      }
      
      // Create summary (first 2-3 sentences or first 250 chars)
      const summary = createSummary(section);
      
      // Determine category based on keywords
      const category = determineCategory(section);
      
      // Extract tags
      const tags = extractTags(section);
      
      newsItems.push({
        title: cleanTitle(title),
        summary,
        fullContent: section,
        category,
        tags
      });
    }
    
    return newsItems;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF');
  }
}

function createSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  if (sentences.length === 0) return content.substring(0, 200) + '...';
  
  let summary = sentences[0].trim();
  if (sentences.length > 1 && summary.length < 150) {
    summary += '. ' + sentences[1].trim();
  }
  
  if (summary.length > 300) {
    summary = summary.substring(0, 297) + '...';
  }
  
  return summary + (summary.endsWith('.') ? '' : '.');
}

function determineCategory(content: string): string {
  const contentLower = content.toLowerCase();
  
  const categories = {
    'Technology': ['tech', 'ai', 'artificial intelligence', 'software', 'digital', 'cyber', 'app', 'platform', 'innovation'],
    'Education': ['school', 'university', 'college', 'student', 'learn', 'education', 'academic', 'study', 'course', 'exam'],
    'Career': ['job', 'career', 'employment', 'internship', 'hiring', 'work', 'professional', 'salary', 'interview'],
    'Scholarship': ['scholarship', 'grant', 'funding', 'financial aid', 'award', 'fellowship', 'bursary'],
    'Research': ['research', 'study', 'analysis', 'discovery', 'investigation', 'findings', 'publication'],
    'Sports': ['sport', 'game', 'match', 'tournament', 'championship', 'athlete', 'team', 'competition'],
    'Health': ['health', 'medical', 'wellness', 'fitness', 'mental health', 'healthcare', 'medicine'],
    'Science': ['science', 'scientific', 'experiment', 'laboratory', 'biology', 'chemistry', 'physics']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (contentLower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'General';
}

function extractTags(content: string): string[] {
  const contentLower = content.toLowerCase();
  const allTags = [
    'breaking', 'trending', 'important', 'urgent', 'update', 'new', 'latest',
    'technology', 'education', 'career', 'scholarship', 'research', 'sports',
    'health', 'science', 'innovation', 'study', 'student', 'university',
    'college', 'academic', 'professional', 'development', 'opportunity'
  ];
  
  const foundTags = allTags.filter(tag => contentLower.includes(tag));
  return foundTags.slice(0, 5); // Limit to 5 tags
}

function cleanTitle(title: string): string {
  // Remove common PDF artifacts and clean title
  return title
    .replace(/^\d+\.\s*/, '') // Remove leading numbers
    .replace(/^[•\-\*]\s*/, '') // Remove bullet points
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}