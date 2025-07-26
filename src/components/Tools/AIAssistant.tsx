import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { GeminiService } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  context?: string;
  taskType?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  context = '', 
  taskType = 'general' 
}) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what you need help with",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let fullPrompt = prompt;
      
      if (context) {
        fullPrompt = `Context: ${context}\n\nTask: ${prompt}`;
      }

      const result = await GeminiService.generateContent({ prompt: fullPrompt });
      setResponse(result.result);
      
      toast({
        title: "AI Response Generated",
        description: "Your request has been processed successfully"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Response has been copied successfully"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const getSuggestions = () => {
    switch (taskType) {
      case 'pdf':
        return [
          "How can I optimize this PDF for web viewing?",
          "What's the best way to extract text from this PDF?",
          "How do I maintain quality when compressing this PDF?"
        ];
      case 'image':
        return [
          "What's the optimal compression settings for web images?",
          "How can I resize this image without losing quality?",
          "What format should I use for this type of image?"
        ];
      default:
        return [
          "Help me improve my document workflow",
          "What are best practices for file conversion?",
          "How can I automate repetitive tasks?"
        ];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Assistant
          <Badge variant="secondary">Powered by Gemini</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Ask me anything about file processing, conversion tips, or technical guidance..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {getSuggestions().map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(suggestion)}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !prompt.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Response
            </>
          )}
        </Button>

        {response && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">AI Response</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm whitespace-pre-wrap bg-background p-3 rounded-md border">
                {response}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};