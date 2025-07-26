import { NewsArticleView } from '@/src/components/News/NewsArticleView';

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  return <NewsArticleView slug={params.slug} />;
}