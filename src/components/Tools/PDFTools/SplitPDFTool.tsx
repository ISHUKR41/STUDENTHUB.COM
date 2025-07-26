import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Scissors, RotateCcw, Eye, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface SplitRange {
  id: string;
  name: string;
  startPage: number;
  endPage: number;
}

export const SplitPDFTool = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitRanges, setSplitRanges] = useState<SplitRange[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitFiles, setSplitFiles] = useState<{ name: string; url: string }[]>([]);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      setOriginalFile(file);
      setTotalPages(pageCount);
      setSplitRanges([]);
      setSplitFiles([]);
      
      toast({
        title: "PDF loaded successfully",
        description: `Document has ${pageCount} pages`
      });
    } catch (error) {
      toast({
        title: "Error loading PDF",
        description: "The selected file might be corrupted or password protected",
        variant: "destructive"
      });
    }
  };

  const addSplitRange = () => {
    const newRange: SplitRange = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Split ${splitRanges.length + 1}`,
      startPage: 1,
      endPage: totalPages
    };
    setSplitRanges([...splitRanges, newRange]);
  };

  const updateSplitRange = (id: string, field: keyof Omit<SplitRange, 'id'>, value: string | number) => {
    setSplitRanges(ranges => 
      ranges.map(range => 
        range.id === id ? { ...range, [field]: value } : range
      )
    );
  };

  const removeSplitRange = (id: string) => {
    setSplitRanges(ranges => ranges.filter(range => range.id !== id));
  };

  const splitPDF = async () => {
    if (!originalFile || splitRanges.length === 0) {
      toast({
        title: "No split ranges defined",
        description: "Please add at least one split range",
        variant: "destructive"
      });
      return;
    }

    // Validate ranges
    for (const range of splitRanges) {
      if (range.startPage < 1 || range.endPage > totalPages || range.startPage > range.endPage) {
        toast({
          title: "Invalid page range",
          description: `Check the range for "${range.name}". Pages must be between 1 and ${totalPages}.`,
          variant: "destructive"
        });
        return;
      }
    }

    setIsProcessing(true);
    setProgress(0);
    setSplitFiles([]);

    try {
      const arrayBuffer = await originalFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newSplitFiles: { name: string; url: string }[] = [];
      
      for (let i = 0; i < splitRanges.length; i++) {
        const range = splitRanges[i];
        setProgress((i / splitRanges.length) * 80);
        
        const newPdf = await PDFDocument.create();
        const pageIndices = [];
        
        for (let pageNum = range.startPage - 1; pageNum < range.endPage; pageNum++) {
          pageIndices.push(pageNum);
        }
        
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        newSplitFiles.push({
          name: `${range.name}.pdf`,
          url: url
        });
      }
      
      setSplitFiles(newSplitFiles);
      setProgress(100);
      
      toast({
        title: "PDF split successfully!",
        description: `Created ${splitRanges.length} separate PDF files`
      });
      
    } catch (error) {
      console.error('Error splitting PDF:', error);
      toast({
        title: "Split failed",
        description: "There was an error splitting your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (file: { name: string; url: string }) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllFiles = () => {
    splitFiles.forEach(file => downloadFile(file));
  };

  const resetTool = () => {
    setOriginalFile(null);
    setTotalPages(0);
    setSplitRanges([]);
    setSplitFiles([]);
    setProgress(0);
    
    // Clean up URLs
    splitFiles.forEach(file => URL.revokeObjectURL(file.url));
  };

  const quickSplitOptions = [
    {
      label: "Split every page",
      action: () => {
        const ranges: SplitRange[] = [];
        for (let i = 1; i <= totalPages; i++) {
          ranges.push({
            id: Math.random().toString(36).substr(2, 9),
            name: `Page ${i}`,
            startPage: i,
            endPage: i
          });
        }
        setSplitRanges(ranges);
      }
    },
    {
      label: "Split in half",
      action: () => {
        const mid = Math.ceil(totalPages / 2);
        setSplitRanges([
          {
            id: Math.random().toString(36).substr(2, 9),
            name: "First Half",
            startPage: 1,
            endPage: mid
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            name: "Second Half",
            startPage: mid + 1,
            endPage: totalPages
          }
        ]);
      }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            Split PDF
          </CardTitle>
          <p className="text-foreground-secondary">
            Extract specific pages or split PDF into multiple files with custom page ranges.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          {!originalFile && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-foreground-secondary mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop a PDF file here or click to browse</p>
                <p className="text-sm text-foreground-secondary">Only PDF files are supported</p>
              </label>
            </div>
          )}

          {/* PDF Info and Quick Actions */}
          {originalFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{originalFile.name}</h3>
                  <p className="text-sm text-foreground-secondary">
                    {totalPages} pages • {(originalFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="outline" onClick={resetTool}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Change File
                </Button>
              </div>

              {/* Quick Split Options */}
              <div className="space-y-2">
                <Label>Quick Split Options</Label>
                <div className="flex gap-2 flex-wrap">
                  {quickSplitOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={option.action}
                      disabled={totalPages === 0}
                    >
                      {option.label}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSplitRange}
                  >
                    Add Custom Range
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Split Ranges */}
          {splitRanges.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Split Ranges ({splitRanges.length})</h3>
              {splitRanges.map((range) => (
                <div key={range.id} className="grid grid-cols-12 gap-3 p-3 border rounded-lg items-end">
                  <div className="col-span-4">
                    <Label htmlFor={`name-${range.id}`}>File Name</Label>
                    <Input
                      id={`name-${range.id}`}
                      value={range.name}
                      onChange={(e) => updateSplitRange(range.id, 'name', e.target.value)}
                      placeholder="File name"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`start-${range.id}`}>Start Page</Label>
                    <Input
                      id={`start-${range.id}`}
                      type="number"
                      min="1"
                      max={totalPages}
                      value={range.startPage}
                      onChange={(e) => updateSplitRange(range.id, 'startPage', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`end-${range.id}`}>End Page</Label>
                    <Input
                      id={`end-${range.id}`}
                      type="number"
                      min="1"
                      max={totalPages}
                      value={range.endPage}
                      onChange={(e) => updateSplitRange(range.id, 'endPage', parseInt(e.target.value) || totalPages)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSplitRange(range.id)}
                      className="w-full"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Splitting PDF...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          {originalFile && (
            <div className="flex gap-3">
              <Button
                onClick={splitPDF}
                disabled={splitRanges.length === 0 || isProcessing}
                className="flex-1"
              >
                <Scissors className="w-4 h-4 mr-2" />
                Split PDF
              </Button>
              
              {splitRanges.length === 0 && (
                <Button
                  variant="outline"
                  onClick={addSplitRange}
                >
                  Add Range
                </Button>
              )}
            </div>
          )}

          {/* Results Section */}
          {splitFiles.length > 0 && (
            <Card className="bg-background-secondary">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-600">✓ Split Complete!</h4>
                    <p className="text-sm text-foreground-secondary">
                      {splitFiles.length} files created from your PDF
                    </p>
                  </div>
                  <Button onClick={downloadAllFiles}>
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {splitFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => downloadFile(file)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};