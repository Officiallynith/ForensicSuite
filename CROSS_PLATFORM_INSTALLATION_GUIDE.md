# DAFF Framework: Cross-Platform Installation and Troubleshooting Guide
## Complete Setup Guide for Windows and Linux Systems

**Software:** DAFF (Digital Automation Forensic Framework) v2.1  
**Last Updated:** January 2025  
**Target Audience:** Computer Science Students, Forensic Professionals, System Administrators  

---

## Table of Contents

1. [Overview](#overview)
2. [Windows Installation](#windows-installation)
3. [Linux Installation](#linux-installation)
4. [Cross-Platform Configuration](#cross-platform-configuration)
5. [Troubleshooting Matrix](#troubleshooting-matrix)
6. [Performance Optimization](#performance-optimization)
7. [Support Resources](#support-resources)

---

## Overview

DAFF (Digital Automation Forensic Framework) is a professional forensic analysis platform that requires specific system configurations and dependencies. This guide provides comprehensive installation instructions for both Windows and Linux environments, ensuring successful deployment regardless of your operating system.

**What is DAFF?**
- AI-powered digital forensic analysis platform
- Real-time threat detection and monitoring
- Professional tools interface for cybersecurity analysis
- Academic research platform for computer science education

---

## Windows Installation

### 1. System Requirements

#### Minimum Requirements
```
Operating System: Windows 10 (Build 1903 or higher)
Processor: Intel Core i3 4th Gen / AMD Ryzen 3 2200G
Memory (RAM): 8 GB
Storage: 10 GB available space
Network: Broadband internet connection
Graphics: DirectX 11 compatible
```

#### Recommended Requirements
```
Operating System: Windows 11 22H2 or Windows 10 22H2
Processor: Intel Core i5 8th Gen / AMD Ryzen 5 3600
Memory (RAM): 16 GB or higher
Storage: 25 GB available space (SSD preferred)
Network: High-speed broadband connection
Graphics: Dedicated GPU with 2GB VRAM
```

#### Software Dependencies
- **Windows PowerShell 5.1** or higher (usually pre-installed)
- **Windows Defender** or compatible antivirus (temporarily disabled during installation)
- **Administrator privileges** for installation process

### 2. Installation Steps

#### Step 1: Prepare Your System
```powershell
# Open PowerShell as Administrator
# Press Windows + X, then select "Windows PowerShell (Admin)"

# Check PowerShell version
$PSVersionTable.PSVersion

# Enable script execution (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Step 2: Install Node.js
1. **Download Node.js:**
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS version (Long Term Support)
   - Choose "Windows Installer (.msi)" for your system architecture

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **Important:** Check "Add to PATH" option during installation
   - Accept the license agreement and install

3. **Verify Installation:**
   ```cmd
   # Open Command Prompt (cmd) or PowerShell
   node --version
   npm --version
   ```

#### Step 3: Install Git for Windows
1. **Download Git:**
   - Visit [git-scm.com](https://git-scm.com/)
   - Download "Git for Windows"

2. **Installation Options:**
   - Use default settings for most options
   - **Important selections:**
     - "Git from the command line and also from 3rd-party software"
     - "Use Windows' default console window"
     - "Enable Git Credential Manager"

3. **Verify Installation:**
   ```cmd
   git --version
   ```

#### Step 4: Set Up Database (PostgreSQL)
1. **Option A: Install PostgreSQL Locally**
   - Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Run the installer with default settings
   - Remember the password you set for the 'postgres' user
   - Default port: 5432

2. **Option B: Use Neon Serverless (Recommended)**
   - Visit [neon.tech](https://neon.tech/)
   - Create a free account
   - Create a new database project
   - Copy the connection string for later use

#### Step 5: Download and Install DAFF
```cmd
# Create a project directory
mkdir C:\DAFF-Framework
cd C:\DAFF-Framework

# Clone the repository (replace with actual repository URL)
git clone [REPOSITORY_URL] .

# Install dependencies
npm install

# This process may take 5-10 minutes depending on internet speed
```

#### Step 6: Configure Environment
1. **Create Environment File:**
   ```cmd
   # In the project directory, create .env file
   echo. > .env
   ```

2. **Edit .env file using Notepad:**
   ```cmd
   notepad .env
   ```

3. **Add Configuration:**
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/daff_framework
   
   # For Neon serverless, use your connection string:
   # DATABASE_URL=postgresql://user:pass@host.neon.tech/database
   
   # AI Services (obtain from OpenAI)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Application Settings
   NODE_ENV=development
   PORT=5000
   ```

#### Step 7: Initialize Database
```cmd
# Push database schema
npm run db:push

# Start the application
npm run dev
```

### 3. Common Installation Errors (Windows)

#### Error: "Node.js is not recognized"
**Symptoms:** Command 'node' is not recognized as an internal or external command

**Solutions:**
1. **Restart Command Prompt/PowerShell** after Node.js installation
2. **Check PATH environment variable:**
   ```cmd
   echo %PATH%
   ```
   Look for Node.js installation path (usually `C:\Program Files\nodejs\`)

3. **Manually add to PATH:**
   - Press Windows + R, type `sysdm.cpl`
   - Go to "Advanced" tab → "Environment Variables"
   - Edit "Path" in System Variables
   - Add Node.js installation directory

#### Error: "npm install fails with permission errors"
**Symptoms:** EACCES or permission denied errors during npm install

**Solutions:**
1. **Run as Administrator:**
   ```cmd
   # Open Command Prompt as Administrator
   npm install
   ```

2. **Configure npm permissions:**
   ```cmd
   npm config set prefix %APPDATA%\npm
   ```

3. **Clear npm cache:**
   ```cmd
   npm cache clean --force
   ```

#### Error: "Database connection failed"
**Symptoms:** "connection refused" or "database does not exist" errors

**Solutions:**
1. **Verify PostgreSQL is running:**
   ```cmd
   # Check if PostgreSQL service is running
   sc query postgresql-x64-13
   ```

2. **Start PostgreSQL service:**
   ```cmd
   net start postgresql-x64-13
   ```

3. **Create database manually:**
   ```cmd
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE daff_framework;
   ```

#### Error: "Port 5000 already in use"
**Symptoms:** "EADDRINUSE" error when starting the application

**Solutions:**
1. **Find process using port:**
   ```cmd
   netstat -ano | findstr :5000
   ```

2. **Kill the process:**
   ```cmd
   taskkill /PID [process_id] /F
   ```

3. **Use different port:**
   ```env
   # In .env file
   PORT=5001
   ```

### 4. Post-Installation Configuration (Windows)

#### Windows Defender Configuration
1. **Add exclusions for better performance:**
   - Open Windows Security
   - Go to Virus & threat protection
   - Add exclusions for:
     - DAFF project folder
     - Node.js installation folder
     - npm global modules folder

#### Firewall Configuration
```cmd
# Allow Node.js through Windows Firewall (run as Administrator)
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe"
```

#### Performance Optimization
1. **Increase Node.js memory limit:**
   ```cmd
   # Set environment variable
   set NODE_OPTIONS=--max-old-space-size=4096
   ```

2. **Configure npm for performance:**
   ```cmd
   npm config set registry https://registry.npmjs.org/
   npm config set audit false
   ```

---

## Linux Installation

### 1. System Requirements

#### Minimum Requirements
```
Distribution: Ubuntu 18.04 LTS / CentOS 7 / Debian 9
Processor: Intel Core i3 / AMD equivalent (2 cores, 2.0 GHz)
Memory (RAM): 4 GB
Storage: 8 GB available space
Network: Stable internet connection
```

#### Recommended Requirements
```
Distribution: Ubuntu 22.04 LTS / CentOS Stream 9 / Debian 11
Processor: Intel Core i5 / AMD Ryzen 5 (4+ cores, 3.0 GHz)
Memory (RAM): 8 GB or higher
Storage: 20 GB available space (SSD preferred)
Network: High-speed internet connection
```

#### Required Packages
- **curl** or **wget** for downloading packages
- **git** for version control
- **build-essential** for compiling native modules
- **python3** and **python3-pip** for some dependencies

### 2. Installation Steps

#### Step 1: Update System Packages
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL/Fedora
sudo dnf update -y
# or for older CentOS
sudo yum update -y
```

#### Step 2: Install Required Dependencies
```bash
# Ubuntu/Debian
sudo apt install -y curl git build-essential python3 python3-pip

# CentOS/RHEL/Fedora
sudo dnf install -y curl git gcc gcc-c++ make python3 python3-pip
# or for older CentOS
sudo yum install -y curl git gcc gcc-c++ make python3 python3-pip
```

#### Step 3: Install Node.js using Node Version Manager (NVM)
```bash
# Download and install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install latest LTS Node.js
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

**Alternative: Install Node.js via Package Manager**
```bash
# Ubuntu/Debian (NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL/Fedora
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo dnf install -y nodejs
```

#### Step 4: Install and Configure PostgreSQL
```bash
# Ubuntu/Debian
sudo apt install -y postgresql postgresql-contrib

# CentOS/RHEL/Fedora
sudo dnf install -y postgresql postgresql-server postgresql-contrib

# For CentOS, initialize database
sudo postgresql-setup --initdb
```

**Start and Enable PostgreSQL:**
```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database user and database
sudo -u postgres psql

# In PostgreSQL shell:
CREATE USER daff_user WITH PASSWORD 'secure_password';
CREATE DATABASE daff_framework OWNER daff_user;
GRANT ALL PRIVILEGES ON DATABASE daff_framework TO daff_user;
\q
```

#### Step 5: Clone and Install DAFF
```bash
# Create project directory
mkdir ~/DAFF-Framework
cd ~/DAFF-Framework

# Clone repository
git clone [REPOSITORY_URL] .

# Install dependencies
npm install

# If you encounter permission issues:
sudo npm install --unsafe-perm
```

#### Step 6: Configure Environment
```bash
# Create environment file
nano .env

# Add configuration:
```
```env
# Database Configuration
DATABASE_URL=postgresql://daff_user:secure_password@localhost:5432/daff_framework

# AI Services
OPENAI_API_KEY=your_openai_api_key_here

# Application Settings
NODE_ENV=development
PORT=5000

# Linux specific settings
PGHOST=localhost
PGPORT=5432
PGUSER=daff_user
PGPASSWORD=secure_password
PGDATABASE=daff_framework
```

#### Step 7: Initialize and Start Application
```bash
# Initialize database schema
npm run db:push

# Start development server
npm run dev

# For production (optional)
npm run build
npm start
```

### 3. Common Installation Errors (Linux)

#### Error: "Permission denied" during npm install
**Symptoms:** EACCES errors when installing packages globally

**Solutions:**
1. **Use NVM (Recommended):**
   ```bash
   # Reinstall Node.js with NVM
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   ```

2. **Configure npm permissions:**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

#### Error: "node-gyp build failed"
**Symptoms:** Native module compilation errors during npm install

**Solutions:**
1. **Install build tools:**
   ```bash
   # Ubuntu/Debian
   sudo apt install -y build-essential python3-dev

   # CentOS/RHEL/Fedora
   sudo dnf install -y gcc gcc-c++ make python3-devel
   ```

2. **Rebuild native modules:**
   ```bash
   npm rebuild
   ```

#### Error: "PostgreSQL connection refused"
**Symptoms:** "Connection refused" or "could not connect to server" errors

**Solutions:**
1. **Check PostgreSQL status:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Start PostgreSQL if stopped:**
   ```bash
   sudo systemctl start postgresql
   ```

3. **Check PostgreSQL configuration:**
   ```bash
   # Edit postgresql.conf
   sudo nano /etc/postgresql/13/main/postgresql.conf
   
   # Ensure these settings:
   listen_addresses = 'localhost'
   port = 5432
   ```

4. **Check authentication settings:**
   ```bash
   # Edit pg_hba.conf
   sudo nano /etc/postgresql/13/main/pg_hba.conf
   
   # Add line for local connections:
   local   all             all                                     md5
   ```

#### Error: "Port already in use"
**Symptoms:** EADDRINUSE error when starting application

**Solutions:**
1. **Find process using port:**
   ```bash
   sudo lsof -i :5000
   # or
   sudo netstat -tulpn | grep :5000
   ```

2. **Kill the process:**
   ```bash
   sudo kill -9 [process_id]
   ```

3. **Use different port:**
   ```bash
   # In .env file
   PORT=5001
   ```

### 4. Post-Installation Configuration (Linux)

#### System Service Configuration (Optional)
```bash
# Create systemd service file
sudo nano /etc/systemd/system/daff.service
```

```ini
[Unit]
Description=DAFF Framework
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/home/your_username/DAFF-Framework
ExecStart=/home/your_username/.nvm/versions/node/v18.19.0/bin/node server/index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable daff
sudo systemctl start daff
```

#### Firewall Configuration
```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 5000
sudo ufw enable

# CentOS/RHEL/Fedora (firewalld)
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload
```

#### Performance Optimization
```bash
# Increase file descriptor limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimize Node.js memory
echo "export NODE_OPTIONS='--max-old-space-size=4096'" >> ~/.bashrc
source ~/.bashrc
```

---

## Cross-Platform Configuration

### 1. OpenAI API Key Setup

#### Obtaining an API Key
1. **Create OpenAI Account:**
   - Visit [platform.openai.com](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to "API Keys" section

2. **Generate API Key:**
   - Click "Create new secret key"
   - Copy the key immediately (it won't be shown again)
   - Store securely for configuration

#### Configuring the API Key
```env
# In your .env file
OPENAI_API_KEY=sk-REPLACE_WITH_YOUR_ACTUAL_API_KEY
```

**Security Best Practices:**
- Never commit API keys to version control
- Use environment variables for sensitive information
- Rotate API keys regularly
- Monitor API usage and costs

### 2. Database Configuration Options

#### Option 1: Local PostgreSQL
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

#### Option 2: Neon Serverless (Cloud)
```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/database?sslmode=require
```

#### Option 3: Docker PostgreSQL
```bash
# Start PostgreSQL container
docker run --name daff-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:13

# Connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

### 3. Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | Yes |
| `OPENAI_API_KEY` | OpenAI API access key | `sk-...` | Yes |
| `NODE_ENV` | Application environment | `development` or `production` | No |
| `PORT` | Application port | `5000` | No |
| `LOG_LEVEL` | Logging verbosity | `info`, `debug`, `error` | No |
| `CORS_ORIGIN` | CORS allowed origins | `http://localhost:3000` | No |

---

## Troubleshooting Matrix

### Application Won't Start

| Symptom | Possible Cause | Solution |
|---------|----------------|----------|
| "Module not found" | Missing dependencies | Run `npm install` |
| "Database connection failed" | PostgreSQL not running | Start PostgreSQL service |
| "Port in use" | Port conflict | Change PORT in .env or kill process |
| "Permission denied" | Insufficient permissions | Run with appropriate privileges |

### Performance Issues

| Symptom | Possible Cause | Solution |
|---------|----------------|----------|
| Slow startup | Limited memory | Increase Node.js memory limit |
| High CPU usage | Multiple processes | Check for duplicate instances |
| Memory leaks | Long-running processes | Restart application periodically |
| Database timeouts | Connection pool issues | Optimize database configuration |

### Feature Malfunctions

| Symptom | Possible Cause | Solution |
|---------|----------------|----------|
| AI analysis fails | Invalid API key | Verify OpenAI API key |
| File uploads fail | Storage permissions | Check file system permissions |
| Real-time updates don't work | WebSocket issues | Check firewall and proxy settings |
| Reports not generating | Missing dependencies | Install required packages |

---

## Performance Optimization

### System-Level Optimizations

#### Windows
```cmd
# Increase virtual memory
# Control Panel → System → Advanced → Performance Settings → Advanced → Virtual Memory

# Disable unnecessary startup programs
# Task Manager → Startup tab → Disable non-essential programs

# Configure Windows for performance
# Control Panel → System → Advanced → Performance Settings → "Adjust for best performance"
```

#### Linux
```bash
# Increase swap space
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to /etc/fstab for persistence
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize TCP settings
echo 'net.core.rmem_max = 16777216' | sudo tee -a /etc/sysctl.conf
echo 'net.core.wmem_max = 16777216' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Application-Level Optimizations

#### Node.js Configuration
```bash
# Set memory limits
export NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=512"

# Enable V8 optimizations
export NODE_OPTIONS="$NODE_OPTIONS --optimize-for-size"
```

#### PostgreSQL Tuning
```sql
-- Optimize PostgreSQL settings
-- Edit postgresql.conf

shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

---

## Support Resources

### Official Documentation
- **DAFF Framework README**: Located in project root directory
- **Installation Guide**: INSTALLATION.md in project repository
- **API Documentation**: Available in `/docs` folder after installation

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Academic Support**: Contact JSS Science and Technology University
- **Professional Forums**: Stack Overflow, Reddit r/cybersecurity

### Professional Services
- **Consulting**: Available through university partnerships
- **Training**: Custom training programs for organizations
- **Integration Support**: Enterprise deployment assistance

### Emergency Troubleshooting
If you encounter critical issues that prevent installation:

1. **Check System Logs:**
   - Windows: Event Viewer
   - Linux: `/var/log/syslog` or `journalctl`

2. **Gather System Information:**
   ```bash
   # Create diagnostic report
   npm run diagnostics > diagnostic-report.txt
   ```

3. **Contact Support with:**
   - Operating system version
   - Node.js version
   - Error messages (full stack traces)
   - System specifications
   - Installation steps attempted

---

## Verification Checklist

After completing installation, verify your setup:

- [ ] Node.js installed and accessible via command line
- [ ] Git installed and configured
- [ ] PostgreSQL running and accessible
- [ ] DAFF application starts without errors
- [ ] Web interface accessible at http://localhost:5000
- [ ] Database connection successful
- [ ] OpenAI API integration working
- [ ] File upload functionality operational
- [ ] Report generation working
- [ ] All keyboard shortcuts functional

**Installation Complete!** Your DAFF framework should now be fully operational. For ongoing maintenance and updates, refer to the project documentation and keep your system packages up to date.

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Compatibility:** DAFF Framework v2.1  
**Supported Platforms:** Windows 10/11, Ubuntu 18.04+, CentOS 7+, Debian 9+