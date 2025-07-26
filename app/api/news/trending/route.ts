import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const trendingArticles = await prisma.newsArticle.findMany({
      where: {
        status: 'PUBLISHED'
      },
      orderBy: [
        { views: 'desc' },
        { likes: 'desc' },
        { shares: 'desc' }
      ],
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        category: true,
        views: true,
        likes: true,
        publishDate: true,
        imageUrl: true
      }
    });

    return NextResponse.json(trendingArticles);
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending news' },
      { status: 500 }
    );
  }
}