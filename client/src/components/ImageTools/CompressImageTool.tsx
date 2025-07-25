import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Minimize2, Download, Upload, FileImage, Zap, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CompressImageTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressionMode, setCompressionMode] = useState<string>('auto');
  const [targetSize, setTargetSize] = useState<string>('');
  const [keepExif, setKeepExif] = useState(false);
  const [resizeWidth, setResizeWidth] = useState<string>('');
  const [resizeHeight, setResizeHeight] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<{
    sessionId: string;
    fileName: string;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    dimensions: { width: number; height: number };
    expiresAt: string;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressionModes = [
    { value: 'auto', label: '🎯 Auto (Recommended)', desc: 'Smart compression based on image type' },
    { value: 'lossless', label: '🔒 Lossless', desc: 'Preserve original quality' },
    { value: 'balanced', label: '⚖️ Balanced', desc: 'Good quality vs size balance' },
    { value: 'high', label: '📦 High Compression', desc: 'Smallest file size' }
  ];

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid image (JPG, PNG, WEBP, BMP, GIF)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (30MB)
    if (file.size > 30 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Max file size is 30 MB",
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

  const processCompress = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('mode', compressionMode);
      if (targetSize) formData.append('targetSize', targetSize);
      formData.append('keepExif', keepExif.toString());
      if (resizeWidth) formData.append('resizeWidth', resizeWidth);
      if (resizeHeight) formData.append('resizeHeight', resizeHeight);

      const response = await fetch('/api/image-tools/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to compress image');
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
              description: "⚠️ Download link has expired. Please compress again.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Image Compressed Successfully! ✅",
        description: `Saved ${result.compressionRatio}% space! Ready for download.`,
      });

    } catch (error) {
      console.error('Compress error:', error);
      toast({
        title: "Compression Failed",
        description: error instanceof Error ? error.message : "Something went wrong during compression. Please try again.",
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
    setCompressionMode('auto');
    setTargetSize('');
    setKeepExif(false);
    setResizeWidth('');
    setResizeHeight('');
    setShowAdvanced(false);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-secondary rounded-xl">
            <Minimize2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">📦 Compress Image Tool</h2>
        </div>
        <p className="text-foreground-secondary max-w-2xl mx-auto">
          Reduce image file size while maintaining quality using advanced compression algorithms
        </p>
      </div>

      {!selectedFile ? (
        /* Upload Section */
        <Card className="border-2 border-dashed border-secondary/30 hover:border-secondary/60 transition-all duration-300">
          <CardContent className="p-12">
            <div 
              className="text-center space-y-6"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="mx-auto w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Image to Compress</h3>
                <p className="text-foreground-secondary mb-4">
                  Drag & drop or click to select • JPG, PNG, WEBP, BMP, GIF • Max 30MB • Max 8000×8000px
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
                  className="bg-gradient-secondary hover:bg-gradient-secondary/90 text-white"
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
              <h3 className="text-2xl font-bold text-green-500">✅ Image Compressed Successfully!</h3>
              
              {/* Compression Stats */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="glassmorphism p-6 rounded-xl">
                  <FileImage className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Original Size</h4>
                  <p className="text-2xl font-bold text-blue-500">{formatFileSize(processedImage.originalSize)}</p>
                </div>
                
                <div className="glassmorphism p-6 rounded-xl">
                  <Minimize2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Compressed Size</h4>
                  <p className="text-2xl font-bold text-green-500">{formatFileSize(processedImage.compressedSize)}</p>
                </div>
                
                <div className="glassmorphism p-6 rounded-xl">
                  <Zap className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Space Saved</h4>
                  <p className="text-2xl font-bold text-orange-500">{processedImage.compressionRatio}%</p>
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
                  className="bg-gradient-secondary hover:bg-gradient-secondary/90 text-white group"
                  disabled={timeLeft <= 0}
                >
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  🔽 Download Compressed Image
                </Button>
                <Button 
                  onClick={resetTool}
                  size="lg" 
                  variant="outline"
                  className="border-secondary hover:bg-secondary/10"
                >
                  <Minimize2 className="w-5 h-5 mr-2" />
                  📁 Compress Another Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Compression Interface */
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <Card className="shadow-glow">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileImage className="w-5 h-5 mr-2 text-secondary" />
                Image Preview
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
                  <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
                  <p><span className="font-medium">Type:</span> {selectedFile.type}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compression Settings */}
          <Card className="shadow-glow">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold flex items-center">
                <Settings className="w-5 h-5 mr-2 text-secondary" />
                Compression Settings
              </h3>

              {/* Compression Mode */}
              <div className="space-y-3">
                <Label>Compression Mode</Label>
                <Select value={compressionMode} onValueChange={setCompressionMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compression mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {compressionModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        <div>
                          <div className="font-medium">{mode.label}</div>
                          <div className="text-xs text-foreground-secondary">{mode.desc}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Settings Toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-base">🔧 Advanced Settings</Label>
                <Switch
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
              </div>

              {showAdvanced && (
                <Card className="border border-secondary/20">
                  <CardContent className="p-4 space-y-4">
                    {/* Target Size */}
                    <div className="space-y-2">
                      <Label>Target Size (MB) - Optional</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 2.0"
                        value={targetSize}
                        onChange={(e) => setTargetSize(e.target.value)}
                        step="0.1"
                        min="0.1"
                      />
                      <p className="text-xs text-foreground-secondary">
                        Leave empty for auto compression
                      </p>
                    </div>

                    {/* Resize Options */}
                    <div className="space-y-2">
                      <Label>Resize Image (Optional)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Width"
                          value={resizeWidth}
                          onChange={(e) => setResizeWidth(e.target.value)}
                          min="1"
                        />
                        <Input
                          type="number"
                          placeholder="Height"
                          value={resizeHeight}
                          onChange={(e) => setResizeHeight(e.target.value)}
                          min="1"
                        />
                      </div>
                    </div>

                    {/* Keep EXIF */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Keep EXIF Metadata</Label>
                        <p className="text-xs text-foreground-secondary">
                          Camera info, location data, etc.
                        </p>
                      </div>
                      <Switch
                        checked={keepExif}
                        onCheckedChange={setKeepExif}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Compression Info */}
              <div className="glassmorphism p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Compression Tips</h4>
                <ul className="text-sm text-foreground-secondary space-y-1">
                  <li>• Auto mode works best for most images</li>
                  <li>• Lossless preserves 100% quality</li>
                  <li>• High compression reduces file size significantly</li>
                  <li>• Removing EXIF data saves additional space</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={processCompress} 
                  className="w-full bg-gradient-secondary hover:bg-gradient-secondary/90 text-white group" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Minimize2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      📦 Compress Image
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={resetTool} 
                  variant="outline" 
                  className="w-full border-secondary hover:bg-secondary/10"
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

export default CompressImageTool;