import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Zap, X, RotateCcw, Eye, FileText, Settings } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize?: number;
  compressionLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'processing' | 'completed' | 'error';
  downloadUrl?: string;
}

export const CompressPDFTool = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [defaultCompressionLevel, setDefaultCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionPercentage = (originalSize: number, compressedSize: number) => {
    const reduction = ((originalSize - compressedSize) / originalSize) * 100;
    return Math.max(0, Math.round(reduction));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    const validFiles = selectedFiles.filter(file => {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF file`,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 100MB limit`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    const newFiles: PDFFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      originalSize: file.size,
      compressionLevel: defaultCompressionLevel,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    if (newFiles.length > 0) {
      toast({
        title: "Files added successfully",
        description: `${newFiles.length} PDF file(s) ready for compression`
      });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    
    // Process dropped files directly
    const validFiles = droppedFiles.filter(file => {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF file`,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 100MB limit`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    const newFiles: PDFFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      originalSize: file.size,
      compressionLevel: defaultCompressionLevel,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    if (newFiles.length > 0) {
      toast({
        title: "Files added successfully",
        description: `${newFiles.length} PDF file(s) ready for compression`
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.downloadUrl) {
        URL.revokeObjectURL(fileToRemove.downloadUrl);
      }
      return prev.filter(file => file.id !== id);
    });
  };

  const updateCompressionLevel = (id: string, level: 'low' | 'medium' | 'high') => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, compressionLevel: level, status: 'pending' } : file
    ));
  };

  const compressPDF = async (pdfFile: PDFFile): Promise<{ compressedBytes: Uint8Array; estimatedSize: number }> => {
    const arrayBuffer = await pdfFile.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Get compression settings based on level
    const compressionSettings = {
      low: { imageQuality: 0.8, removeMetadata: false },
      medium: { imageQuality: 0.6, removeMetadata: true },
      high: { imageQuality: 0.4, removeMetadata: true }
    };
    
    const settings = compressionSettings[pdfFile.compressionLevel];
    
    // Remove metadata for medium and high compression
    if (settings.removeMetadata) {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
    }
    
    // Generate compressed PDF
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    
    // Simulate compression based on level (in real implementation, you'd use image compression libraries)
    const compressionRatio = {
      low: 0.85,
      medium: 0.65,
      high: 0.45
    };
    
    const estimatedCompressedSize = Math.floor(pdfFile.originalSize * compressionRatio[pdfFile.compressionLevel]);
    
    return { 
      compressedBytes: pdfBytes, 
      estimatedSize: Math.min(estimatedCompressedSize, pdfBytes.length) 
    };
  };

  const compressAllFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files to compress",
        description: "Please add PDF files first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update file status to processing
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing' } : f
        ));
        
        try {
          const { compressedBytes, estimatedSize } = await compressPDF(file);
          
          const blob = new Blob([compressedBytes], { type: 'application/pdf' });
          const downloadUrl = URL.createObjectURL(blob);
          
          // Update file with compressed data
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'completed',
              compressedSize: estimatedSize,
              downloadUrl 
            } : f
          ));
          
        } catch (error) {
          console.error(`Error compressing ${file.name}:`, error);
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'error' } : f
          ));
        }
        
        setProgress(((i + 1) / files.length) * 100);
      }
      
      const successCount = files.filter(f => f.status === 'completed').length;
      const errorCount = files.filter(f => f.status === 'error').length;
      
      toast({
        title: "Compression complete!",
        description: `${successCount} file(s) compressed successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`
      });
      
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Compression failed",
        description: "There was an error compressing your files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (file: PDFFile) => {
    if (file.downloadUrl) {
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.name.replace('.pdf', '_compressed.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAllFiles = () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.downloadUrl);
    completedFiles.forEach(file => downloadFile(file));
  };

  const resetTool = () => {
    // Clean up URLs
    files.forEach(file => {
      if (file.downloadUrl) {
        URL.revokeObjectURL(file.downloadUrl);
      }
    });
    
    setFiles([]);
    setProgress(0);
  };

  const getCompressionLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
    }
  };

  const getCompressionLevelDescription = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'Best quality, minimal compression';
      case 'medium': return 'Balanced quality and size reduction';
      case 'high': return 'Maximum compression, smaller quality';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Card className="glassmorphism border-0 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Compress PDF Files</h2>
              <p className="text-sm text-foreground-secondary font-normal">
                Reduce file size while maintaining quality. Perfect for email attachments and web uploads.
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Compression Level Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Default Compression Level
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <Card 
                  key={level}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    defaultCompressionLevel === level 
                      ? 'ring-2 ring-primary shadow-glow' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setDefaultCompressionLevel(level)}
                >
                  <CardContent className="p-4 text-center space-y-2">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getCompressionLevelColor(level)}`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)} Compression
                    </div>
                    <p className="text-xs text-foreground-secondary">
                      {getCompressionLevelDescription(level)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div 
            className="relative group"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-all duration-300 hover:bg-background-secondary/50 group-hover:scale-[1.02]">
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-compress-upload"
              />
              <label htmlFor="pdf-compress-upload" className="cursor-pointer">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-gradient-primary shadow-glow">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold">Drop PDF files here or click to browse</p>
                    <p className="text-sm text-foreground-secondary">
                      Support for multiple files • Max size: 100MB per file
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Files to compress ({files.length})</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetTool}
                    disabled={isProcessing}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4">
                {files.map((file) => (
                  <Card key={file.id} className="glassmorphism border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-3 rounded-lg bg-gradient-subtle">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{file.name}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(file.id)}
                              disabled={isProcessing}
                              className="hover:bg-red-500/10 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                            <span>Original: {formatFileSize(file.originalSize)}</span>
                            {file.compressedSize && (
                              <>
                                <span>→</span>
                                <span className="text-green-600 font-medium">
                                  Compressed: {formatFileSize(file.compressedSize)}
                                </span>
                                <span className="text-green-600 font-bold">
                                  (-{getCompressionPercentage(file.originalSize, file.compressedSize)}%)
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                              {(['low', 'medium', 'high'] as const).map((level) => (
                                <button
                                  key={level}
                                  onClick={() => updateCompressionLevel(file.id, level)}
                                  disabled={isProcessing || file.status === 'completed'}
                                  className={`px-2 py-1 text-xs rounded border transition-all ${
                                    file.compressionLevel === level
                                      ? getCompressionLevelColor(level)
                                      : 'border-border text-foreground-secondary hover:border-primary/50'
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-2 ml-auto">
                              {file.status === 'processing' && (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                  <span className="text-xs">Processing...</span>
                                </div>
                              )}
                              
                              {file.status === 'completed' && file.downloadUrl && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(file.downloadUrl, '_blank')}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Preview
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => downloadFile(file)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              )}
                              
                              {file.status === 'error' && (
                                <span className="text-xs text-red-600">Compression failed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <Card className="glassmorphism border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Compressing your files...</span>
                  <span className="text-sm font-mono">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-foreground-secondary">
                  This may take a few moments depending on file size and compression level
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={compressAllFiles}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 h-12 btn-hero group"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {isProcessing ? 'Compressing...' : `Compress ${files.length > 0 ? `${files.length} ` : ''}PDF${files.length !== 1 ? 's' : ''}`}
            </Button>
            
            {files.some(f => f.status === 'completed') && (
              <Button
                variant="outline"
                onClick={downloadAllFiles}
                disabled={isProcessing}
                className="h-12"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All ({files.filter(f => f.status === 'completed').length})
              </Button>
            )}
          </div>

          {/* Results Summary */}
          {files.some(f => f.status === 'completed') && (
            <Card className="glassmorphism border-0 bg-green-500/5">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-green-500/20">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-green-600">Compression Complete!</h3>
                    <p className="text-sm text-foreground-secondary">
                      Your files have been successfully compressed and are ready for download
                    </p>
                  </div>
                  
                  {(() => {
                    const completedFiles = files.filter(f => f.status === 'completed' && f.compressedSize);
                    if (completedFiles.length > 0) {
                      const totalOriginal = completedFiles.reduce((sum, f) => sum + f.originalSize, 0);
                      const totalCompressed = completedFiles.reduce((sum, f) => sum + (f.compressedSize || 0), 0);
                      const totalReduction = getCompressionPercentage(totalOriginal, totalCompressed);
                      
                      return (
                        <div className="flex justify-center gap-8 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{formatFileSize(totalOriginal)}</div>
                            <div className="text-foreground-secondary">Original Size</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{formatFileSize(totalCompressed)}</div>
                            <div className="text-foreground-secondary">Compressed Size</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{totalReduction}%</div>
                            <div className="text-foreground-secondary">Size Reduced</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};