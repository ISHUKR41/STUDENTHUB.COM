import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MergePDFTool } from './PDFTools/MergePDFTool';
import { SplitPDFTool } from './PDFTools/SplitPDFTool';
import { CompressPDFTool } from './PDFTools/CompressPDFTool';
import { PDFConverter } from './PDFConverter';
import { PDFToPowerPointTool } from './PDFTools/PDFToPowerPointTool';
import { WordToPDFTool } from './PDFTools/WordToPDFTool';
import { ResizeImageTool } from './ImageTools/ResizeImageTool';
import CropImageTool from '../ImageTools/CropImageTool';
import CompressImageTool from '../ImageTools/CompressImageTool';
import ConvertImageTool from '../ImageTools/ConvertImageTool';
import { TextToPDFTool } from './TextTools/TextToPDFTool';
import { ProtectPDFTool } from './PDFTools/ProtectPDFTool';
import { GrammarCheckerTool } from './AITools/GrammarCheckerTool';
import { TextSummarizerTool } from './AITools/TextSummarizerTool';
import { SmartFlashcardsTool } from './AITools/SmartFlashcardsTool';
import { StudyPlannerTool } from './AITools/StudyPlannerTool';
import { FormulaSolverTool } from './AITools/FormulaSolverTool';
import { ScreenshotOCRTool } from './AITools/ScreenshotOCRTool';
import { QuickNotepadTool } from './TextTools/QuickNotepadTool';
import { FileConverterTool } from './FileTools/FileConverterTool';

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
        return <PDFConverter />;
      case 'pdf-to-powerpoint':
        return <PDFToPowerPointTool />;
      case 'word-to-pdf':
        return <WordToPDFTool />;
      case 'resize-image':
        return <ResizeImageTool />;
      case 'crop-image':
        return <CropImageTool />;
      case 'compress-image':
        return <CompressImageTool />;
      case 'convert-image':
        return <ConvertImageTool />;
      case 'text-to-pdf':
        return <TextToPDFTool />;
      case 'grammar-checker':
        return <GrammarCheckerTool />;
      case 'text-summary':
        return <TextSummarizerTool />;
      case 'smart-flashcards':
        return <SmartFlashcardsTool />;
      case 'ai-study-planner':
        return <StudyPlannerTool />;
      case 'formula-solver':
        return <FormulaSolverTool />;
      case 'screenshot-ocr':
        return <ScreenshotOCRTool />;
      case 'quick-notepad':
        return <QuickNotepadTool />;
      case 'file-converter':
        return <FileConverterTool />;
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