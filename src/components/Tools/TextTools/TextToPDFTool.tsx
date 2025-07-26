import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, RotateCcw, Eye, Upload } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const TextToPDFTool = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('helvetica');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      toast({
        title: "Invalid file type",
        description: "Please select a text file (.txt)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      setTitle(file.name.replace('.txt', ''));
    };
    reader.readAsText(file);
  };

  const generatePDF = async () => {
    if (!text.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text or upload a text file",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const pdfDoc = await PDFDocument.create();
      setProgress(20);

      // Set font based on selection
      let font;
      switch (fontFamily) {
        case 'times':
          font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
          break;
        case 'courier':
          font = await pdfDoc.embedFont(StandardFonts.Courier);
          break;
        default:
          font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      }

      setProgress(40);

      const pageWidth = 612; // Letter size width
      const pageHeight = 792; // Letter size height
      const margin = 72; // 1 inch margin
      const maxWidth = pageWidth - (margin * 2);
      const lineHeight = parseInt(fontSize) * 1.2;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let yPosition = pageHeight - margin;

      setProgress(60);

      // Add title if provided
      if (title.trim()) {
        page.drawText(title, {
          x: margin,
          y: yPosition,
          size: parseInt(fontSize) + 4,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight * 2;
      }

      // Split text into lines and words
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (yPosition < margin + lineHeight) {
          // Add new page if needed
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }

        if (line.trim() === '') {
          yPosition -= lineHeight;
          continue;
        }

        // Word wrapping
        const words = line.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, parseInt(fontSize));

          if (textWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              page.drawText(currentLine, {
                x: margin,
                y: yPosition,
                size: parseInt(fontSize),
                font,
                color: rgb(0, 0, 0),
              });
              yPosition -= lineHeight;
              
              if (yPosition < margin + lineHeight) {
                page = pdfDoc.addPage([pageWidth, pageHeight]);
                yPosition = pageHeight - margin;
              }
            }
            currentLine = word;
          }
        }

        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: parseInt(fontSize),
            font,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
        }
      }

      setProgress(80);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setPdfUrl(url);
      setProgress(100);
      
      toast({
        title: "PDF generated successfully!",
        description: "Your text has been converted to PDF format"
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Generation failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${title || 'text-document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setText('');
    setTitle('');
    setPdfUrl(null);
    setProgress(0);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Text to PDF Converter
          </CardTitle>
          <p className="text-foreground-secondary">
            Convert plain text to a formatted PDF document. Type directly or upload a .txt file.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Option */}
          <div className="border border-dashed border-border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                id="txt-upload"
              />
              <label htmlFor="txt-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Text File
                  </span>
                </Button>
              </label>
              <span className="text-sm text-foreground-secondary">
                Or type your text directly below
              </span>
            </div>
          </div>

          {/* Document Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title">Document Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
              />
            </div>
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10pt</SelectItem>
                  <SelectItem value="11">11pt</SelectItem>
                  <SelectItem value="12">12pt</SelectItem>
                  <SelectItem value="14">14pt</SelectItem>
                  <SelectItem value="16">16pt</SelectItem>
                  <SelectItem value="18">18pt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="helvetica">Helvetica</SelectItem>
                  <SelectItem value="times">Times Roman</SelectItem>
                  <SelectItem value="courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Text Input Area */}
          <div className="space-y-2">
            <Label htmlFor="text">Text Content</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="min-h-[300px] font-mono"
            />
            <div className="flex justify-between text-sm text-foreground-secondary">
              <span>{charCount} characters</span>
              <span>{wordCount} words</span>
            </div>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating PDF...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={generatePDF}
              disabled={!text.trim() || isProcessing}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
            
            {text && (
              <Button
                variant="outline"
                onClick={resetTool}
                disabled={isProcessing}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>

          {/* Download Section */}
          {pdfUrl && (
            <Card className="bg-background-secondary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-600">✓ PDF Generated!</h4>
                    <p className="text-sm text-foreground-secondary">
                      Your text has been converted to PDF format
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open(pdfUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={downloadPDF}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};