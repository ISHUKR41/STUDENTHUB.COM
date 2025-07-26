import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MergePDFTool } from './PDFTools/MergePDFTool';
import { SplitPDFTool } from './PDFTools/SplitPDFTool';
import { CompressPDFTool } from './PDFTools/CompressPDFTool';
import { PDFToWordTool } from './PDFTools/PDFToWordTool';
import { PDFToPowerPointTool } from './PDFTools/PDFToPowerPointTool';
import { ResizeImageTool } from './ImageTools/ResizeImageTool';
import { CompressImageTool } from './ImageTools/CompressImageTool';
import { TextToPDFTool } from './TextTools/TextToPDFTool';
import { ProtectPDFTool } from './PDFTools/ProtectPDFTool';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
  toolTitle: string;
}

export const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, toolId, toolTitle }) => {
  const renderTool = () => {
    switch (toolId) {
      case 'merge-pdf':
        return <MergePDFTool />;
      case 'split-pdf':
        return <SplitPDFTool />;
      case 'compress-pdf':
        return <CompressPDFTool />;
      case 'protect-pdf':
        return <ProtectPDFTool />;
      case 'pdf-to-word':
        return <PDFToWordTool />;
      case 'pdf-to-powerpoint':
        return <PDFToPowerPointTool />;
      case 'resize-image':
        return <ResizeImageTool />;
      case 'compress-image':
        return <CompressImageTool />;
      case 'text-to-pdf':
        return <TextToPDFTool />;
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold mb-2">Tool Coming Soon!</h3>
            <p className="text-foreground-secondary mb-6">
              We're working hard to bring you this tool. It will be available very soon!
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{toolTitle}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </DialogHeader>
        <div className="mt-4">
          {renderTool()}
        </div>
      </DialogContent>
    </Dialog>
  );
};