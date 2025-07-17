# DAFF Local Installation - Quick Start Guide

## 🏠 Complete Offline Installation for DAFF Digital Forensic Framework

This guide provides everything you need to install and run DAFF completely locally on your machine, with no external dependencies or internet requirements after initial setup.

---

## 📋 What You Get

✅ **Complete Privacy** - All data stays on your machine  
✅ **No Internet Required** - Runs completely offline  
✅ **Professional Interface** - Linux tools-inspired forensic interface  
✅ **Automated Backups** - Built-in backup and recovery system  
✅ **Multi-Platform** - Windows, macOS, and Linux support  
✅ **Security Focused** - Local-only operation with encryption  

---

## 🚀 Quick Installation

### Option 1: Automated Installation (Recommended)

#### Windows
1. Download `install-windows.bat`
2. Right-click and select "Run as administrator"
3. Follow the prompts

#### macOS
```bash
curl -O [download-url]/install-macos.sh
chmod +x install-macos.sh
./install-macos.sh
```

#### Linux
```bash
curl -O [download-url]/install-linux.sh
chmod +x install-linux.sh
./install-linux.sh
```

### Option 2: Manual Installation

1. **System Requirements Check**
   - Node.js 18+ 
   - PostgreSQL 12+
   - 8GB+ RAM (recommended)
   - 20GB+ free disk space

2. **Download DAFF**
   ```bash
   git clone [repository-url] daff-local
   cd daff-local
   ```

3. **Run Installation Wizard**
   ```bash
   node scripts/install-local.js
   ```

---

## 📁 File Structure After Installation

```
daff-local/
├── 📄 LOCAL_INSTALLATION_GUIDE.md    # Complete installation guide
├── 📁 scripts/
│   ├── 🔧 install-local.js           # Interactive installation wizard
│   ├── 💾 backup.js                  # Backup management system
│   └── 🏥 health-check.js            # System health monitoring
├── 📁 local_storage/
│   ├── 📁 evidence/                  # Evidence file storage
│   ├── 📁 backups/                   # Automated backups
│   └── 📁 logs/                      # Application logs
├── 🔧 install-windows.bat            # Windows installer
├── 🔧 install-linux.sh               # Linux installer
├── 🔧 install-macos.sh               # macOS installer
└── ⚙️ .env.local                     # Local configuration
```

---

## 🎯 Daily Operations

### Starting DAFF
```bash
# Method 1: Direct start
npm start

# Method 2: Platform-specific scripts
./start-daff.sh        # Linux/macOS
start-daff.bat         # Windows

# Method 3: System service (Linux)
sudo systemctl start daff-local
```

### Health Monitoring
```bash
# Complete health check
node scripts/health-check.js

# Quick status check
./status-daff.sh       # Linux/macOS
```

### Backup Management
```bash
# Create backup
node scripts/backup.js create

# List backups
node scripts/backup.js list

# Restore backup
node scripts/backup.js restore /path/to/backup

# Automated daily backups
node scripts/backup.js schedule 24
```

---

## 🔒 Security Features

### Local-Only Operation
- Server binds only to localhost (127.0.0.1)
- No external network access required
- Firewall configured for local access only

### Data Protection
- Database encryption at rest
- Secure file permissions (750/600)
- Strong session secrets (256-bit)
- Evidence file integrity verification

### Access Control
- Local user authentication
- Session timeout management
- Failed login attempt protection
- Audit logging for all activities

---

## 🛠️ Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "Port 5000 in use" | Change port in `.env.local` or kill existing process |
| Database connection failed | Check PostgreSQL service status and credentials |
| Permission denied | Run `chmod 755` on storage directories (Linux/macOS) |
| High memory usage | Restart application or increase Node.js memory limit |

### Diagnostic Commands
```bash
# System health check
node scripts/health-check.js full

# Database connectivity
node scripts/health-check.js database

# Storage systems
node scripts/health-check.js storage

# View application logs
tail -f local_storage/logs/application.log
```

---

## 📊 Performance Optimization

### System Tuning
```bash
# Increase Node.js memory (if needed)
export NODE_OPTIONS="--max-old-space-size=4096"

# PostgreSQL optimization (edit postgresql.conf)
shared_buffers = 256MB
effective_cache_size = 1GB
```

### Storage Management
- Regular backup cleanup (automated)
- Log rotation (weekly)
- Evidence file compression
- Database maintenance (VACUUM ANALYZE)

---

## 🔄 Maintenance Schedule

### Daily (Automated)
- ✅ Database backup creation
- ✅ Log file rotation
- ✅ Temporary file cleanup
- ✅ Health status monitoring

### Weekly (User Action)
- 📋 Review security logs
- 📊 Check storage usage
- 🔍 Verify backup integrity
- ⚡ Performance analysis

### Monthly (User Action)
- 🔄 Software updates
- 🔧 Database maintenance
- 🛡️ Security review
- 📈 Capacity planning

---

## 📞 Support Resources

### Self-Service Diagnostics
1. **Health Check**: `node scripts/health-check.js`
2. **Log Analysis**: Check `local_storage/logs/`
3. **Backup Verification**: `node scripts/backup.js list`

### Documentation
- 📖 **Complete Guide**: `LOCAL_INSTALLATION_GUIDE.md`
- 🔧 **Configuration**: `.env.local` file
- 📝 **Project Notes**: `replit.md`

### Emergency Recovery
```bash
# Restore from latest backup
node scripts/backup.js restore $(ls -t local_storage/backups/ | head -1)

# Reset to clean state
npm run db:push --force

# Rebuild application
npm run build
```

---

## 🎓 For Academic Use

This installation is specifically designed for academic research and educational purposes:

- **Student**: Nithin H K
- **Institution**: JSS Science and Technology University
- **Project**: DAFF - Digital Automation Forensic Framework
- **Supervisor**: Prof. Shwetha S

The local installation ensures:
- Complete data privacy for research
- Offline operation for presentations
- Reproducible results for academic validation
- Compliance with institutional data policies

---

## 📈 What's Next?

After successful installation:

1. **First Time Setup**
   - Create admin user account
   - Configure backup schedule
   - Test evidence upload functionality

2. **Explore Features**
   - Multi-pane forensic interface
   - AI-powered evidence analysis
   - Real-time threat intelligence
   - Comprehensive reporting system

3. **Production Use**
   - Enable auto-start service
   - Configure monitoring alerts
   - Establish backup procedures
   - Document usage policies

---

## 🚨 Important Notes

### Before You Start
- Ensure you have administrator/sudo access
- Back up any existing data
- Verify system meets minimum requirements
- Have database passwords ready

### During Installation
- Save all generated passwords securely
- Note the application access URL
- Verify health checks pass
- Test backup functionality

### After Installation
- Change default passwords
- Configure firewall rules
- Set up monitoring
- Create first forensic case

---

**Access your DAFF installation at: http://localhost:5000**

For detailed technical documentation, see `LOCAL_INSTALLATION_GUIDE.md`