import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Settings, RotateCcw, Eye, Link } from 'lucide-react';

export const ResizeImageTool = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [newDimensions, setNewDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, WebP)",
        variant: "destructive"
      });
      return;
    }

    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setNewDimensions({ width: img.width, height: img.height });
        setOriginalImage(e.target?.result as string);
        setResizedImage(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const updateDimensions = (field: 'width' | 'height', value: number) => {
    if (maintainAspectRatio && dimensions.width && dimensions.height) {
      const aspectRatio = dimensions.width / dimensions.height;
      if (field === 'width') {
        setNewDimensions({
          width: value,
          height: Math.round(value / aspectRatio)
        });
      } else {
        setNewDimensions({
          width: Math.round(value * aspectRatio),
          height: value
        });
      }
    } else {
      setNewDimensions(prev => ({ ...prev, [field]: value }));
    }
  };

  const resizeImage = async () => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        canvas.width = newDimensions.width;
        canvas.height = newDimensions.height;

        setProgress(50);

        // Use high-quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);

        setProgress(90);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResizedImage(url);
            setProgress(100);
            
            toast({
              title: "Image resized successfully!",
              description: `Resized to ${newDimensions.width} × ${newDimensions.height} pixels`
            });
          }
        }, originalFile?.type || 'image/png', 0.9);
      };
      img.src = originalImage;
    } catch (error) {
      console.error('Error resizing image:', error);
      toast({
        title: "Resize failed",
        description: "There was an error resizing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResizedImage = () => {
    if (resizedImage) {
      const link = document.createElement('a');
      link.href = resizedImage;
      const fileName = originalFile?.name || 'resized-image';
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      const ext = originalFile?.type.split('/')[1] || 'png';
      link.download = `${nameWithoutExt}-resized.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setOriginalImage(null);
    setResizedImage(null);
    setOriginalFile(null);
    setDimensions({ width: 0, height: 0 });
    setNewDimensions({ width: 0, height: 0 });
    setProgress(0);
    if (resizedImage) URL.revokeObjectURL(resizedImage);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Resize Image
          </CardTitle>
          <p className="text-foreground-secondary">
            Change image dimensions while maintaining quality. Supports JPG, PNG, GIF, and WebP formats.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          {!originalImage && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-foreground-secondary mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop an image here or click to browse</p>
                <p className="text-sm text-foreground-secondary">Supports JPG, PNG, GIF, WebP</p>
              </label>
            </div>
          )}

          {/* Image Preview and Controls */}
          {originalImage && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-4">
                <h3 className="font-medium">Original Image</h3>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-auto max-h-64 object-contain bg-checkered"
                  />
                </div>
                <p className="text-sm text-foreground-secondary">
                  {dimensions.width} × {dimensions.height} pixels
                  {originalFile && ` • ${formatFileSize(originalFile.size)}`}
                </p>
              </div>

              {/* Resize Controls */}
              <div className="space-y-4">
                <h3 className="font-medium">Resize Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={maintainAspectRatio}
                      onCheckedChange={setMaintainAspectRatio}
                      id="aspect-ratio"
                    />
                    <Label htmlFor="aspect-ratio" className="flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      Maintain aspect ratio
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={newDimensions.width}
                        onChange={(e) => updateDimensions('width', parseInt(e.target.value) || 0)}
                        min="1"
                        max="10000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={newDimensions.height}
                        onChange={(e) => updateDimensions('height', parseInt(e.target.value) || 0)}
                        min="1"
                        max="10000"
                      />
                    </div>
                  </div>

                  {/* Quick Size Presets */}
                  <div className="space-y-2">
                    <Label>Quick Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewDimensions({ width: 1920, height: 1080 })}
                      >
                        1920×1080
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewDimensions({ width: 1280, height: 720 })}
                      >
                        1280×720
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewDimensions({ width: 800, height: 600 })}
                      >
                        800×600
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewDimensions({ width: 400, height: 400 })}
                      >
                        400×400
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Resizing image...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Resized Image Preview */}
          {resizedImage && (
            <div className="space-y-4">
              <h3 className="font-medium">Resized Image</h3>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={resizedImage}
                  alt="Resized"
                  className="w-full h-auto max-h-64 object-contain bg-checkered"
                />
              </div>
              <p className="text-sm text-foreground-secondary">
                {newDimensions.width} × {newDimensions.height} pixels
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {originalImage && (
            <div className="flex gap-3">
              <Button
                onClick={resizeImage}
                disabled={isProcessing || newDimensions.width === 0 || newDimensions.height === 0}
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                Resize Image
              </Button>
              
              <Button
                variant="outline"
                onClick={resetTool}
                disabled={isProcessing}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          )}

          {/* Download Section */}
          {resizedImage && (
            <Card className="bg-background-secondary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-600">✓ Resize Complete!</h4>
                    <p className="text-sm text-foreground-secondary">
                      Your resized image is ready for download
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open(resizedImage, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={downloadResizedImage}>
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

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};