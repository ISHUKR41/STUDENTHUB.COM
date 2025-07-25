import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Download, Upload, FileImage, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ConvertImageTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('jpg');
  const [preserveTransparency, setPreserveTransparency] = useState(true);
  const [grayscale, setGrayscale] = useState(false);
  const [resizeWidth, setResizeWidth] = useState<string>('');
  const [resizeHeight, setResizeHeight] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<{
    sessionId: string;
    fileName: string;
    originalSize: number;
    convertedSize: number;
    dimensions: { width: number; height: number };
    format: string;
    expiresAt: string;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatOptions = [
    { value: 'jpg', label: '📷 JPG', desc: 'Best for photos, smaller file size', icon: '📷' },
    { value: 'png', label: '🖼️ PNG', desc: 'Supports transparency, lossless', icon: '🖼️' },
    { value: 'webp', label: '🌐 WEBP', desc: 'Modern format, great compression', icon: '🌐' },
    { value: 'bmp', label: '🎨 BMP', desc: 'Uncompressed, large file size', icon: '🎨' },
    { value: 'gif', label: '🎬 GIF', desc: 'Animation support, limited colors', icon: '🎬' },
    { value: 'tiff', label: '📑 TIFF', desc: 'High quality, professional use', icon: '📑' }
  ];

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/gif', 'image/tiff', 'image/heic'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid image (JPG, PNG, WEBP, BMP, GIF, TIFF, HEIC)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (40MB)
    if (file.size > 40 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Max file size is 40 MB",
        variant: "destructive"
      });
      return;
    }

    // Check dimensions using Image object
    const img = new Image();
    img.onload = () => {
      if (img.width > 8000 || img.height > 8000) {
        toast({
          title: "Image Too Large",
          description: "Max dimensions are 8000×8000 pixels",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      toast({
        title: "Image Uploaded Successfully! 🎉",
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) - ${img.width}×${img.height}px`,
      });
    };
    
    img.src = URL.createObjectURL(file);
  }, [toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const processConvert = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to convert",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('targetFormat', targetFormat);
      formData.append('preserveTransparency', preserveTransparency.toString());
      formData.append('grayscale', grayscale.toString());
      if (resizeWidth) formData.append('resizeWidth', resizeWidth);
      if (resizeHeight) formData.append('resizeHeight', resizeHeight);

      const response = await fetch('/api/image-tools/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to convert image');
      }

      const result = await response.json();
      setProcessedImage(result);
      
      // Start countdown timer
      setTimeLeft(4 * 60); // 4 minutes in seconds
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setProcessedImage(null);
            toast({
              title: "Session Expired",
              description: "❌ Download link has expired. Please convert again.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Image Converted Successfully! ✅",
        description: `Converted to ${result.format} format. Ready for download!`,
      });

    } catch (error) {
      console.error('Convert error:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Something went wrong during conversion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      window.open(`/api/image-tools/download/${processedImage.sessionId}`, '_blank');
    }
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImage(null);
    setTargetFormat('jpg');
    setPreserveTransparency(true);
    setGrayscale(false);
    setResizeWidth('');
    setResizeHeight('');
    setTimeLeft(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getOriginalFormat = () => {
    if (!selectedFile) return 'Unknown';
    const ext = selectedFile.name.split('.').pop()?.toUpperCase() || 'Unknown';
    return ext;
  };

  const supportsTransparency = () => {
    return ['png', 'webp'].includes(targetFormat);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-accent rounded-xl">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">🔄 Convert Image Tool</h2>
        </div>
        <p className="text-foreground-secondary max-w-2xl mx-auto">
          Convert images between different formats while preserving quality and customizing output settings
        </p>
      </div>

      {!selectedFile ? (
        /* Upload Section */
        <Card className="border-2 border-dashed border-accent/30 hover:border-accent/60 transition-all duration-300">
          <CardContent className="p-12">
            <div 
              className="text-center space-y-6"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="mx-auto w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center animate-pulse">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Image to Convert</h3>
                <p className="text-foreground-secondary mb-4">
                  Drag & drop or click to select • JPG, PNG, WEBP, BMP, GIF, TIFF, HEIC • Max 40MB • Max 8000×8000px
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : processedImage ? (
        /* Success/Download Section */
        <Card className="shadow-glow border-2 border-green-500/20">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center animate-bounce">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-500">✅ Image Converted Successfully!</h3>
              
              {/* Conversion Results */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Before/After Comparison */}
                <div className="glassmorphism p-6 rounded-xl">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <ArrowRight className="w-5 h-5 mr-2 text-primary" />
                    Format Conversion
                  </h4>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{getOriginalFormat()}</div>
                      <div className="text-sm text-foreground-secondary">Original</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{processedImage.format}</div>
                      <div className="text-sm text-foreground-secondary">Converted</div>
                    </div>
                  </div>
                </div>

                {/* File Details */}
                <div className="glassmorphism p-6 rounded-xl">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <FileImage className="w-5 h-5 mr-2 text-secondary" />
                    File Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {processedImage.fileName}</p>
                    <p><span className="font-medium">Size:</span> {formatFileSize(processedImage.convertedSize)}</p>
                    <p><span className="font-medium">Dimensions:</span> {processedImage.dimensions.width} × {processedImage.dimensions.height}px</p>
                  </div>
                </div>
              </div>

              <div className="glassmorphism p-6 rounded-xl max-w-md mx-auto">
                <h4 className="font-semibold mb-2 text-orange-500">⏳ Download Timer</h4>
                <p className="text-2xl font-mono font-bold text-orange-500">{formatTime(timeLeft)}</p>
                <p className="text-xs text-foreground-secondary">Link expires in</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleDownload}
                  size="lg" 
                  className="bg-gradient-accent hover:bg-gradient-accent/90 text-white group"
                  disabled={timeLeft <= 0}
                >
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  📥 Download Converted Image
                </Button>
                <Button 
                  onClick={resetTool}
                  size="lg" 
                  variant="outline"
                  className="border-accent hover:bg-accent/10"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  🔁 Convert Another Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Conversion Interface */
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <Card className="shadow-glow">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-accent" />
                Current Image
              </h3>
              
              <div className="glassmorphism p-4 rounded-lg mb-4">
                {previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-auto rounded-lg max-h-80 object-contain"
                  />
                )}
              </div>

              {selectedFile && (
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">File:</span> {selectedFile.name}</p>
                  <p><span className="font-medium">Current Format:</span> {getOriginalFormat()}</p>
                  <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
                  <p><span className="font-medium">Type:</span> {selectedFile.type}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Settings */}
          <Card className="shadow-glow">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold flex items-center">
                <RefreshCw className="w-5 h-5 mr-2 text-accent" />
                Conversion Settings
              </h3>

              {/* Target Format Selection */}
              <div className="space-y-3">
                <Label>Convert To</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center space-x-2">
                          <span>{format.icon}</span>
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-foreground-secondary">{format.desc}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Format-specific Options */}
              {supportsTransparency() && (
                <div className="flex items-center justify-between glassmorphism p-4 rounded-lg">
                  <div>
                    <Label>Preserve Transparency</Label>
                    <p className="text-xs text-foreground-secondary">
                      Keep transparent backgrounds
                    </p>
                  </div>
                  <Switch
                    checked={preserveTransparency}
                    onCheckedChange={setPreserveTransparency}
                  />
                </div>
              )}

              {/* Grayscale Option */}
              <div className="flex items-center justify-between glassmorphism p-4 rounded-lg">
                <div>
                  <Label>Convert to Grayscale</Label>
                  <p className="text-xs text-foreground-secondary">
                    Remove all colors from the image
                  </p>
                </div>
                <Switch
                  checked={grayscale}
                  onCheckedChange={setGrayscale}
                />
              </div>

              {/* Resize Options */}
              <div className="space-y-3">
                <Label>Resize Before Converting (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm">Width (px)</Label>
                    <Input
                      type="number"
                      placeholder="Width"
                      value={resizeWidth}
                      onChange={(e) => setResizeWidth(e.target.value)}
                      min="1"
                      max="8000"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Height (px)</Label>
                    <Input
                      type="number"
                      placeholder="Height"
                      value={resizeHeight}
                      onChange={(e) => setResizeHeight(e.target.value)}
                      min="1"
                      max="8000"
                    />
                  </div>
                </div>
                <p className="text-xs text-foreground-secondary">
                  Leave empty to keep original dimensions
                </p>
              </div>

              {/* Format Info */}
              <div className="glassmorphism p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Format Information</h4>
                <div className="text-sm text-foreground-secondary">
                  {targetFormat === 'jpg' && "JPEG: Best for photos, small file size, no transparency support"}
                  {targetFormat === 'png' && "PNG: Lossless compression, supports transparency, larger files"}
                  {targetFormat === 'webp' && "WebP: Modern format with excellent compression and transparency"}
                  {targetFormat === 'bmp' && "BMP: Uncompressed format, very large files, high quality"}
                  {targetFormat === 'gif' && "GIF: Limited colors, animation support, small files"}
                  {targetFormat === 'tiff' && "TIFF: Professional format, lossless, very large files"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={processConvert} 
                  className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-white group" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                      🔄 Convert to {targetFormat.toUpperCase()}
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={resetTool} 
                  variant="outline" 
                  className="w-full border-accent hover:bg-accent/10"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Different Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConvertImageTool;