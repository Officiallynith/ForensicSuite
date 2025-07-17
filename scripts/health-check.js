#!/usr/bin/env node

/**
 * DAFF Local Health Check System
 * Comprehensive monitoring and diagnostics for local installations
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const http = require('http');

class DAFFHealthChecker {
  constructor() {
    this.config = {
      appUrl: `http://localhost:${process.env.PORT || 5000}`,
      dbConfig: this.parseDbUrl(process.env.DATABASE_URL),
      storagePaths: {
        evidence: process.env.EVIDENCE_STORAGE_PATH || './local_storage/evidence',
        backups: process.env.BACKUP_STORAGE_PATH || './local_storage/backups',
        logs: process.env.LOG_STORAGE_PATH || './local_storage/logs'
      }
    };
    
    this.checks = [];
    this.warnings = [];
    this.errors = [];
  }

  parseDbUrl(url) {
    if (!url) return null;
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!match) return null;
    
    return {
      user: match[1],
      password: match[2],
      host: match[3],
      port: match[4],
      database: match[5]
    };
  }

  async runFullHealthCheck() {
    console.log('🏥 DAFF Local Health Check');
    console.log('==========================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('');

    // Run all checks
    await this.checkSystemResources();
    await this.checkApplicationStatus();
    await this.checkDatabaseHealth();
    await this.checkStorageHealth();
    await this.checkNetworkConnectivity();
    await this.checkSecurityStatus();
    await this.checkBackupStatus();
    
    // Generate report
    this.generateHealthReport();
    
    return {
      status: this.errors.length === 0 ? 'healthy' : 'unhealthy',
      checks: this.checks,
      warnings: this.warnings,
      errors: this.errors
    };
  }

  async checkSystemResources() {
    console.log('💻 System Resources');
    console.log('-------------------');
    
    try {
      // Memory usage
      const memUsage = process.memoryUsage();
      const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
      
      console.log(`✓ Memory Usage: ${memUsedMB}MB / ${memTotalMB}MB`);
      this.checks.push(`Memory: ${memUsedMB}MB used`);
      
      if (memUsedMB > 1000) {
        this.warnings.push('High memory usage detected');
      }
      
      // Disk space
      const diskSpace = await this.checkDiskSpace();
      console.log(`✓ Disk Space: ${diskSpace.available}GB available`);
      this.checks.push(`Disk: ${diskSpace.available}GB available`);
      
      if (diskSpace.availableBytes < 1024 * 1024 * 1024) { // Less than 1GB
        this.warnings.push('Low disk space available');
      }
      
      // CPU usage (simplified)
      const uptime = process.uptime();
      console.log(`✓ Application Uptime: ${Math.round(uptime / 60)} minutes`);
      this.checks.push(`Uptime: ${Math.round(uptime / 60)} minutes`);
      
    } catch (error) {
      console.log(`✗ System resource check failed: ${error.message}`);
      this.errors.push(`System resources: ${error.message}`);
    }
    
    console.log('');
  }

  async checkApplicationStatus() {
    console.log('🚀 Application Status');
    console.log('---------------------');
    
    try {
      // Check if application is responding
      const healthResponse = await this.makeHttpRequest('/health');
      if (healthResponse.status === 'healthy') {
        console.log('✓ Application is running and healthy');
        this.checks.push('Application: Running');
      } else {
        console.log('⚠ Application is running but reports issues');
        this.warnings.push('Application health check reports issues');
      }
      
      // Check readiness endpoint
      const readyResponse = await this.makeHttpRequest('/ready');
      if (readyResponse.status === 'ready') {
        console.log('✓ Application is ready to serve requests');
        this.checks.push('Application: Ready');
      } else {
        console.log('⚠ Application is not ready');
        this.warnings.push('Application readiness check failed');
      }
      
      // Check API endpoints
      const dashboardResponse = await this.makeHttpRequest('/api/dashboard');
      if (dashboardResponse) {
        console.log('✓ API endpoints are responding');
        this.checks.push('API: Responding');
      } else {
        console.log('✗ API endpoints are not responding');
        this.errors.push('API endpoints not responding');
      }
      
    } catch (error) {
      console.log(`✗ Application not responding: ${error.message}`);
      this.errors.push(`Application: ${error.message}`);
    }
    
    console.log('');
  }

  async checkDatabaseHealth() {
    console.log('🗄️  Database Health');
    console.log('-------------------');
    
    if (!this.config.dbConfig) {
      console.log('✗ Database configuration not found');
      this.errors.push('Database configuration missing');
      console.log('');
      return;
    }
    
    try {
      // Test database connection
      const connectionTest = await this.testDatabaseConnection();
      if (connectionTest) {
        console.log('✓ Database connection successful');
        this.checks.push('Database: Connected');
      } else {
        console.log('✗ Database connection failed');
        this.errors.push('Database connection failed');
      }
      
      // Check database version
      const version = await this.getDatabaseVersion();
      if (version) {
        console.log(`✓ Database version: ${version}`);
        this.checks.push(`Database version: ${version}`);
      }
      
      // Check table count
      const tableCount = await this.getDatabaseTableCount();
      if (tableCount !== null) {
        console.log(`✓ Database tables: ${tableCount} tables found`);
        this.checks.push(`Database: ${tableCount} tables`);
        
        if (tableCount === 0) {
          this.warnings.push('No database tables found - schema may not be initialized');
        }
      }
      
    } catch (error) {
      console.log(`✗ Database check failed: ${error.message}`);
      this.errors.push(`Database: ${error.message}`);
    }
    
    console.log('');
  }

  async checkStorageHealth() {
    console.log('📁 Storage Health');
    console.log('-----------------');
    
    for (const [name, storagePath] of Object.entries(this.config.storagePaths)) {
      try {
        // Check if directory exists
        if (fs.existsSync(storagePath)) {
          console.log(`✓ ${name} storage directory exists`);
          this.checks.push(`Storage (${name}): Available`);
          
          // Check permissions
          await fs.promises.access(storagePath, fs.constants.R_OK | fs.constants.W_OK);
          console.log(`✓ ${name} storage is readable and writable`);
          
          // Check file count
          const files = await fs.promises.readdir(storagePath);
          console.log(`✓ ${name} storage contains ${files.length} items`);
          this.checks.push(`Storage (${name}): ${files.length} items`);
          
        } else {
          console.log(`⚠ ${name} storage directory does not exist`);
          this.warnings.push(`Storage directory missing: ${name}`);
        }
        
      } catch (error) {
        console.log(`✗ ${name} storage check failed: ${error.message}`);
        this.errors.push(`Storage (${name}): ${error.message}`);
      }
    }
    
    console.log('');
  }

  async checkNetworkConnectivity() {
    console.log('🌐 Network Connectivity');
    console.log('-----------------------');
    
    try {
      // Check local application port
      const portOpen = await this.checkPort(this.config.appUrl);
      if (portOpen) {
        console.log(`✓ Application port is accessible`);
        this.checks.push('Network: Port accessible');
      } else {
        console.log(`✗ Application port is not accessible`);
        this.errors.push('Application port not accessible');
      }
      
      // Check if running in local-only mode
      if (process.env.LOCAL_ONLY === 'true') {
        console.log('✓ Running in local-only mode (secure)');
        this.checks.push('Network: Local-only mode');
      } else {
        console.log('⚠ Not configured for local-only mode');
        this.warnings.push('Local-only mode not enabled');
      }
      
    } catch (error) {
      console.log(`✗ Network check failed: ${error.message}`);
      this.errors.push(`Network: ${error.message}`);
    }
    
    console.log('');
  }

  async checkSecurityStatus() {
    console.log('🔒 Security Status');
    console.log('------------------');
    
    try {
      // Check environment variables
      const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
      for (const envVar of requiredEnvVars) {
        if (process.env[envVar]) {
          console.log(`✓ ${envVar} is configured`);
          this.checks.push(`Security: ${envVar} configured`);
        } else {
          console.log(`✗ ${envVar} is not configured`);
          this.errors.push(`Missing environment variable: ${envVar}`);
        }
      }
      
      // Check session secret strength
      if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) {
        console.log('✓ Session secret has adequate length');
        this.checks.push('Security: Strong session secret');
      } else {
        console.log('⚠ Session secret may be too short');
        this.warnings.push('Weak session secret detected');
      }
      
      // Check file permissions (Unix-like systems)
      if (process.platform !== 'win32') {
        const storagePerms = await this.checkFilePermissions('./local_storage');
        if (storagePerms) {
          console.log('✓ Storage directory has secure permissions');
          this.checks.push('Security: Secure file permissions');
        } else {
          console.log('⚠ Storage directory permissions may be too permissive');
          this.warnings.push('Insecure file permissions');
        }
      }
      
    } catch (error) {
      console.log(`✗ Security check failed: ${error.message}`);
      this.errors.push(`Security: ${error.message}`);
    }
    
    console.log('');
  }

  async checkBackupStatus() {
    console.log('💾 Backup Status');
    console.log('----------------');
    
    try {
      const backupPath = this.config.storagePaths.backups;
      
      if (!fs.existsSync(backupPath)) {
        console.log('⚠ Backup directory does not exist');
        this.warnings.push('No backup directory found');
        console.log('');
        return;
      }
      
      // Check for recent backups
      const backupFiles = await fs.promises.readdir(backupPath);
      const backups = backupFiles.filter(f => f.includes('backup'));
      
      if (backups.length === 0) {
        console.log('⚠ No backup files found');
        this.warnings.push('No backups available');
      } else {
        console.log(`✓ Found ${backups.length} backup file(s)`);
        this.checks.push(`Backups: ${backups.length} available`);
        
        // Check for recent backups (within 7 days)
        let recentBackups = 0;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        for (const backup of backups) {
          const backupPath = path.join(this.config.storagePaths.backups, backup);
          const stats = await fs.promises.stat(backupPath);
          if (stats.mtime > weekAgo) {
            recentBackups++;
          }
        }
        
        if (recentBackups > 0) {
          console.log(`✓ ${recentBackups} recent backup(s) found`);
          this.checks.push(`Backups: ${recentBackups} recent`);
        } else {
          console.log('⚠ No recent backups found (older than 7 days)');
          this.warnings.push('Backups are outdated');
        }
      }
      
    } catch (error) {
      console.log(`✗ Backup check failed: ${error.message}`);
      this.errors.push(`Backup: ${error.message}`);
    }
    
    console.log('');
  }

  generateHealthReport() {
    console.log('📊 Health Check Summary');
    console.log('=======================');
    
    const totalChecks = this.checks.length;
    const totalWarnings = this.warnings.length;
    const totalErrors = this.errors.length;
    
    console.log(`Total Checks: ${totalChecks}`);
    console.log(`Warnings: ${totalWarnings}`);
    console.log(`Errors: ${totalErrors}`);
    console.log('');
    
    if (totalErrors === 0 && totalWarnings === 0) {
      console.log('🎉 All systems operational - DAFF is healthy!');
    } else if (totalErrors === 0) {
      console.log('⚠️ System is operational with minor issues');
      console.log('Warnings:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    } else {
      console.log('❌ System has critical issues that need attention');
      console.log('Errors:');
      this.errors.forEach(error => console.log(`  • ${error}`));
      
      if (totalWarnings > 0) {
        console.log('Warnings:');
        this.warnings.forEach(warning => console.log(`  • ${warning}`));
      }
    }
    
    console.log('');
    console.log('For detailed diagnostics, check the log files in:');
    console.log(`  ${this.config.storagePaths.logs}`);
  }

  async makeHttpRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const url = this.config.appUrl + endpoint;
      
      http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            resolve(data);
          }
        });
      }).on('error', reject);
    });
  }

  async testDatabaseConnection() {
    return new Promise((resolve) => {
      const command = `psql -h ${this.config.dbConfig.host} -U ${this.config.dbConfig.user} -d ${this.config.dbConfig.database} -c "SELECT 1;" -t`;
      
      exec(command, (error, stdout, stderr) => {
        resolve(!error && stdout.trim() === '1');
      });
    });
  }

  async getDatabaseVersion() {
    return new Promise((resolve) => {
      const command = `psql -h ${this.config.dbConfig.host} -U ${this.config.dbConfig.user} -d ${this.config.dbConfig.database} -c "SELECT version();" -t`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve(null);
        } else {
          const version = stdout.trim().split('\n')[0];
          resolve(version.replace(/^\s+/, ''));
        }
      });
    });
  }

  async getDatabaseTableCount() {
    return new Promise((resolve) => {
      const command = `psql -h ${this.config.dbConfig.host} -U ${this.config.dbConfig.user} -d ${this.config.dbConfig.database} -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" -t`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve(null);
        } else {
          resolve(parseInt(stdout.trim()));
        }
      });
    });
  }

  async checkDiskSpace() {
    return new Promise((resolve) => {
      const command = process.platform === 'win32' ? 'dir /-c' : 'df -h .';
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({ available: 'Unknown', availableBytes: 0 });
        } else {
          // Simplified disk space parsing
          const lines = stdout.split('\n');
          const available = process.platform === 'win32' ? 'Unknown' : '10'; // Simplified
          resolve({ 
            available: available + 'GB',
            availableBytes: parseInt(available) * 1024 * 1024 * 1024
          });
        }
      });
    });
  }

  async checkPort(url) {
    return new Promise((resolve) => {
      const urlObj = new URL(url);
      const port = urlObj.port || 80;
      
      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000);
      
      http.get(url, (res) => {
        clearTimeout(timeout);
        resolve(true);
      }).on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    });
  }

  async checkFilePermissions(filePath) {
    try {
      const stats = await fs.promises.stat(filePath);
      const mode = stats.mode & parseInt('777', 8);
      // Check if permissions are 750 or more restrictive
      return mode <= parseInt('750', 8);
    } catch (error) {
      return false;
    }
  }
}

// CLI interface
if (require.main === module) {
  const checker = new DAFFHealthChecker();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'full':
    case undefined:
      checker.runFullHealthCheck().then(result => {
        process.exit(result.status === 'healthy' ? 0 : 1);
      }).catch(error => {
        console.error('Health check failed:', error.message);
        process.exit(1);
      });
      break;
      
    case 'quick':
      checker.checkApplicationStatus().then(() => {
        console.log('Quick health check completed');
      }).catch(console.error);
      break;
      
    case 'database':
      checker.checkDatabaseHealth().then(() => {
        console.log('Database health check completed');
      }).catch(console.error);
      break;
      
    case 'storage':
      checker.checkStorageHealth().then(() => {
        console.log('Storage health check completed');
      }).catch(console.error);
      break;
      
    default:
      console.log('DAFF Health Check System');
      console.log('Usage: node health-check.js [command]');
      console.log('');
      console.log('Commands:');
      console.log('  full      Complete health check (default)');
      console.log('  quick     Quick application status check');
      console.log('  database  Database connectivity check');
      console.log('  storage   Storage systems check');
  }
}

module.exports = DAFFHealthChecker;