import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Settings, RotateCcw, Eye } from 'lucide-react';

export const CompressImageTool = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState([80]);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, WebP)",
        variant: "destructive"
      });
      return;
    }

    setOriginalFile(file);
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setCompressedImage(null);
      setCompressedSize(0);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = async () => {
    if (!originalImage || !canvasRef.current || !originalFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        canvas.width = img.width;
        canvas.height = img.height;

        setProgress(30);

        // Draw image to canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        setProgress(60);

        // Get the compressed image
        const qualityValue = quality[0] / 100;
        
        canvas.toBlob((blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setCompressedImage(url);
            setProgress(100);
            
            const compressionRatio = ((originalSize - blob.size) / originalSize * 100).toFixed(1);
            
            toast({
              title: "Image compressed successfully!",
              description: `Reduced size by ${compressionRatio}% (${formatFileSize(originalSize)} → ${formatFileSize(blob.size)})`
            });
          }
        }, originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg', qualityValue);
      };
      img.src = originalImage;
    } catch (error) {
      console.error('Error compressing image:', error);
      toast({
        title: "Compression failed",
        description: "There was an error compressing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCompressedImage = () => {
    if (compressedImage && originalFile) {
      const link = document.createElement('a');
      link.href = compressedImage;
      const fileName = originalFile.name;
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      const ext = originalFile.type.split('/')[1];
      link.download = `${nameWithoutExt}-compressed.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setProgress(0);
    setQuality([80]);
    if (compressedImage) URL.revokeObjectURL(compressedImage);
  };

  const getCompressionPreview = () => {
    if (!originalSize || !compressedSize) return null;
    
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    const ratio = (compressedSize / originalSize * 100).toFixed(1);
    
    return {
      reduction,
      ratio,
      originalSizeFormatted: formatFileSize(originalSize),
      compressedSizeFormatted: formatFileSize(compressedSize)
    };
  };

  const compressionPreview = getCompressionPreview();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Compress Image
          </CardTitle>
          <p className="text-foreground-secondary">
            Reduce image file size while maintaining visual quality. Perfect for web optimization.
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
                <p className="text-sm text-foreground-secondary">Supports JPG, PNG, WebP</p>
              </label>
            </div>
          )}

          {/* Image Preview and Controls */}
          {originalImage && (
            <div className="space-y-6">
              {/* Quality Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Compression Quality</Label>
                  <span className="text-sm font-medium">{quality[0]}%</span>
                </div>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-foreground-secondary">
                  <span>Smaller file (10%)</span>
                  <span>Better quality (100%)</span>
                </div>
              </div>

              {/* Image Comparison */}
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
                  <div className="text-sm text-foreground-secondary space-y-1">
                    <p>Size: {formatFileSize(originalSize)}</p>
                    <p>Type: {originalFile?.type}</p>
                  </div>
                </div>

                {/* Compressed Image */}
                <div className="space-y-4">
                  <h3 className="font-medium">Compressed Image</h3>
                  <div className="border rounded-lg overflow-hidden">
                    {compressedImage ? (
                      <img
                        src={compressedImage}
                        alt="Compressed"
                        className="w-full h-auto max-h-64 object-contain bg-checkered"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center bg-muted">
                        <p className="text-foreground-secondary">Compressed image will appear here</p>
                      </div>
                    )}
                  </div>
                  {compressionPreview && (
                    <div className="text-sm space-y-1">
                      <p className="text-green-600 font-medium">
                        Size: {compressionPreview.compressedSizeFormatted}
                      </p>
                      <p className="text-green-600">
                        Reduced by {compressionPreview.reduction}%
                      </p>
                      <p className="text-foreground-secondary">
                        {compressionPreview.ratio}% of original size
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Compression Stats */}
              {compressionPreview && (
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {compressionPreview.reduction}%
                        </p>
                        <p className="text-sm text-foreground-secondary">Size Reduction</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {compressionPreview.originalSizeFormatted}
                        </p>
                        <p className="text-sm text-foreground-secondary">Original Size</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {compressionPreview.compressedSizeFormatted}
                        </p>
                        <p className="text-sm text-foreground-secondary">Compressed Size</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compressing image...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          {originalImage && (
            <div className="flex gap-3">
              <Button
                onClick={compressImage}
                disabled={isProcessing}
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                Compress Image
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
          {compressedImage && (
            <Card className="bg-background-secondary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-600">✓ Compression Complete!</h4>
                    <p className="text-sm text-foreground-secondary">
                      Your compressed image is ready for download
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open(compressedImage, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={downloadCompressedImage}>
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