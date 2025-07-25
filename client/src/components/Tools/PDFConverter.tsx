import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye,
  FileImage,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversionResult {
  success: boolean;
  download_id?: string;
  expiry_time?: number;
  file_size?: number;
  pdf_type?: string;
  pages?: number;
  expires_in_minutes?: number;
  error?: string;
}

interface DownloadStatus {
  success: boolean;
  expired?: boolean;
  time_remaining_seconds?: number;
  time_remaining_minutes?: number;
  file_size?: number;
  error?: string;
}

export const PDFConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, []);

  // Monitor download status
  const checkDownloadStatus = useCallback(async (downloadId: string) => {
    try {
      const response = await fetch(`/api/pdf-converter/status/${downloadId}`);
      const status: DownloadStatus = await response.json();
      
      setDownloadStatus(status);
      
      if (status.success && status.time_remaining_seconds) {
        setTimeRemaining(status.time_remaining_seconds);
      } else if (status.expired) {
        setTimeRemaining(0);
        if (statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current);
        }
        toast({
          title: "Link Expired",
          description: "The download link has expired. Please convert the file again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Status check failed:', error);
    }
  }, [toast]);

  // Start status monitoring
  const startStatusMonitoring = useCallback((downloadId: string) => {
    // Check status immediately
    checkDownloadStatus(downloadId);
    
    // Then check every 10 seconds
    statusIntervalRef.current = setInterval(() => {
      checkDownloadStatus(downloadId);
    }, 10000);
  }, [checkDownloadStatus]);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a PDF file smaller than 50MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setConversionResult(null);
    setDownloadStatus(null);
    setTimeRemaining(0);
    
    // Clear any existing status monitoring
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const simulateProgress = () => {
    setConversionProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) {
        setConversionProgress(95);
        clearInterval(interval);
      } else {
        setConversionProgress(progress);
      }
    }, 500);
    return interval;
  };

  const convertToWord = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/pdf-converter/upload', {
        method: 'POST',
        body: formData,
      });

      const result: ConversionResult = await response.json();
      
      clearInterval(progressInterval);
      setConversionProgress(100);

      if (result.success && result.download_id) {
        setConversionResult(result);
        startStatusMonitoring(result.download_id);
        
        toast({
          title: "Conversion Successful!",
          description: `Your PDF has been converted to Word format. ${result.pages} pages processed.`,
        });
      } else {
        throw new Error(result.error || 'Conversion failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setConversionProgress(0);
      
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const downloadFile = async () => {
    if (!conversionResult?.download_id) return;

    try {
      const response = await fetch(`/api/pdf-converter/download/${conversionResult.download_id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Get the blob and filename
      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'converted.docx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your converted Word document is downloading.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : 'Download failed.',
        variant: "destructive"
      });
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setConversionResult(null);
    setDownloadStatus(null);
    setConversionProgress(0);
    setTimeRemaining(0);
    
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="card-feature">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            PDF to Word Converter
          </CardTitle>
          <p className="text-foreground-secondary">
            Convert PDF files to editable Word documents with OCR support for scanned PDFs.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          {!selectedFile && (
            <div
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${isDragOver 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-border hover:border-primary/50'
                }
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Drop your PDF here</p>
                  <p className="text-foreground-secondary">or click to browse files</p>
                </div>
                <Badge variant="secondary">Max 50MB • PDF only</Badge>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}

          {/* Selected File Info */}
          {selectedFile && !conversionResult && (
            <Card className="bg-background-secondary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-foreground-secondary">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={convertToWord}
                      disabled={isConverting}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      {isConverting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Convert to Word
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetConverter}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversion Progress */}
          {isConverting && (
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Converting your PDF...</p>
                    <span className="text-sm text-foreground-secondary">
                      {Math.round(conversionProgress)}%
                    </span>
                  </div>
                  <Progress value={conversionProgress} className="h-2" />
                  <div className="flex items-center space-x-2 text-sm text-foreground-secondary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing PDF content and generating Word document...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversion Success */}
          {conversionResult?.success && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Conversion Completed!</p>
                      <p className="text-sm text-green-600">
                        {conversionResult.pages} pages • {conversionResult.pdf_type} PDF • 
                        {conversionResult.file_size && ` ${formatFileSize(conversionResult.file_size)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedFile?.name?.replace('.pdf', '_converted.docx') || 'converted.docx'}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-foreground-secondary">
                          <Clock className="h-3 w-3" />
                          <span>
                            Expires in: {timeRemaining > 0 ? formatTimeRemaining(timeRemaining) : 'Expired'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={downloadFile}
                        disabled={downloadStatus?.expired || timeRemaining <= 0}
                        className="bg-gradient-secondary hover:opacity-90"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Word
                      </Button>
                      <Button variant="outline" onClick={resetConverter}>
                        Convert Another
                      </Button>
                    </div>
                  </div>

                  {/* Download expired warning */}
                  {(downloadStatus?.expired || timeRemaining <= 0) && (
                    <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-orange-800">
                        Download link has expired. Please convert the file again.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Features Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-feature">
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Smart Detection</h3>
            <p className="text-sm text-foreground-secondary">
              Automatically detects text-based vs scanned PDFs
            </p>
          </CardContent>
        </Card>

        <Card className="card-feature">
          <CardContent className="p-4 text-center">
            <FileImage className="h-8 w-8 mx-auto mb-3 text-secondary" />
            <h3 className="font-semibold mb-2">OCR Support</h3>
            <p className="text-sm text-foreground-secondary">
              Extracts text from scanned PDFs using advanced OCR
            </p>
          </CardContent>
        </Card>

        <Card className="card-feature">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-3 text-accent" />
            <h3 className="font-semibold mb-2">Auto-Expiry</h3>
            <p className="text-sm text-foreground-secondary">
              Secure 4-minute download window for privacy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};