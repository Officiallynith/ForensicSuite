# Overview

This is a full-stack digital forensics and cybersecurity investigation platform built with a modern tech stack. The application provides real-time threat intelligence, AI-powered evidence analysis, and comprehensive case management capabilities for forensic investigators and cybersecurity professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## Academic Project Information

**Student:** Nithin H K
**Institution:** JSS Mahavidyapeetha, JSS Science and Technology University, Mysuru – 570 006
**Department:** Computer Science
**Guide:** Shwetha S, Assistant Professor, Department of Computer Science
**Project:** DAFF: Digital Automation Forensic Framework

## Recent Research Task (January 2025)
User requested comprehensive analysis of high-quality datasets for DFF framework context, focusing on current global challenges including deepfake detection, cryptocurrency forensics, IoT security, and social media manipulation. Research completed covering:
- NIST CFReDS datasets and current status
- DFRWS challenge datasets through 2023
- Modern threats: AI-generated content, blockchain forensics, IoT security
- Current limitations and gaps in available datasets

## System Architecture

The application follows a monorepo structure with a clear separation between client and server code:

- **Frontend**: React + TypeScript with Vite for development and build tooling
- **Backend**: Express.js with TypeScript for API and server logic
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Communication**: WebSocket server for live updates
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Library**: Built on Radix UI primitives with shadcn/ui styling
- **Theme System**: Dark forensic theme with custom CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: WebSocket integration for live data feeds
- **Type Safety**: Full TypeScript coverage with shared schemas

### Backend Architecture
- **API Layer**: RESTful endpoints with Express.js
- **Data Access**: Drizzle ORM with PostgreSQL for structured data
- **Storage**: In-memory storage interface with database fallback
- **Real-time**: WebSocket server for broadcasting updates
- **AI Integration**: OpenAI GPT-4o for evidence analysis
- **File Upload**: Multer middleware for evidence file handling

### Database Schema
Key entities include:
- **Users**: Authentication and role-based access
- **Cases**: Investigation case management
- **Evidence**: File-based evidence with AI analysis results
- **Threats**: Real-time threat intelligence feed
- **AI Analysis Jobs**: Background processing status
- **Notifications**: User alert system

**Recent Update (Jan 2025)**: Migrated from in-memory storage to PostgreSQL database using Drizzle ORM for persistent data storage and improved scalability.

**Latest Addition (Jan 2025)**: Implemented automated DAFF analysis system with intelligent flagging capabilities:
- **Positive (+)**: Legitimate/safe content detection
- **Negative (-)**: Confirmed threat identification  
- **Suspicious (=)**: Content requiring further investigation
- Self-sufficient processing with minimal human oversight
- Real-time and batch analysis capabilities

## Data Flow

1. **Evidence Upload**: Files uploaded through REST API with metadata extraction
2. **AI Analysis Pipeline**: Background jobs process evidence using OpenAI services
3. **Real-time Updates**: WebSocket broadcasts notify clients of status changes
4. **Threat Intelligence**: External feeds simulate real-time security updates
5. **Case Management**: Evidence linked to cases with progress tracking

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon serverless
- **AI Services**: OpenAI GPT-4o for content analysis
- **Session Management**: PostgreSQL session store
- **UI Components**: Radix UI primitives
- **Real-time**: Native WebSocket implementation

### Development Tools
- **Build System**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: Express with Vite middleware integration

## Deployment Strategy

The application is designed for Replit deployment with:

- **Development Mode**: Vite dev server with HMR and Express API
- **Production Build**: Static React build with Express server
- **Database**: External PostgreSQL connection via environment variables
- **Environment**: Node.js ESM modules with TypeScript compilation
- **Static Assets**: Served through Express in production

The build process creates a unified distribution with both client and server components, suitable for container deployment or traditional hosting environments.