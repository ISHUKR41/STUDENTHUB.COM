import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import { newsAPI, NewsArticle } from '@/lib/newsData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const allArticles = await newsAPI.getAllNews();
      setArticles(allArticles);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load articles", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast({ title: "Error", description: "Please select a PDF file", variant: "destructive" });
      return;
    }

    try {
      setUploading(true);
      const result = await newsAPI.uploadPDF(file);
      
      if (result.success) {
        toast({ title: "Success", description: `${result.count} articles imported from PDF` });
        await loadArticles();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload PDF", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'DRAFT' | 'PUBLISHED') => {
    try {
      await newsAPI.updateArticleStatus(id, status);
      toast({ title: "Success", description: `Article ${status.toLowerCase()}` });
      await loadArticles();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-4">News Admin Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <label className="btn-hero cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload PDF'}
              <input
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </motion.header>

        <motion.div 
          className="bg-card border border-border rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">All Articles</h2>
            <p className="text-muted-foreground">Manage and review news articles</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Views</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-border hover:bg-muted/25">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-foreground line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          By {article.author} • {new Date(article.publishDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{article.category}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {article.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {article.views.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {article.status === 'DRAFT' ? (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleStatusChange(article.id, 'PUBLISHED')}
                          >
                            <CheckCircle className="w-4 h-4 text-success" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleStatusChange(article.id, 'DRAFT')}
                          >
                            <FileText className="w-4 h-4 text-warning" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};