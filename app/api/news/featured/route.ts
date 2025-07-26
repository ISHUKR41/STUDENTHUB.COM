import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const featuredArticles = await prisma.newsArticle.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true
      },
      orderBy: [
        { priority: 'desc' },
        { publishDate: 'desc' }
      ],
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        category: true,
        tags: true,
        author: true,
        publishDate: true,
        readTime: true,
        views: true,
        likes: true,
        shares: true,
        imageUrl: true,
        featured: true
      }
    });

    const processedArticles = featuredArticles.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : []
    }));

    return NextResponse.json(processedArticles);
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured news' },
      { status: 500 }
    );
  }
}