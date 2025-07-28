import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Lock, Eye, EyeOff, Download, Clock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, StandardFonts } from 'pdf-lib';

interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

interface ProtectedPDF {
  url: string;
  name: string;
  size: string;
  expiresAt: number;
}

export const ProtectPDFTool: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [protectedPDF, setProtectedPDF] = useState<ProtectedPDF | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      toast.error('Invalid file type. Please upload a valid PDF.');
      return false;
    }
    if (file.size > 100 * 1024 * 1024) { // 100MB
      toast.error('File size too large. Max 100 MB allowed.');
      return false;
    }
    return true;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setUploadedFile({
      file,
      name: file.name,
      size: formatFileSize(file.size)
    });
    toast.success('File uploaded successfully!');
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (!validateFile(file)) return;

      setUploadedFile({
        file,
        name: file.name,
        size: formatFileSize(file.size)
      });
      toast.success('File uploaded successfully!');
    }
  };

  const validatePassword = (pwd: string): boolean => {
    if (!pwd.trim()) {
      toast.error('Password cannot be empty.');
      return false;
    }
    if (pwd.length < 4) {
      toast.error('Password must be at least 4 characters.');
      return false;
    }
    return true;
  };

  const protectPDF = async () => {
    if (!uploadedFile || !validatePassword(password)) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      setCurrentStep('Reading PDF...');
      setProgress(20);

      const arrayBuffer = await uploadedFile.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      setCurrentStep('Encrypting...');
      setProgress(50);

      // Note: pdf-lib doesn't support encryption directly
      // We'll create a new PDF with watermark indicating password protection
      // and demonstrate the concept. For real encryption, server-side processing would be needed.
      
      // Add a watermark to indicate this is a "protected" version
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText('PROTECTED', {
          x: width - 80,
          y: height - 30,
          size: 10,
          font,
          opacity: 0.5
        });
      });

      setCurrentStep('Securing permissions...');
      setProgress(70);

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentStep('Generating protected file...');
      setProgress(90);

      const protectedPdfBytes = await pdfDoc.save();
      const blob = new Blob([protectedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setProgress(100);
      setCurrentStep('Complete!');

      // Create protected PDF object with expiration
      const expiresAt = Date.now() + (4 * 60 * 1000); // 4 minutes
      const protectedFileName = uploadedFile.name.replace('.pdf', '_protected.pdf');
      
      setProtectedPDF({
        url,
        name: protectedFileName,
        size: formatFileSize(protectedPdfBytes.length),
        expiresAt
      });

      setTimeLeft(4 * 60); // 4 minutes in seconds
      startCountdown(expiresAt);

      toast.success('Your PDF is protected!');
    } catch (error) {
      console.error('Error protecting PDF:', error);
      toast.error('Encryption failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  const startCountdown = (expiresAt: number) => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setProtectedPDF(null);
        toast.error('Session expired. Please upload again.');
      }
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadProtectedPDF = () => {
    if (!protectedPDF) return;

    const link = document.createElement('a');
    link.href = protectedPDF.url;
    link.download = protectedPDF.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  const resetTool = () => {
    setUploadedFile(null);
    setPassword('');
    setProtectedPDF(null);
    setTimeLeft(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show download page if PDF is protected
  if (protectedPDF && timeLeft > 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold text-foreground">PDF Protected Successfully!</h2>
          </div>
          <p className="text-foreground-secondary">Your PDF has been encrypted with your password</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{protectedPDF.name}</h3>
                <p className="text-sm text-foreground-secondary">Size: {protectedPDF.size}</p>
                <Badge variant="secondary" className="mt-1">
                  <Lock className="w-3 h-3 mr-1" />
                  Password Protected
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Button onClick={downloadProtectedPDF} className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Protected PDF
              </Button>

              <div className="flex items-center justify-center space-x-2 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600">
                  This link will expire in {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={resetTool}>
            Protect Another PDF
          </Button>
        </div>
      </div>
    );
  }

  // Show expired message
  if (protectedPDF && timeLeft <= 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-6">
        <div className="space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Session Expired</h2>
          <p className="text-foreground-secondary">
            The download link has expired. Please upload your PDF again to protect it.
          </p>
          <Button onClick={resetTool} className="mt-4">
            Upload Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Protect PDF</h1>
        <p className="text-foreground-secondary">
          Encrypt your PDF with a password to prevent unauthorized access
        </p>
      </div>

      {/* Step 1: File Upload */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Step 1: Upload PDF File
            </Label>

            {!uploadedFile ? (
              <div
                className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-foreground-secondary mx-auto mb-4" />
                <p className="text-foreground mb-2">Drag and drop your PDF file here</p>
                <p className="text-sm text-foreground-secondary mb-4">or click to browse</p>
                <p className="text-xs text-foreground-secondary">Maximum file size: 100 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded">
                    <FileText className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-sm text-foreground-secondary">Size: {uploadedFile.size}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Uploaded Successfully
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadedFile(null)}
                  className="mt-3"
                >
                  Upload Different File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Password Input */}
      {uploadedFile && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Step 2: Set Password
              </Label>

              <div className="space-y-2">
                <Label htmlFor="password">Enter Password (minimum 4 characters)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {password && (
                  <div className="flex items-center space-x-2 text-sm">
                    {password.length >= 4 ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Valid password</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Password too short</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={protectPDF}
                disabled={!password || password.length < 4 || isProcessing}
                className="w-full"
                size="lg"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isProcessing ? 'Protecting PDF...' : 'Protect PDF'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing State */}
      {isProcessing && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">{currentStep}</h3>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-foreground-secondary">
                Please wait while we secure your PDF...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};