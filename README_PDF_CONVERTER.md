# PDF to Word Converter Tool

## Overview
A comprehensive PDF to Word conversion tool built with React frontend and Python backend, featuring OCR support for scanned PDFs and secure file handling.

## Features

### Core Functionality
- **Smart PDF Detection**: Automatically detects text-based vs scanned (image-based) PDFs
- **OCR Support**: Extracts text from scanned PDFs using Tesseract OCR
- **Real Backend Processing**: Uses PyMuPDF and python-docx for accurate conversion
- **Layout Preservation**: Maintains formatting, paragraphs, and document structure
- **Auto-Expiring Downloads**: Secure 4-minute download window for privacy

### User Interface
- **Modern 3D Design**: Glassmorphic UI with smooth animations
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Real-time Progress**: Animated progress bars during conversion
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Toast Notifications**: Clear success/error messaging
- **Countdown Timer**: Visual countdown for download expiry

### Security & Performance
- **File Validation**: PDF-only, 50MB max file size
- **Secure Storage**: Temporary file storage with automatic cleanup
- **Error Handling**: Comprehensive error states and user feedback
- **Memory Efficient**: Optimized for large file processing

## Technical Architecture

### Frontend (React/TypeScript)
- **Components**: 
  - `PDFConverter.tsx`: Main converter interface
  - `ToolModal.tsx`: Integration with tools platform
  - `Progress.tsx`: Animated progress bar component
- **Features**: File upload, progress tracking, download management, status monitoring

### Backend (Node.js/Express)
- **API Endpoints**:
  - `POST /api/pdf-converter/upload`: File upload and conversion
  - `GET /api/pdf-converter/download/:id`: Secure file download
  - `GET /api/pdf-converter/status/:id`: Download status and timer
  - `GET /api/pdf-converter/health`: Service health check

### Python Processing Engine
- **Libraries**:
  - `PyMuPDF (fitz)`: PDF text extraction
  - `pytesseract`: OCR for scanned PDFs
  - `pdf2image`: PDF to image conversion
  - `python-docx`: Word document generation
  - `Flask`: API service
- **Features**: PDF analysis, text extraction, OCR processing, Word generation

## File Flow

1. **Upload**: User uploads PDF file (drag & drop or click)
2. **Validation**: Check file type, size, and integrity
3. **Analysis**: Detect if PDF is text-based or scanned
4. **Processing**: Extract content via direct text or OCR
5. **Conversion**: Generate Word document with preserved layout
6. **Download**: Provide secure 4-minute download link
7. **Cleanup**: Automatic file deletion after expiry

## Dependencies

### Frontend
- React 18+ with TypeScript
- Radix UI components
- Tailwind CSS for styling
- Lucide React icons

### Backend
- Node.js with Express
- Multer for file uploads
- node-fetch for API calls

### Python Services
- Flask for API service
- PyMuPDF for PDF processing
- Tesseract OCR engine
- python-docx for Word generation
- pdf2image for image conversion

## Installation & Setup

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Install Python dependencies**:
   ```bash
   pip install flask pymupdf pytesseract python-docx pdf2image pillow
   ```

3. **Install system dependencies**:
   ```bash
   # Ubuntu/Debian
   apt-get install tesseract-ocr poppler-utils
   
   # macOS
   brew install tesseract poppler
   ```

4. **Start the application**:
   ```bash
   npm run dev
   ```

## Usage

1. Navigate to Tools → PDF Tools → "PDF to Word"
2. Upload a PDF file (drag & drop or click to browse)
3. Wait for conversion to complete (progress bar shows status)
4. Download the converted Word document
5. Download link expires in 4 minutes for security

## Error Handling

- **File Type**: Only PDF files accepted
- **File Size**: Maximum 50MB limit
- **Corrupted Files**: Validation and error messaging
- **OCR Failures**: Graceful fallback and user notification
- **Expired Links**: Clear messaging and re-conversion option

## Security Measures

- **Temporary Storage**: Files stored in /tmp with unique names
- **Auto-Cleanup**: Files deleted automatically after 4 minutes
- **Secure Downloads**: Hashed download IDs with timestamp validation
- **File Validation**: Comprehensive input validation and sanitization
- **No Data Persistence**: No long-term storage of user files

## Performance Optimizations

- **Streaming Uploads**: Memory-efficient file handling
- **Progress Feedback**: Real-time conversion progress
- **Optimized OCR**: Configurable OCR parameters for speed/accuracy balance
- **Cleanup Workers**: Background processes for file management

## Integration

The PDF converter integrates seamlessly with the existing StudentHub platform:
- Accessible through the main tools interface
- Consistent UI/UX with platform design system
- Shared authentication and session management
- Integrated toast notification system

## Future Enhancements

- Batch PDF processing
- Additional output formats (RTF, HTML)
- Advanced layout preservation
- Cloud storage integration
- OCR language selection
- Conversion quality settings