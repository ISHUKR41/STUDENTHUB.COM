# StudentHub.com - Comprehensive Tool Suite Platform

## Overview

StudentHub.com is a full-featured, modern, animated, 3D-styled AI, PDF, Image, Text & File utility platform. The platform provides 30+ fully functional tools including PDF manipulation, image processing, AI-powered text tools, and file converters. Built with React, TypeScript, and Node.js/Express backend with secure API integrations to OpenAI and Gemini.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### July 26, 2025
- **COMPLETED: Migration from Replit Agent to Standard Replit Environment**
  - Successfully migrated project from Replit Agent to standard Replit environment
  - Fixed Node.js and Python dependencies compatibility issues
  - Resolved PostgreSQL database configuration and connection
  - Node.js application now running properly on port 5000 with hot reloading
  - All existing tools and PDF converter functionality preserved
- **COMPLETED: Ultra-Modern 3D Animated News Section with Advanced Features**
  - Created comprehensive news system with permanent archive capabilities  
  - Built 3D-styled news components using Framer Motion for animations
  - Implemented NewsHero with animated background elements and featured article display
  - Created NewsGrid with 3D hover effects, parallax scrolling, and interactive cards
  - Added NewsSearch with animated filters, category selection, and live suggestions
  - Built ParticleBackground with CSS-based animated particles and floating shapes
  - **NEW: Created advanced 3D components as requested:**
    - NewsGlobe: Interactive 3D rotating globe with animated news hotspots
    - HolographicUI: Complete set of futuristic UI components (buttons, cards, badges, glitch text)
    - FloatingCards: 3D perspective news cards with depth-based positioning and particle effects
    - NewsArchive: Advanced permanent archive system with timeline and grid views
  - Database schema designed for permanent news storage (NEVER auto-deletes articles)
  - API routes created for news CRUD operations, search, filtering, and bulk upload
  - Seeded database with 6 comprehensive news articles covering UPSC, IIM, DU, Chemistry Olympiad, NEP 2025, and Union Budget
  - News categories: Academic, Exam, Scholarship, Career, Technology, Sports, General
  - Features: Featured articles, view counting, likes, shares, permanent archiving
  - Enhanced navigation with holographic buttons to switch between latest news and archive
  - Responsive design optimized for mobile, tablet, and desktop
  - Performance optimized with lazy loading and intersection observers

### July 25, 2025
- **COMPLETED: Migration from Replit Agent to Replit environment**
  - Fixed Node.js dependencies (tsx, express, @types packages)
  - Resolved TypeScript configuration issues
  - Server successfully running on port 5000
  - Vite hot reloading working properly
  - All 30+ tools and PDF converter fully functional
- **COMPLETED: ULTRA-COMPREHENSIVE PERFORMANCE OPTIMIZATION**
  - **Lazy Loading & Code Splitting**: Implemented React.lazy() for all main components
  - **Optimized Three.js Scene**: Reduced object count from 60 to 30, disabled antialiasing, limited pixel ratio
  - **GPU Acceleration**: Added transform-gpu and will-change CSS properties for smooth animations
  - **Memoization**: Applied React.memo to all performance-critical components
  - **Intersection Observer**: Lazy load 3D scene and tools only when visible
  - **Throttled Scroll Events**: Optimized scroll handlers with requestAnimationFrame
  - **CSS Performance**: Added GPU-accelerated transitions and reduced motion support
  - **Bundle Optimization**: Manual chunk splitting for vendor libraries
  - **Memory Management**: Proper cleanup of Three.js resources and event listeners
  - **Virtual Scrolling Ready**: Created VirtualizedToolGrid for handling large tool lists
