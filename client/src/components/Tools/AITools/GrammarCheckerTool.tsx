import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCheck, Copy, Download, Wand2, RefreshCw, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const GrammarCheckerTool = () => {
  const [text, setText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!text.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter some text to check",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await fetch('/api/ai-tools/grammar-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
        setCorrectedText(data.correctedText);
        setProgress(100);
        toast({
          title: "Grammar Check Complete!",
          description: `Found and fixed grammar issues in ${data.wordCount} words`
        });
      } else {
        throw new Error(data.error || 'Grammar check failed');
      }
    } catch (error) {
      console.error('Grammar check error:', error);
      toast({
        title: "Grammar Check Failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied to Clipboard!",
        description: "Text has been copied successfully"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the text manually",
        variant: "destructive"
      });
    }
  };

  const downloadAsText = () => {
    if (!correctedText) return;
    
    const blob = new Blob([correctedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corrected_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setText('');
    setCorrectedText('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <ClipboardCheck className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-2xl font-bold gradient-text">Grammar Checker</h2>
        <p className="text-muted-foreground">Fix grammar, spelling, and improve your writing with AI</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Enter Your Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste or type your text here to check for grammar and spelling errors..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={isProcessing}
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleCheck}
              disabled={isProcessing || !text.trim()}
              className="btn-primary"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking Grammar...
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Check Grammar
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing your text...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Grammar Check Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Original Text
                  <Badge variant="outline">{results.wordCount} words</Badge>
                </h4>
                <div className="bg-muted/50 p-3 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{results.originalText}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-green-600">Corrected Text</h4>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{correctedText}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => copyToClipboard(correctedText)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Corrected Text
              </Button>
              
              <Button variant="outline" onClick={downloadAsText}>
                <Download className="w-4 h-4 mr-2" />
                Download as TXT
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};