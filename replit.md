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

**Latest Addition (Jan 2025)**: Implemented Linux tools-inspired professional forensic interface:
- **Multi-Pane Layout**: Wireshark-inspired three-pane system with Evidence List, Analysis Details, and Console panes
- **Terminal Aesthetics**: Professional dark theme with monospace fonts and Linux tool design language
- **Interactive Features**: Right-click context menus, comprehensive keyboard shortcuts, and real-time console output
- **Professional Components**: Advanced status bar with system metrics, interface toggle system, and responsive design
- **Keyboard Navigation**: Complete keyboard accessibility (Ctrl+A for analysis, Ctrl+F for filter, arrow key navigation)

**Automated DAFF Analysis System**: Intelligent flagging capabilities with positive (+), negative (-), and suspicious (=) content detection for self-sufficient processing with minimal human oversight.

**Enhancement Planning (Jan 2025)**: Created comprehensive technical enhancement plan for expanding DAFF capabilities:
- Storage management with distributed architecture and intelligent caching
- Network operations integration with real-time monitoring
- Multi-device coordination and load balancing
- Advanced security measures including blockchain integrity verification
- Performance optimization with GPU acceleration and asynchronous processing

**Forensic Report Generation (Jan 2025)**: Implemented automated AI-powered report generation system:
- Comprehensive forensic analysis reports with executive summaries
- AI insights using OpenAI GPT-4o for intelligent threat assessment
- Multi-section reports covering findings, evidence analysis, and recommendations
- Technical details with timeline creation and risk scoring algorithms
- PDF export capabilities and case-based report generation
- Real-time WebSocket notifications for report completion status

**Cross-Platform Installation Plan (Jan 2025)**: Developed comprehensive installation strategy:
- Docker containerization for consistent cross-platform deployment
- Native package managers for Windows (Chocolatey/Winget), macOS (Homebrew), Linux (APT/YUM)
- Cloud deployment templates for AWS, GCP, Azure, and DigitalOcean
- Automated installation scripts with dependency management
- Package distribution via npm, Docker Hub, and GitHub Releases

**UI/UX Dashboard Redesign (Jan 2025)**: Created multiple dashboard layout options for optimal user experience:
- **Separated Layout**: Introduction section visually distinct from main dashboard functionality
- **Tabbed Interface**: Seamless switching between academic introduction and system dashboard
- **Two-Column Layout**: Side-by-side presentation with introduction in left column, dashboard in right
- **Gradient Design**: Modern glassmorphism effects with improved visual hierarchy
- **Responsive Design**: Mobile-first approach with consistent spacing and typography
- **Accessibility**: High contrast colors, proper focus states, and screen reader compatibility

**Network & Storage Automation Plan (Jan 2025)**: Developed comprehensive automation strategy for seamless operations:
- **Automation Tools**: Suricata + ELK Stack for network monitoring, MinIO + Kafka for storage management
- **Implementation Timeline**: 16-week phased approach with specific milestones and deliverables
- **Scalability Architecture**: Microservices design with container orchestration and auto-scaling capabilities
- **Security Integration**: End-to-end encryption, RBAC, and automated vulnerability management
- **Performance Benefits**: 75% faster processing, 40% cost savings, 90% error reduction, 300% capacity increase
- **Real-time Monitoring**: Live performance metrics, quality assurance, and automated system status reporting

**Project Finalization Phase (Jan 2025)**: Created comprehensive deployment plan and Linux tools-inspired interface:
- **Repository Preparation**: Detailed Git deployment strategy with team coordination guidelines
- **Terminology Standardization**: "Linux Tools" → "Tools" interface naming, DFF clarification (Digital Forensic Framework)
- **Two-Step UI Organization**: Introduction page for academic context, main dashboard for forensic tools
- **Professional Interface**: Wireshark and Nmap-inspired design with multi-pane layout and terminal aesthetics
- **Documentation Strategy**: Comprehensive guides for installation, usage, and academic context presentation

**UI Design Enhancement (Jan 2025)**: Developed minimalistic design proposal for reduced visual complexity:
- **Professional Tool Aesthetic**: Muted color palette and simplified typography aligned with forensic tool standards
- **Usability Focus**: Reduced eye strain through darker backgrounds and desaturated accent colors
- **Industry Alignment**: Design principles based on Wireshark, Burp Suite, and professional security tools
- **Comprehensive Testing Plan**: User testing methodology with accessibility compliance and performance metrics
- **Implementation Roadmap**: 8-week deployment strategy with stakeholder feedback integration

**DAFF Security Defender System**: Comprehensive cybersecurity application with real-time protection, AI-powered threat detection, local processing, and seamless DAFF integration for evidence preservation and analysis.

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