- Fixed React Fragment error in HowItWorks component
- **COMPLETED: Enhanced PDF to Word Converter Tool**
  - **MAJOR UPGRADE**: Implemented pdf2docx for perfect layout preservation
  - Added high-quality conversion that maintains exact formatting, fonts, tables, images
  - Built comprehensive backend with Python, pdf2docx, PyMuPDF, Tesseract OCR
  - Implemented modern 3D glassmorphic UI with drag & drop
  - Added secure auto-expiring download system (4-minute timer)
  - Enhanced OCR support for scanned PDFs with improved accuracy
  - Created responsive design for mobile/tablet/desktop
  - Added real-time progress tracking and animations
  - Implemented secure file handling with automatic cleanup
  - Successfully integrated with existing StudentHub platform
  - Tool accessible via Tools → PDF Tools → "PDF to Word"
- **COMPLETED: Word to PDF and PDF to PowerPoint Converters**
  - Added Word to PDF converter using LibreOffice backend
  - Updated PDF to PowerPoint converter with Python processing
  - Integrated both tools into existing UI structure
  - Installed required system dependencies (LibreOffice)
- **COMPLETED: Lenis Smooth Scrolling Integration**
  - Added @studio-freight/lenis for enhanced user experience
  - Configured smooth scrolling with optimal performance settings

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens for educational themes
- **3D Graphics**: Three.js for interactive 3D elements and animations
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement via Vite integration

## Key Components

### Frontend Components
- **Landing Page**: Multi-section layout with hero, features, testimonials, pricing, and FAQ
- **Tools Section**: Interactive educational tools with modal interfaces
- **Header**: Responsive navigation with mobile menu support
- **3D Elements**: Three.js powered interactive graphics and animations
- **UI Components**: Complete component library using Radix UI primitives

### Backend Services
- **Route Management**: Centralized route registration system
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Error Handling**: Global error middleware with structured responses
- **Static Serving**: Development and production static file serving

### Tool Categories (30+ Tools)
- **PDF Tools**: Merge, Split, Compress, Protect, Unlock, Edit, Sign, Watermark, Rotate PDFs; Convert PDF↔Word/PPT/Excel/JPG; OCR PDF; Text to PDF
- **Image Tools**: Crop, Compress, Convert (JPG↔PNG↔WebP↔TIFF↔BMP), Resize, Remove Background, Image Editor, PDF↔Image conversion
- **AI & Text Tools**: Grammar Checker, Text Summarizer, Quick Notepad, Voice to Notes, AI Study Planner, Smart Flashcards, Formula Solver, Screenshot OCR
- **File Converters**: Convert between DOCX, PDF, XLSX, TXT and other formats

## Data Flow

### User Authentication Flow
1. User registration/login through form submission
2. Backend validates credentials and creates session
3. Session stored in PostgreSQL using connect-pg-simple
4. Protected routes verify session on each request

### Tool Usage Flow
1. User selects tool from tools page
2. Modal opens with tool-specific interface
3. File upload triggers frontend validation
4. Backend processes file and returns result
5. User can download processed file

### Content Management Flow
1. Question papers and materials stored in database
2. Search and filtering handled by backend queries
3. Download tracking and analytics collected
4. Premium content gated by subscription status

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for data persistence
- **AI Services**: OpenAI GPT-4 and Google Gemini API with automatic fallback
- **File Processing**: pdf-lib, sharp, tesseract.js, multer for comprehensive file manipulation
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS with glassmorphism effects and 3D animations
- **Animation**: Framer Motion and Lottie for smooth transitions and effects

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: ESLint and TypeScript compiler for type checking
- **Development**: Hot module replacement and error overlay for debugging

## Deployment Strategy

### Build Process
1. Frontend built using Vite into `dist/public` directory
2. Backend compiled using esbuild for Node.js compatibility
3. Database migrations applied using Drizzle Kit
4. Environment variables configured for production

### Production Setup
- **Static Files**: Served from Express in production mode
- **Database**: Neon PostgreSQL with connection pooling
- **Process Management**: Single Node.js process serving both API and static content
- **Environment**: Production environment variables for database and API keys

### Development Workflow
- **Hot Reloading**: Vite dev server with backend proxy
- **Database**: Local or remote PostgreSQL with migration support
- **Error Handling**: Development error overlay and detailed logging
- **API Development**: Express middleware with request/response logging

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns, while maintaining development efficiency through integrated tooling and hot reloading capabilities.