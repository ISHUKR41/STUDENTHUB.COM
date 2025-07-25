import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Upload, Download, ArrowRight, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const FileConverterTool = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const supportedFormats = {
    'PDF': ['txt', 'docx'],
    'DOCX': ['pdf', 'txt'],
    'TXT': ['pdf', 'docx'],
    'XLSX': ['pdf', 'csv'],
    'CSV': ['xlsx', 'txt'],
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const getAvailableFormats = () => {
    if (!selectedFile) return [];
    const ext = getFileExtension(selectedFile.name);
    return supportedFormats[ext as keyof typeof supportedFormats] || [];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = getFileExtension(file.name);
    if (!supportedFormats[ext as keyof typeof supportedFormats]) {
      toast({
        title: "Unsupported File Type",
        description: "Please select a PDF, DOCX, TXT, XLSX, or CSV file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setTargetFormat('');
    setResults(null);
  };

  const handleConvert = async () => {
    if (!selectedFile || !targetFormat) {
      toast({
        title: "Missing Information",
        description: "Please select a file and target format",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('targetFormat', targetFormat);

      const response = await fetch('/api/file-tools/convert-format', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
        setProgress(100);
        toast({
          title: "Conversion Complete!",
          description: `Successfully converted ${data.sourceFormat} to ${data.targetFormat.toUpperCase()}`
        });
      } else {
        throw new Error(data.error || 'File conversion failed');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadResult = async () => {
    if (!results) return;

    try {
      const response = await fetch(`/api/file-tools/download/${results.sessionId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = results.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setTargetFormat('');
    setResults(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <RefreshCw className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-2xl font-bold gradient-text">File Converter</h2>
        <p className="text-muted-foreground">Convert between different file formats easily</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Select File to Convert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <div className="text-center space-y-4">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your file here, or click to browse
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx,.txt,.xlsx,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOCX, TXT, XLSX, CSV (max 50MB)
              </p>
            </div>
          </div>

          {selectedFile && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{selectedFile.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • {getFileExtension(selectedFile.name)} format
                    </p>
                  </div>
                  <Badge variant="outline">
                    {getFileExtension(selectedFile.name)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Badge variant="secondary" className="px-4 py-2">
                  {getFileExtension(selectedFile.name)}
                </Badge>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="flex-1 max-w-xs">
                  <Select value={targetFormat} onValueChange={setTargetFormat} disabled={isProcessing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target format" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableFormats().map((format) => (
                        <SelectItem key={format} value={format}>
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleConvert}
              disabled={isProcessing || !selectedFile || !targetFormat}
              className="btn-primary"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Convert File
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
                <span>Converting your file...</span>
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
              <Download className="w-5 h-5" />
              Conversion Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg text-center">
              <div>
                <div className="text-sm text-muted-foreground">Original</div>
                <div className="font-bold">{results.sourceFormat.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Converted</div>
                <div className="font-bold text-green-600">{results.targetFormat.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Original Size</div>
                <div className="font-bold">{formatFileSize(results.originalSize)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">New Size</div>
                <div className="font-bold">{formatFileSize(results.convertedSize)}</div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-600">Ready for Download</h4>
              <p className="text-sm text-muted-foreground mb-3">
                File: {results.fileName}
              </p>
              <Button onClick={downloadResult} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Converted File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};