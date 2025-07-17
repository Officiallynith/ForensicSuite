# DAFF Local Installation Guide
## Digital Automation Forensic Framework - Complete Local Setup

### Table of Contents
1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Local Configuration](#local-configuration)
5. [Local Data Storage Setup](#local-data-storage-setup)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance and Updates](#maintenance-and-updates)

---

## 1. Overview

### Application Architecture for Local Operation

DAFF is designed as a full-stack forensic investigation platform that can operate completely offline on your local machine. The architecture consists of:

**Frontend Layer:**
- React-based web interface accessible via web browser
- Runs on `http://localhost:5000` (no domain required)
- Responsive design for desktop and mobile access
- Real-time updates through WebSocket connections

**Backend Layer:**
- Node.js Express server handling all business logic
- RESTful API for data operations
- WebSocket server for real-time communications
- File upload system for evidence management

**Database Layer:**
- Local PostgreSQL database for all data storage
- No external database connections required
- Automated schema management through migrations
- Built-in backup and restore capabilities

**Key Benefits of Local Operation:**
- Complete data privacy - nothing leaves your machine
- No internet dependency for core functionality
- Full control over data storage and security
- Faster performance due to local processing
- Compliance with strict data protection requirements

---

## 2. System Requirements

### Minimum Hardware Requirements
- **RAM:** 8GB (16GB recommended)
- **Storage:** 20GB free space (100GB+ recommended for evidence storage)
- **CPU:** Dual-core processor (Quad-core recommended)
- **Network:** Not required for operation (only for initial setup)

### Operating System Support
- **Windows:** 10 or 11 (64-bit)
- **macOS:** 10.15 Catalina or newer
- **Linux:** Ubuntu 20.04+, CentOS 8+, or equivalent

### Required Software Dependencies
- Node.js 18 or newer
- PostgreSQL 12 or newer
- Git (for installation)
- Web browser (Chrome, Firefox, Safari, or Edge)

---

## 3. Step-by-Step Installation

### Phase 1: System Preparation

#### Windows Installation
```powershell
# 1. Install Node.js
# Download from https://nodejs.org and run installer
# Verify installation
node --version
npm --version

# 2. Install PostgreSQL
# Download from https://www.postgresql.org/download/windows/
# During installation, set password for 'postgres' user
# Remember this password - you'll need it later

# 3. Install Git
# Download from https://git-scm.com/download/win
```

#### macOS Installation
```bash
# 1. Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Node.js
brew install node

# 3. Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# 4. Install Git
brew install git
```

#### Linux (Ubuntu/Debian) Installation
```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# 4. Install Git
sudo apt install git

# 5. Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Phase 2: Database Setup

#### Create Local Database
```bash
# Switch to postgres user (Linux/macOS)
sudo -u postgres psql

# For Windows, open PostgreSQL command prompt as administrator
```

```sql
-- Create database and user
CREATE DATABASE daff_local;
CREATE USER daff_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE daff_local TO daff_user;
\q
```

### Phase 3: Application Installation

#### Download and Setup DAFF
```bash
# 1. Clone the repository (or download ZIP file)
git clone [repository-url] daff-local
cd daff-local

# 2. Install dependencies
npm install

# 3. Create environment configuration
cp .env.example .env.local
```

#### Configure Environment Variables
Create `.env.local` file with the following content:
```bash
# Database Configuration
DATABASE_URL="postgresql://daff_user:your_secure_password_here@localhost:5432/daff_local"

# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Security Configuration
SESSION_SECRET="generate-a-random-32-character-string-here"

# Local Storage Paths
EVIDENCE_STORAGE_PATH="./local_storage/evidence"
BACKUP_STORAGE_PATH="./local_storage/backups"
LOG_STORAGE_PATH="./local_storage/logs"

# Optional: AI Features (requires OpenAI API key)
# OPENAI_API_KEY="your-openai-api-key-here"
```

### Phase 4: Initial Application Setup

```bash
# 1. Create storage directories
mkdir -p local_storage/evidence
mkdir -p local_storage/backups
mkdir -p local_storage/logs

# 2. Set proper permissions (Linux/macOS)
chmod 750 local_storage
chmod 750 local_storage/*

# 3. Initialize database schema
npm run db:push

# 4. Build the application
npm run build

# 5. Start the application
npm start
```

---

## 4. Local Configuration

### Application Settings

#### Performance Optimization
```javascript
// config/local.json
{
  "server": {
    "maxConcurrentUploads": 5,
    "maxFileSize": "100MB",
    "timeoutDuration": 30000
  },
  "database": {
    "connectionPool": {
      "min": 2,
      "max": 10
    },
    "queryTimeout": 10000
  },
  "storage": {
    "compressionEnabled": true,
    "automaticCleanup": true,
    "retentionDays": 365
  }
}
```

#### User Interface Configuration
```javascript
// config/ui.json
{
  "theme": "dark-forensic",
  "interface": {
    "autoSave": true,
    "autoSaveInterval": 30000,
    "maxRecentItems": 50
  },
  "security": {
    "sessionTimeout": 3600000,
    "requireReauth": false
  }
}
```

### Network Configuration (Local Only)

#### Firewall Settings
```bash
# Windows (run as administrator)
netsh advfirewall firewall add rule name="DAFF Local" dir=in action=allow protocol=TCP localport=5000

# Linux (Ubuntu)
sudo ufw allow 5000/tcp

# macOS
# No configuration needed for localhost access
```

---

## 5. Local Data Storage Setup

### Database Storage Strategy

#### Automated Backup System
Create `scripts/backup.js`:
```javascript
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class LocalBackupManager {
  constructor() {
    this.backupPath = './local_storage/backups';
    this.scheduleInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupPath, `daff-backup-${timestamp}.sql`);
    
    const command = `pg_dump -h localhost -U daff_user -d daff_local -f ${backupFile}`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log(`Backup created: ${backupFile}`);
          resolve(backupFile);
        }
      });
    });
  }

  async restoreBackup(backupFile) {
    const command = `psql -h localhost -U daff_user -d daff_local -f ${backupFile}`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log(`Database restored from: ${backupFile}`);
          resolve();
        }
      });
    });
  }

  scheduleAutomaticBackups() {
    setInterval(() => {
      this.createBackup().catch(console.error);
    }, this.scheduleInterval);
  }
}

module.exports = LocalBackupManager;
```

#### Evidence File Management
```javascript
// services/localStorage.js
class LocalEvidenceStorage {
  constructor() {
    this.storagePath = process.env.EVIDENCE_STORAGE_PATH;
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
  }

  async storeEvidence(file, caseId, evidenceId) {
    const casePath = path.join(this.storagePath, `case_${caseId}`);
    await fs.promises.mkdir(casePath, { recursive: true });
    
    const fileName = `evidence_${evidenceId}_${file.originalname}`;
    const filePath = path.join(casePath, fileName);
    
    await fs.promises.writeFile(filePath, file.buffer);
    
    // Create metadata file
    const metadata = {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploadDate: new Date().toISOString(),
      checksum: this.calculateChecksum(file.buffer)
    };
    
    await fs.promises.writeFile(
      `${filePath}.meta`,
      JSON.stringify(metadata, null, 2)
    );
    
    return filePath;
  }

  calculateChecksum(buffer) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
```

### Data Encryption for Local Storage

```javascript
// services/encryption.js
const crypto = require('crypto');

class LocalDataEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
  }

  generateKey() {
    return crypto.randomBytes(this.keyLength);
  }

  encrypt(data, key) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  decrypt(encryptedData, key) {
    const decipher = crypto.createDecipher(
      this.algorithm, 
      key, 
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

---

## 6. Security Considerations

### Local Data Protection

#### Access Control Implementation
```javascript
// middleware/localAuth.js
class LocalAuthManager {
  constructor() {
    this.sessionStore = new Map();
    this.maxAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
  }

  async authenticateUser(username, password) {
    // Check for account lockout
    if (this.isAccountLocked(username)) {
      throw new Error('Account temporarily locked due to failed attempts');
    }

    // Verify credentials against local database
    const user = await this.verifyCredentials(username, password);
    
    if (!user) {
      this.recordFailedAttempt(username);
      throw new Error('Invalid credentials');
    }

    // Clear failed attempts on success
    this.clearFailedAttempts(username);
    
    return this.createSession(user);
  }

  createSession(user) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const session = {
      userId: user.id,
      username: user.username,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };
    
    this.sessionStore.set(sessionId, session);
    return sessionId;
  }
}
```

#### Data Encryption at Rest
```bash
# Linux: Encrypt storage directory
sudo apt install ecryptfs-utils
sudo mount -t ecryptfs ./local_storage ./local_storage

# Windows: Use BitLocker for drive encryption
# macOS: Use FileVault for full disk encryption
```

#### Network Security (Local)
```javascript
// security/networkSecurity.js
const rateLimit = require('express-rate-limit');

// Rate limiting for local access
const localRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// IP whitelist for local access only
const localOnlyAccess = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const allowedIPs = ['127.0.0.1', '::1', 'localhost'];
  
  if (!allowedIPs.some(ip => clientIP.includes(ip))) {
    return res.status(403).json({ error: 'Access denied - local access only' });
  }
  
  next();
};
```

### Security Checklist

#### Initial Security Setup
- [ ] Change default database passwords
- [ ] Generate strong session secrets
- [ ] Configure firewall rules (local access only)
- [ ] Enable full disk encryption
- [ ] Set up automated backups with encryption
- [ ] Configure secure file permissions
- [ ] Disable unnecessary network services
- [ ] Enable audit logging

#### Ongoing Security Maintenance
- [ ] Regular security updates for dependencies
- [ ] Periodic password changes
- [ ] Log file monitoring and rotation
- [ ] Backup integrity verification
- [ ] Access log review
- [ ] Security configuration validation

---

## 7. Troubleshooting

### Common Installation Issues

#### Database Connection Problems
**Symptom:** "Connection refused" or "Role does not exist"
```bash
# Solution 1: Check PostgreSQL service
# Windows:
services.msc # Look for PostgreSQL service

# Linux:
sudo systemctl status postgresql

# macOS:
brew services list | grep postgresql

# Solution 2: Reset database user
sudo -u postgres psql
DROP USER IF EXISTS daff_user;
CREATE USER daff_user WITH ENCRYPTED PASSWORD 'new_password';
GRANT ALL PRIVILEGES ON DATABASE daff_local TO daff_user;
```

#### Port Already in Use
**Symptom:** "EADDRINUSE: address already in use :::5000"
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000

# Linux/macOS:
lsof -i :5000

# Kill the process or change port in .env.local
PORT=5001
```

#### Permission Denied Errors
**Symptom:** Cannot write to storage directories
```bash
# Linux/macOS: Fix permissions
sudo chown -R $USER:$USER ./local_storage
chmod -R 755 ./local_storage

# Windows: Run as administrator or check folder permissions
```

#### Memory Issues
**Symptom:** "JavaScript heap out of memory"
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

### Performance Optimization

#### Database Performance Tuning
```sql
-- PostgreSQL configuration for local use
-- Edit postgresql.conf file

shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
random_page_cost = 1.1
```

#### Application Performance
```javascript
// config/performance.json
{
  "cache": {
    "enabled": true,
    "maxSize": "100MB",
    "ttl": 3600
  },
  "compression": {
    "enabled": true,
    "level": 6
  },
  "clustering": {
    "enabled": false,
    "workers": "auto"
  }
}
```

### Error Recovery Procedures

#### Database Corruption Recovery
```bash
# 1. Stop the application
npm stop

# 2. Check database integrity
pg_dump -h localhost -U daff_user daff_local > test_dump.sql

# 3. If corrupted, restore from backup
psql -h localhost -U daff_user -d daff_local < ./local_storage/backups/latest-backup.sql

# 4. Restart application
npm start
```

#### Evidence File Recovery
```bash
# 1. Check file system integrity
# Linux:
sudo fsck /dev/sdX

# Windows:
chkdsk C: /f

# 2. Restore from backup if needed
cp -r ./local_storage/backups/evidence/* ./local_storage/evidence/
```

---

## 8. Maintenance and Updates

### Routine Maintenance Schedule

#### Daily Tasks (Automated)
- Database backup creation
- Log file rotation
- Temporary file cleanup
- System health monitoring

#### Weekly Tasks
- Backup integrity verification
- Security log review
- Performance metrics analysis
- Storage space monitoring

#### Monthly Tasks
- Software dependency updates
- Security configuration review
- Database maintenance (VACUUM, ANALYZE)
- System optimization review

### Update Procedures

#### Application Updates
```bash
# 1. Backup current installation
cp -r daff-local daff-local-backup-$(date +%Y%m%d)

# 2. Download new version
git pull origin main
# or download new ZIP file

# 3. Update dependencies
npm install

# 4. Run database migrations
npm run db:push

# 5. Rebuild application
npm run build

# 6. Test functionality
npm run test

# 7. Restart application
npm restart
```

#### Security Updates
```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Manual review of critical issues
npm audit --audit-level critical
```

### Monitoring and Logging

#### Health Check Script
```bash
#!/bin/bash
# scripts/health-check.sh

echo "DAFF Local Health Check - $(date)"
echo "=================================="

# Check application status
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✓ Application is running"
else
    echo "✗ Application is not responding"
fi

# Check database connection
if pg_isready -h localhost -U daff_user > /dev/null; then
    echo "✓ Database is accessible"
else
    echo "✗ Database is not accessible"
fi

# Check storage space
STORAGE_USAGE=$(df -h ./local_storage | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $STORAGE_USAGE -lt 90 ]; then
    echo "✓ Storage usage: ${STORAGE_USAGE}%"
else
    echo "⚠ Storage usage high: ${STORAGE_USAGE}%"
fi

echo "=================================="
```

### Backup and Recovery Strategy

#### Automated Backup Script
```bash
#!/bin/bash
# scripts/automated-backup.sh

BACKUP_DIR="./local_storage/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create database backup
pg_dump -h localhost -U daff_user daff_local > "$BACKUP_DIR/db_backup_$DATE.sql"

# Create evidence files backup
tar -czf "$BACKUP_DIR/evidence_backup_$DATE.tar.gz" ./local_storage/evidence/

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "*.sql" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

---

## Quick Start Checklist

### Pre-Installation
- [ ] Verify system requirements
- [ ] Download required software (Node.js, PostgreSQL, Git)
- [ ] Create installation directory
- [ ] Ensure sufficient disk space

### Installation Process
- [ ] Install system dependencies
- [ ] Set up PostgreSQL database
- [ ] Download DAFF application
- [ ] Configure environment variables
- [ ] Create storage directories
- [ ] Initialize database schema
- [ ] Build and start application

### Post-Installation
- [ ] Verify application access at http://localhost:5000
- [ ] Test database connectivity
- [ ] Configure automatic backups
- [ ] Set up monitoring scripts
- [ ] Create initial user account
- [ ] Test evidence upload functionality

### Security Setup
- [ ] Change default passwords
- [ ] Configure firewall rules
- [ ] Enable disk encryption
- [ ] Set up access logging
- [ ] Verify local-only access
- [ ] Test backup and restore procedures

---

## Support and Resources

### Local Documentation
- Configuration files: `./config/`
- Log files: `./local_storage/logs/`
- Backup files: `./local_storage/backups/`
- User manual: `./docs/user-guide.md`

### Emergency Contacts
- System Administrator: [Your Contact Information]
- Database Administrator: [Your Contact Information]
- Security Officer: [Your Contact Information]

### Additional Resources
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Node.js Documentation: https://nodejs.org/docs/
- Express.js Documentation: https://expressjs.com/
- React Documentation: https://reactjs.org/docs/

---

*This installation guide ensures complete local operation of the DAFF system with no external dependencies. All data remains on your local machine, providing maximum security and privacy for forensic investigations.*