import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: {
        slug: params.slug,
        status: 'PUBLISHED'
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.newsArticle.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } }
    });

    // Parse tags
    const processedArticle = {
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : []
    };

    return NextResponse.json(processedArticle);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}