# DAFF Installation Guide
## Digital Automation Forensic Framework - Setup Instructions

This guide provides step-by-step instructions for installing and configuring the DAFF framework. Follow these instructions carefully to ensure proper setup.

## Prerequisites

Before installing DAFF, ensure your system meets the following requirements:

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Memory**: Minimum 8GB RAM (16GB recommended for large datasets)
- **Storage**: At least 10GB free disk space
- **Network**: Stable internet connection for AI services and updates

### Software Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: Latest version for repository management
- **PostgreSQL**: Version 12+ (or Neon serverless account)

### API Keys Required
- **OpenAI API Key**: For AI-powered analysis features
- **Database Access**: PostgreSQL connection string

## Installation Steps

### Step 1: Install Node.js

#### Windows
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### macOS
1. Using Homebrew (recommended):
   ```bash
   brew install node
   ```
2. Or download from [nodejs.org](https://nodejs.org/)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

### Step 2: Clone the Repository

```bash
# Clone the DAFF repository
git clone [REPOSITORY_URL]

# Navigate to project directory
cd DAFF-Framework

# Verify files are present
ls -la
```

### Step 3: Install Dependencies

```bash
# Install all project dependencies
npm install

# This may take a few minutes depending on your internet connection
# You should see a progress indicator and final success message
```

### Step 4: Database Setup

#### Option A: Using Neon Serverless (Recommended)
1. Create account at [neon.tech](https://neon.tech/)
2. Create a new database
3. Copy the connection string
4. Skip to Environment Configuration

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Create database user
sudo -u postgres createuser --interactive

# Create database
sudo -u postgres createdb daff_framework
```

### Step 5: Environment Configuration

Create a `.env` file in the project root directory:

```bash
# Create environment file
touch .env

# Open with your preferred editor
nano .env
```

Add the following configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/daff_framework

# For Neon serverless, use the provided connection string:
# DATABASE_URL=postgresql://username:password@host.neon.tech/database_name

# AI Services
OPENAI_API_KEY=your_openai_api_key_here

# Application Settings
NODE_ENV=development
PORT=5000

# Optional: Additional Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=daff_framework
```

### Step 6: Initialize Database

```bash
# Push database schema
npm run db:push

# Verify database connection
npm run db:check

# If successful, you should see "Database connected successfully"
```

### Step 7: Start the Application

#### Development Mode
```bash
# Start development server
npm run dev

# Application will be available at http://localhost:5000
# Hot reloading is enabled for development
```

#### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm start

# Application will be available at http://localhost:5000
```

## Verification Steps

### 1. Check Application Access
1. Open web browser
2. Navigate to `http://localhost:5000`
3. You should see the DAFF introduction page

### 2. Test Database Connection
1. Look for green status indicators on the dashboard
2. Check system status cards show "Connected"
3. No error messages in console output

### 3. Verify AI Integration
1. Navigate to Tools Interface
2. Try uploading a test evidence file
3. Check that analysis functions are available

### 4. Test Interface Navigation
1. Use keyboard shortcuts (Ctrl+1, Ctrl+2)
2. Switch between Tools and Academic interfaces
3. Verify all navigation works correctly

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Node.js not found"
**Solution:**
```bash
# Verify Node.js installation
which node
node --version

# If not found, reinstall Node.js
# Follow Step 1 instructions again
```

#### Issue: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules
npm install
```

#### Issue: "Database connection failed"
**Solution:**
1. Verify DATABASE_URL in .env file
2. Check database server is running
3. Confirm credentials are correct
4. Test connection manually:
   ```bash
   psql $DATABASE_URL
   ```

#### Issue: "OpenAI API errors"
**Solution:**
1. Verify API key in .env file
2. Check API key has sufficient credits
3. Confirm API key permissions
4. Test API key manually

#### Issue: "Port already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID)
kill -9 [PID]

# Or change port in .env file
PORT=5001
```

### Performance Issues

#### Slow Application Loading
1. Check system resources (RAM, CPU)
2. Verify database performance
3. Consider upgrading system specifications
4. Monitor network connectivity

#### Memory Issues
1. Restart the application
2. Check for memory leaks in console
3. Increase system RAM if possible
4. Close unnecessary applications

## Platform-Specific Instructions

### Windows Additional Steps

#### Install Git
1. Download from [git-scm.com](https://git-scm.com/)
2. Install with default options
3. Verify: `git --version`

#### Windows PowerShell Setup
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verify Node.js
node --version
npm --version
```

### macOS Additional Steps

#### Install Xcode Command Line Tools
```bash
xcode-select --install
```

#### Install Homebrew (if not present)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Linux Additional Steps

#### Install build essentials
```bash
sudo apt install build-essential
```

#### Install Git
```bash
sudo apt install git
```

## Configuration Options

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db` |
| `OPENAI_API_KEY` | OpenAI API access key | Yes | `sk-...` |
| `NODE_ENV` | Application environment | No | `development` or `production` |
| `PORT` | Application port | No | `5000` |
| `PGHOST` | Database host | No | `localhost` |
| `PGPORT` | Database port | No | `5432` |
| `PGUSER` | Database username | No | `postgres` |
| `PGPASSWORD` | Database password | No | `password` |
| `PGDATABASE` | Database name | No | `daff_framework` |

### Development Configuration

For development purposes, you may want to configure additional settings:

```env
# Development specific settings
DEBUG=true
LOG_LEVEL=debug
ENABLE_CORS=true
API_RATE_LIMIT=1000
```

### Production Configuration

For production deployment:

```env
# Production specific settings
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
ENABLE_CORS=false
API_RATE_LIMIT=100
```

## Next Steps

After successful installation:

1. **Read the User Guide**: Familiarize yourself with DAFF features
2. **Explore the Interface**: Try both Tools and Academic dashboards
3. **Run Test Analysis**: Upload sample evidence files
4. **Review Documentation**: Check README.md for detailed features
5. **Configure for Your Use Case**: Adjust settings as needed

## Support

If you encounter issues during installation:

1. **Check Troubleshooting Section**: Review common issues above
2. **Verify Prerequisites**: Ensure all requirements are met
3. **Review Error Messages**: Look for specific error details
4. **Check Documentation**: Refer to README.md for additional help
5. **Contact Support**: Reach out through appropriate channels

---

**Installation Complete!** 

Your DAFF framework should now be running successfully. Access the application at `http://localhost:5000` and begin exploring the digital forensic analysis capabilities.