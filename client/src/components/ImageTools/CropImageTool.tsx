import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crop, Download, Upload, RotateCw, ZoomIn, ZoomOut, Square, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CropImageTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [aspectRatio, setAspectRatio] = useState<string>('freeform');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<{ sessionId: string; fileName: string; size: number; dimensions: { width: number; height: number }; expiresAt: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [imageScale, setImageScale] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Aspect ratio presets
  const aspectRatios = [
    { value: 'freeform', label: 'Freeform', ratio: null },
    { value: '1:1', label: '1:1 (Square)', ratio: 1 },
    { value: '4:3', label: '4:3', ratio: 4/3 },
    { value: '16:9', label: '16:9', ratio: 16/9 },
    { value: '3:2', label: '3:2', ratio: 3/2 },
    { value: 'custom', label: 'Custom', ratio: null }
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

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Reset crop area when new image is loaded
    setCropArea({ x: 50, y: 50, width: 200, height: 150 });
    setImageScale(1);
    
    toast({
      title: "Image Uploaded Successfully! 🎉",
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
    });
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

  const adjustCropToAspectRatio = (ratio: number | null) => {
    if (!ratio) return;
    
    const newHeight = cropArea.width / ratio;
    setCropArea(prev => ({
      ...prev,
      height: Math.min(newHeight, 400) // Max height constraint
    }));
  };

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value);
    const ratioData = aspectRatios.find(r => r.value === value);
    if (ratioData?.ratio) {
      adjustCropToAspectRatio(ratioData.ratio);
    }
  };

  const handleCropAreaChange = (field: keyof CropArea, value: number) => {
    setCropArea(prev => {
      const newArea = { ...prev, [field]: value };
      
      // Apply aspect ratio constraint if set
      const ratioData = aspectRatios.find(r => r.value === aspectRatio);
      if (ratioData?.ratio && (field === 'width' || field === 'height')) {
        if (field === 'width') {
          newArea.height = value / ratioData.ratio;
        } else {
          newArea.width = value * ratioData.ratio;
        }
      }
      
      return newArea;
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setImageScale(prev => {
      const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.min(Math.max(newScale, 0.5), 3); // Limit zoom between 0.5x and 3x
    });
  };

  const processCrop = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to crop",
        variant: "destructive"
      });
      return;
    }

    if (cropArea.width <= 0 || cropArea.height <= 0) {
      toast({
        title: "Invalid Crop Area",
        description: "Please select a valid crop area",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('x', Math.round(cropArea.x).toString());
      formData.append('y', Math.round(cropArea.y).toString());
      formData.append('width', Math.round(cropArea.width).toString());
      formData.append('height', Math.round(cropArea.height).toString());

      const response = await fetch('/api/image-tools/crop', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to crop image');
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
              description: "❌ Download link has expired. Please crop again.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Image Cropped Successfully! ✅",
        description: `Ready for download: ${result.fileName}`,
      });

    } catch (error) {
      console.error('Crop error:', error);
      toast({
        title: "Cropping Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
    setCropArea({ x: 0, y: 0, width: 100, height: 100 });
    setAspectRatio('freeform');
    setImageScale(1);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-primary rounded-xl">
            <Crop className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">✂️ Crop Image Tool</h2>
        </div>
        <p className="text-foreground-secondary max-w-2xl mx-auto">
          Upload an image and crop it to your desired dimensions with precision controls and aspect ratio presets
        </p>
      </div>

      {!selectedFile ? (
        /* Upload Section */
        <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300">
          <CardContent className="p-12">
            <div 
              className="text-center space-y-6"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Image to Crop</h3>
                <p className="text-foreground-secondary mb-4">
                  Drag & drop or click to select • JPG, PNG, WEBP, BMP, GIF • Max 30MB
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
                  className="btn-hero"
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
              <h3 className="text-2xl font-bold text-green-500">✅ Image Cropped Successfully!</h3>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="glassmorphism p-6 rounded-xl">
                  <h4 className="font-semibold mb-2">File Details</h4>
                  <p className="text-sm text-foreground-secondary">Name: {processedImage.fileName}</p>
                  <p className="text-sm text-foreground-secondary">Size: {(processedImage.size / 1024).toFixed(1)} KB</p>
                  <p className="text-sm text-foreground-secondary">
                    Dimensions: {processedImage.dimensions.width} × {processedImage.dimensions.height}px
                  </p>
                </div>
                
                <div className="glassmorphism p-6 rounded-xl">
                  <h4 className="font-semibold mb-2 text-orange-500">⏳ Download Timer</h4>
                  <p className="text-2xl font-mono font-bold text-orange-500">{formatTime(timeLeft)}</p>
                  <p className="text-xs text-foreground-secondary">Link expires soon</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleDownload}
                  size="lg" 
                  className="btn-hero group"
                  disabled={timeLeft <= 0}
                >
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Download Cropped Image
                </Button>
                <Button 
                  onClick={resetTool}
                  size="lg" 
                  variant="outline"
                  className="border-primary hover:bg-primary/10"
                >
                  <Crop className="w-5 h-5 mr-2" />
                  Crop Another Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Crop Interface */
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Preview & Crop Area */}
          <Card className="shadow-glow">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Square className="w-5 h-5 mr-2 text-primary" />
                Crop Preview
              </h3>
              
              <div className="relative bg-background-secondary rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                {previewUrl && (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-auto"
                      style={{ transform: `scale(${imageScale})`, transformOrigin: 'top left' }}
                    />
                    
                    {/* Crop overlay */}
                    <div 
                      className="absolute border-2 border-primary bg-primary/10 cursor-move"
                      style={{
                        left: `${cropArea.x}px`,
                        top: `${cropArea.y}px`,
                        width: `${cropArea.width}px`,
                        height: `${cropArea.height}px`,
                      }}
                    >
                      <div className="absolute inset-0 border border-white/50"></div>
                      {/* Resize handles */}
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary border border-white rounded-full cursor-nw-resize"></div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary border border-white rounded-full cursor-ne-resize"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary border border-white rounded-full cursor-sw-resize"></div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary border border-white rounded-full cursor-se-resize"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Button 
                  onClick={() => handleZoom('out')} 
                  size="sm" 
                  variant="outline"
                  disabled={imageScale <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">{Math.round(imageScale * 100)}%</span>
                <Button 
                  onClick={() => handleZoom('in')} 
                  size="sm" 
                  variant="outline"
                  disabled={imageScale >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Crop Controls */}
          <Card className="shadow-glow">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold flex items-center">
                <Maximize2 className="w-5 h-5 mr-2 text-primary" />
                Crop Settings
              </h3>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Crop Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>X Position</Label>
                  <Input
                    type="number"
                    value={Math.round(cropArea.x)}
                    onChange={(e) => handleCropAreaChange('x', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Y Position</Label>
                  <Input
                    type="number"
                    value={Math.round(cropArea.y)}
                    onChange={(e) => handleCropAreaChange('y', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Input
                    type="number"
                    value={Math.round(cropArea.width)}
                    onChange={(e) => handleCropAreaChange('width', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Input
                    type="number"
                    value={Math.round(cropArea.height)}
                    onChange={(e) => handleCropAreaChange('height', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
              </div>

              {/* Crop Info */}
              <div className="glassmorphism p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Crop Information</h4>
                <p className="text-sm text-foreground-secondary">
                  Final size: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}px
                </p>
                <p className="text-sm text-foreground-secondary">
                  Aspect ratio: {aspectRatio === 'freeform' ? 'Custom' : aspectRatios.find(r => r.value === aspectRatio)?.label}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={processCrop} 
                  className="w-full btn-hero group" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crop className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      ✂️ Crop Image
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={resetTool} 
                  variant="outline" 
                  className="w-full border-primary hover:bg-primary/10"
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

export default CropImageTool;