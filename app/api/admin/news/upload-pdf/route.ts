import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parsePDFToNews, generateSlug } from '@/lib/parsePDF';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Please upload a valid PDF file' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const newsItems = await parsePDFToNews(buffer);

    let successCount = 0;
    const errors: string[] = [];

    for (const item of newsItems) {
      try {
        const slug = generateSlug(item.title);
        
        // Check if article with similar title already exists
        const existing = await prisma.newsArticle.findFirst({
          where: {
            title: {
              contains: item.title.substring(0, 50),
              mode: 'insensitive'
            }
          }
        });

        if (!existing) {
          await prisma.newsArticle.create({
            data: {
              title: item.title,
              slug,
              summary: item.summary,
              fullContent: item.fullContent,
              category: item.category,
              tags: JSON.stringify(item.tags),
              status: 'DRAFT',
              pdfFile: file.name,
              publishDate: new Date()
            }
          });
          successCount++;
        }
      } catch (error) {
        errors.push(`Failed to create article: ${item.title}`);
        console.error('Error creating article:', error);
      }
    }

    return NextResponse.json({
      success: true,
      count: successCount,
      total: newsItems.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}