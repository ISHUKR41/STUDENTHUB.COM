import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, FileText, X, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WordToPDFTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadInfo, setDownloadInfo] = useState<{
    id: string;
    fileName: string;
    expiryTime: number;
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith('.docx')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a DOCX file only.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 50MB.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      const mockEvent = {
        target: { files: [droppedFile] }
      } as any;
      handleFileSelect(mockEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const convertFile = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await fetch('/api/word-to-pdf-converter/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      if (result.success) {
        setDownloadInfo({
          id: result.download_id,
          fileName: file.name.replace('.docx', '.pdf'),
          expiryTime: result.expiry_time
        });

        // Start countdown timer
        const updateTimer = () => {
          const now = Date.now();
          const remaining = Math.max(0, result.expiry_time - now);
          setTimeRemaining(remaining);
          
          if (remaining > 0) {
            setTimeout(updateTimer, 1000);
          }
        };
        updateTimer();

        toast({
          title: "Conversion Successful! 🎉",
          description: "Your PDF is ready for download.",
        });
      } else {
        throw new Error(result.error || 'Conversion failed');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const downloadFile = async () => {
    if (!downloadInfo) return;

    try {
      const response = await fetch(`/api/word-to-pdf-converter/download/${downloadInfo.id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Download failed' }));
        throw new Error(errorData.error || 'Download failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadInfo.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started! 📄",
        description: "Your PDF file is being downloaded.",
      });

      // Reset after successful download
      resetTool();
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsUploading(false);
    setProgress(0);
    setDownloadInfo(null);
    setTimeRemaining(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Word to PDF Converter
        </h2>
        <p className="text-muted-foreground">
          Convert DOCX files to PDF with accurate layout preservation
        </p>
      </div>

      {!downloadInfo ? (
        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {file ? file.name : "Drop your DOCX file here"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {file ? `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB` : "or click to browse (Max 50MB)"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* File Info & Convert Button */}
          {file && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">{file.name}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetTool}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={convertFile}
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isUploading ? "Converting..." : "Convert to PDF"}
              </Button>
            </div>
          )}

          {/* Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Converting your document...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      ) : (
        /* Download Section */
        <div className="space-y-4">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                Conversion Complete!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Your PDF file is ready for download
              </p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-900 dark:text-green-100">
                {downloadInfo.fileName}
              </span>
              <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                <Clock className="w-4 h-4" />
                <span>Expires in {formatTime(timeRemaining)}</span>
              </div>
            </div>

            <Button
              onClick={downloadFile}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={resetTool}
              className="flex-1"
            >
              Convert Another File
            </Button>
          </div>

          {timeRemaining <= 0 && (
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Download link has expired. Please convert again.</span>
            </div>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
        🔒 Files are automatically deleted after 4 minutes for your privacy and security
      </div>
    </div>
  );
}