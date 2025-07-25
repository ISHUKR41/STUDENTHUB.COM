# StudentHub.com - Educational Platform

## Overview

StudentHub.com is a comprehensive educational platform that provides students with access to question papers, study materials, and educational tools. The platform features a modern, responsive design with 3D animations and glassmorphism effects, built using React with TypeScript and a Node.js/Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

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

### Educational Tools
- **PDF Tools**: Merge, split, compress, and convert PDF files
- **Image Tools**: Resize, compress, crop, and convert images
- **Text Tools**: Convert text to PDF and other document formats
- **AI Assistant**: Gemini AI integration for educational content analysis

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
- **AI Service**: Google Gemini API for content analysis and recommendations
- **File Processing**: Server-side libraries for PDF and image manipulation
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling

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