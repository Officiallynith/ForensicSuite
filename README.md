# DAFF - Digital Automation Forensic Framework

![DAFF Logo](https://img.shields.io/badge/DAFF-Digital%20Automation%20Forensic%20Framework-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-Academic-yellow?style=for-the-badge)

## Academic Context

**Student:** Nithin H K  
**Institution:** JSS Mahavidyapeetha, JSS Science and Technology University  
**Location:** Mysuru – 570 006, Karnataka, India  
**Department:** Computer Science and Engineering  
**Project Guide:** Shwetha S, Assistant Professor  

## Project Overview

DAFF (Digital Automation Forensic Framework) is an advanced AI-driven platform designed for comprehensive digital investigation, anomaly detection, and forensic analysis. The framework leverages cutting-edge technologies to provide automated threat analysis, real-time security monitoring, and professional-grade forensic tools.

### Key Features

- 🧠 **AI-Powered Analysis**: Advanced machine learning algorithms for intelligent threat detection
- 🛡️ **Real-time Protection**: Continuous monitoring and automated response to security threats
- ⚡ **Automated Processing**: Self-sufficient flagging system with minimal human oversight
- 🔧 **Professional Interface**: Tools-inspired interface designed for forensic professionals
- 📊 **Comprehensive Reporting**: AI-powered forensic report generation with detailed analysis
- 🌐 **Multi-platform Support**: Cross-platform deployment with consistent functionality

## Terminology Clarification

**Important:** To avoid confusion, please note the following terminology:

- **DAFF**: Digital Automation Forensic Framework (this project)
- **DFF**: Digital Forensic Framework (NOT "Development Framework Framework")

The framework focuses specifically on digital forensics and cybersecurity analysis, not general development frameworks.

## Technology Stack

### Frontend
- **React 18+** with TypeScript for modern UI development
- **Tailwind CSS** for professional styling and responsive design
- **Radix UI** primitives for accessible component library
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management

### Backend
- **Node.js** with Express.js for robust server architecture
- **TypeScript** for type-safe backend development
- **PostgreSQL** via Neon serverless for reliable data storage
- **Drizzle ORM** for type-safe database operations
- **WebSocket** integration for real-time communication

### AI & Analysis
- **OpenAI GPT-4o** for advanced content analysis and threat assessment
- **Machine Learning** algorithms for anomaly detection
- **Natural Language Processing** for forensic report generation

### Security & Monitoring
- **Real-time threat intelligence** feeds
- **Automated vulnerability assessment**
- **Network traffic analysis** capabilities
- **File system monitoring** and integrity checking

## Installation Instructions

### Prerequisites

- **Node.js** 18 or higher
- **PostgreSQL** database (or Neon serverless account)
- **Git** for version control
- **OpenAI API key** for AI-powered analysis

### Step 1: Clone Repository

```bash
git clone [REPOSITORY_URL]
cd DAFF-Framework
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm run build
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=your_postgresql_connection_string

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Application Settings
NODE_ENV=development
PORT=5000
```

### Step 4: Database Setup

```bash
# Initialize database schema
npm run db:push

# Verify database connection
npm run db:check
```

### Step 5: Start Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The application will be available at `http://localhost:5000`

## User Interface Organization

The DAFF framework features a two-step user interface design:

### Step 1: Introduction Page (`/`)
- **Purpose**: Academic presentation and project overview
- **Content**: Student information, institution details, project context
- **Navigation**: Direct access to tools interface and academic dashboard

### Step 2: Main Dashboard (`/academic`)
- **Purpose**: Central hub for all forensic tools and features
- **Content**: System status, core features, security tools
- **Features**: Real-time monitoring, comprehensive tool access

### Professional Tools Interface (`/tools`)
- **Purpose**: Advanced forensic analysis interface
- **Design**: Inspired by professional tools like Wireshark and Nmap
- **Features**: Multi-pane layout, terminal-style console, keyboard shortcuts

## Core Features

### 1. Anomaly Detection
- **Current World Threats**: Analysis of contemporary cybersecurity challenges
- **AI-Powered Detection**: Machine learning algorithms for threat identification
- **Real-time Monitoring**: Continuous surveillance of digital environments

### 2. Automated Analysis
- **Self-Sufficient Processing**: Minimal human oversight required
- **Intelligent Flagging**: Automatic classification of content as positive (+), negative (-), or suspicious (=)
- **Batch Processing**: Efficient handling of large datasets

### 3. Forensic Reporting
- **AI-Generated Reports**: Comprehensive analysis documents
- **Executive Summaries**: High-level overview for stakeholders
- **Technical Details**: In-depth forensic findings and evidence analysis

### 4. Security Defender System
- **Real-time Protection**: Continuous background monitoring
- **Threat Mitigation**: Automated response to security incidents
- **Integration**: Seamless connection with forensic analysis tools

### 5. Network & Storage Automation
- **Infrastructure Management**: Automated network and storage operations
- **Performance Optimization**: Enhanced system efficiency and reliability
- **Scalability**: Designed for enterprise-level deployments

## User Guide

### Getting Started

1. **Access the Application**: Navigate to the application URL
2. **Introduction Page**: Review project overview and academic context
3. **Choose Interface**: Select either Tools Interface or Academic Dashboard
4. **Begin Analysis**: Upload evidence files and start forensic analysis

### Tools Interface Usage

1. **Evidence Management**: Use the left pane to manage evidence files
2. **Analysis Results**: Review findings in the right pane
3. **Console Output**: Monitor real-time analysis progress in the bottom pane
4. **Keyboard Shortcuts**: Use Ctrl+A (analysis), Ctrl+F (filter), Ctrl+E (export)

### Dashboard Features

1. **System Status**: Monitor database, AI engine, and threat intelligence
2. **Core Features**: Access anomaly detection, automated analysis, and reporting
3. **Security Tools**: Utilize defender system and security analytics

## Keyboard Shortcuts

### Global Navigation
- **Ctrl+1**: Switch to Tools Interface
- **Ctrl+2**: Switch to Academic Dashboard
- **F1**: Show help and shortcuts

### Tools Interface
- **Ctrl+A**: Start/Pause Analysis
- **Ctrl+F**: Focus Filter Input
- **Ctrl+E**: Export Report
- **Arrow Keys**: Navigate Evidence List
- **Tab**: Next Pane
- **Shift+Tab**: Previous Pane

## API Reference

### Evidence Analysis Endpoints

```typescript
POST /api/evidence/upload
GET /api/evidence/:id/analysis
POST /api/evidence/:id/analyze
GET /api/evidence/:id/report
```

### System Status Endpoints

```typescript
GET /api/system/status
GET /api/system/metrics
GET /api/threats/current
```

### AI Analysis Endpoints

```typescript
POST /api/ai/analyze
GET /api/ai/results/:id
POST /api/ai/report/generate
```

## Development Guide

### Project Structure

```
DAFF-Framework/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-based page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility libraries
├── server/                 # Backend Express application
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   └── middleware/         # Express middleware
├── shared/                 # Shared schemas and types
└── documentation/          # Additional documentation
```

### Development Workflow

1. **Feature Development**: Create feature branches for new functionality
2. **Code Quality**: Follow TypeScript strict mode and ESLint rules
3. **Testing**: Implement comprehensive testing for critical features
4. **Documentation**: Update documentation for new features
5. **Deployment**: Use provided deployment scripts for production

### Contributing Guidelines

1. **Code Style**: Follow existing TypeScript and React patterns
2. **Commit Messages**: Use clear, descriptive commit messages
3. **Testing**: Ensure all new features are properly tested
4. **Documentation**: Update relevant documentation sections

## Deployment

### Production Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t daff-framework .

# Run container
docker run -p 5000:5000 daff-framework
```

### Environment Variables

Ensure the following environment variables are configured for production:

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access key
- `NODE_ENV`: Set to `production`
- `PORT`: Application port (default: 5000)

## Support and Contact

### Academic Support
- **Guide**: Shwetha S, Assistant Professor
- **Department**: Computer Science and Engineering, JSS Science and Technology University
- **Email**: [Contact through official university channels]

### Technical Support
- **Issues**: Report issues through the project repository
- **Documentation**: Refer to this README and additional documentation
- **Updates**: Check repository for latest updates and releases

## License

This project is developed for academic purposes under the supervision of JSS Science and Technology University. All rights reserved for educational and research use.

## Acknowledgments

- **JSS Science and Technology University** for providing academic support and resources
- **Assistant Professor Shwetha S** for project guidance and supervision
- **Department of Computer Science** for technical infrastructure and support
- **OpenAI** for providing AI analysis capabilities through GPT-4o

---

**Version**: 2.1  
**Last Updated**: January 2025  
**Status**: Production Ready  
**Maintained by**: Nithin H K, Computer Science Department, JSS Science and Technology University