#!/usr/bin/env node

/**
 * DAFF Local Backup Manager
 * Automated backup and recovery system for local installations
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

// Security utility for path validation
function validateAndSanitizePath(inputPath) {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Invalid path: path must be a non-empty string');
  }
  
  // Resolve to absolute path and normalize
  const resolvedPath = path.resolve(inputPath);
  
  // Check for directory traversal attempts
  if (resolvedPath.includes('..') || resolvedPath !== path.normalize(resolvedPath)) {
    throw new Error('Invalid path: directory traversal detected');
  }
  
  // Ensure path doesn't contain dangerous characters for shell commands
  if (/[;&|`$(){}[\]<>*?~]/.test(resolvedPath)) {
    throw new Error('Invalid path: contains potentially dangerous characters');
  }
  
  return resolvedPath;
}

// Security utility for sanitizing filenames and timestamps used in shell commands
function sanitizeForShell(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: must be a non-empty string');
  }
  
  // Remove or replace dangerous characters for shell commands
  // Allow only alphanumeric, hyphens, underscores, and dots
  return input.replace(/[^a-zA-Z0-9\-_.]/g, '-');
}

class LocalBackupManager {
  constructor() {
    this.backupPath = process.env.BACKUP_STORAGE_PATH || './local_storage/backups';
    this.evidencePath = process.env.EVIDENCE_STORAGE_PATH || './local_storage/evidence';
    this.logPath = process.env.LOG_STORAGE_PATH || './local_storage/logs';
    
    this.dbConfig = {
      host: 'localhost',
      user: process.env.DATABASE_URL?.match(/postgresql:\/\/([^:]+):/)?.[1] || 'daff_user',
      database: process.env.DATABASE_URL?.match(/\/([^?]+)(?:\?|$)/)?.[1] || 'daff_local'
    };
    
    this.retentionDays = 30;
    this.compressionEnabled = true;
  }

  async createFullBackup() {
    console.log('🔄 Starting full backup...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.backupPath, `full-backup-${timestamp}`);
    
    try {
      // Create backup directory
      await fs.promises.mkdir(backupDir, { recursive: true });
      
      // Backup database
      await this.backupDatabase(backupDir, timestamp);
      
      // Backup evidence files
      await this.backupEvidence(backupDir, timestamp);
      
      // Backup logs
      await this.backupLogs(backupDir, timestamp);
      
      // Create backup manifest
      await this.createBackupManifest(backupDir, timestamp);
      
      // Compress if enabled
      if (this.compressionEnabled) {
        await this.compressBackup(backupDir);
      }
      
      console.log('✅ Full backup completed successfully');
      return backupDir;
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      throw error;
    }
  }

  async backupDatabase(backupDir, timestamp) {
    console.log('📊 Backing up database...');
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const sanitizedTimestamp = sanitizeForShell(timestamp);
    const dbBackupFile = path.join(sanitizedBackupDir, `database-${sanitizedTimestamp}.sql`);
    const command = `pg_dump -h ${this.dbConfig.host} -U ${this.dbConfig.user} -d ${this.dbConfig.database} -f "${dbBackupFile}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Database backup failed: ${error.message}`));
        } else {
          console.log('✓ Database backup created');
          resolve(dbBackupFile);
        }
      });
    });
  }

  async backupEvidence(backupDir, timestamp) {
    console.log('📁 Backing up evidence files...');
    
    if (!fs.existsSync(this.evidencePath)) {
      console.log('ℹ️ No evidence files to backup');
      return;
    }
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const sanitizedTimestamp = sanitizeForShell(timestamp);
    const evidenceBackupFile = path.join(sanitizedBackupDir, `evidence-${sanitizedTimestamp}.tar`);
    const command = `tar -cf "${evidenceBackupFile}" -C "${path.dirname(this.evidencePath)}" "${path.basename(this.evidencePath)}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Evidence backup failed: ${error.message}`));
        } else {
          console.log('✓ Evidence files backup created');
          resolve(evidenceBackupFile);
        }
      });
    });
  }

  async backupLogs(backupDir, timestamp) {
    console.log('📋 Backing up log files...');
    
    if (!fs.existsSync(this.logPath)) {
      console.log('ℹ️ No log files to backup');
      return;
    }
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const sanitizedTimestamp = sanitizeForShell(timestamp);
    const logBackupFile = path.join(sanitizedBackupDir, `logs-${sanitizedTimestamp}.tar`);
    const command = `tar -cf "${logBackupFile}" -C "${path.dirname(this.logPath)}" "${path.basename(this.logPath)}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Log backup failed: ${error.message}`));
        } else {
          console.log('✓ Log files backup created');
          resolve(logBackupFile);
        }
      });
    });
  }

  async createBackupManifest(backupDir, timestamp) {
    console.log('📝 Creating backup manifest...');
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const manifest = {
      timestamp,
      version: '1.0.0',
      type: 'full_backup',
      created: new Date().toISOString(),
      files: {},
      checksums: {}
    };
    
    // Get file list and checksums
    const files = await fs.promises.readdir(sanitizedBackupDir);
    for (const file of files) {
      const filePath = path.join(sanitizedBackupDir, file);
      const stats = await fs.promises.stat(filePath);
      
      if (stats.isFile()) {
        manifest.files[file] = {
          size: stats.size,
          modified: stats.mtime.toISOString()
        };
        
        // Calculate checksum
        const fileBuffer = await fs.promises.readFile(filePath);
        manifest.checksums[file] = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      }
    }
    
    const manifestPath = path.join(sanitizedBackupDir, 'manifest.json');
    await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log('✓ Backup manifest created');
  }

  async compressBackup(backupDir) {
    console.log('🗜️ Compressing backup...');
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const compressedFile = `${sanitizedBackupDir}.tar.gz`;
    const command = `tar -czf "${compressedFile}" -C "${path.dirname(sanitizedBackupDir)}" "${path.basename(sanitizedBackupDir)}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Compression failed: ${error.message}`));
        } else {
          // Remove uncompressed directory
          this.removeDirectory(sanitizedBackupDir);
          console.log('✓ Backup compressed');
          resolve(compressedFile);
        }
      });
    });
  }

  async restoreBackup(backupPath) {
    console.log('🔄 Starting backup restoration...');
    
    try {
      let workingDir = backupPath;
      
      // If compressed, extract first
      if (backupPath.endsWith('.tar.gz')) {
        console.log('📦 Extracting compressed backup...');
        workingDir = await this.extractBackup(backupPath);
      }
      
      // Verify backup integrity
      await this.verifyBackupIntegrity(workingDir);
      
      // Restore database
      await this.restoreDatabase(workingDir);
      
      // Restore evidence files
      await this.restoreEvidence(workingDir);
      
      // Restore logs
      await this.restoreLogs(workingDir);
      
      console.log('✅ Backup restoration completed successfully');
      
    } catch (error) {
      console.error('❌ Restoration failed:', error.message);
      throw error;
    }
  }

  async extractBackup(compressedPath) {
    const sanitizedPath = validateAndSanitizePath(compressedPath);
    const extractDir = sanitizedPath.replace('.tar.gz', '');
    const command = `tar -xzf "${sanitizedPath}" -C "${path.dirname(sanitizedPath)}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Extraction failed: ${error.message}`));
        } else {
          console.log('✓ Backup extracted');
          resolve(extractDir);
        }
      });
    });
  }

  async verifyBackupIntegrity(backupDir) {
    console.log('🔍 Verifying backup integrity...');
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const manifestPath = path.join(sanitizedBackupDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Backup manifest not found');
    }
    
    const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));
    
    // Verify file checksums
    for (const [filename, expectedChecksum] of Object.entries(manifest.checksums)) {
      if (filename === 'manifest.json') continue;
      
      const filePath = path.join(sanitizedBackupDir, filename);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing backup file: ${filename}`);
      }
      
      const fileBuffer = await fs.promises.readFile(filePath);
      const actualChecksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      if (actualChecksum !== expectedChecksum) {
        throw new Error(`Checksum mismatch for file: ${filename}`);
      }
    }
    
    console.log('✓ Backup integrity verified');
  }

  async restoreDatabase(backupDir) {
    console.log('📊 Restoring database...');
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const dbFiles = (await fs.promises.readdir(sanitizedBackupDir)).filter(f => f.startsWith('database-') && f.endsWith('.sql'));
    
    if (dbFiles.length === 0) {
      throw new Error('No database backup file found');
    }
    
    const dbBackupFile = path.join(sanitizedBackupDir, dbFiles[0]);
    const command = `psql -h ${this.dbConfig.host} -U ${this.dbConfig.user} -d ${this.dbConfig.database} -f "${dbBackupFile}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Database restoration failed: ${error.message}`));
        } else {
          console.log('✓ Database restored');
          resolve();
        }
      });
    });
  }

  async restoreEvidence(backupDir) {
    console.log('📁 Restoring evidence files...');
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const evidenceFiles = (await fs.promises.readdir(sanitizedBackupDir)).filter(f => f.startsWith('evidence-') && f.endsWith('.tar'));
    
    if (evidenceFiles.length === 0) {
      console.log('ℹ️ No evidence backup to restore');
      return;
    }
    
    const evidenceBackupFile = path.join(sanitizedBackupDir, evidenceFiles[0]);
    const command = `tar -xf "${evidenceBackupFile}" -C "${path.dirname(this.evidencePath)}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Evidence restoration failed: ${error.message}`));
        } else {
          console.log('✓ Evidence files restored');
          resolve();
        }
      });
    });
  }

  async restoreLogs(backupDir) {
    console.log('📋 Restoring log files...');
    
    const sanitizedBackupDir = validateAndSanitizePath(backupDir);
    const logFiles = (await fs.promises.readdir(sanitizedBackupDir)).filter(f => f.startsWith('logs-') && f.endsWith('.tar'));
    
    if (logFiles.length === 0) {
      console.log('ℹ️ No log backup to restore');
      return;
    }
    
    const logBackupFile = path.join(sanitizedBackupDir, logFiles[0]);
    const command = `tar -xf "${logBackupFile}" -C "${path.dirname(this.logPath)}"`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Log restoration failed: ${error.message}`));
        } else {
          console.log('✓ Log files restored');
          resolve();
        }
      });
    });
  }

  async cleanupOldBackups() {
    console.log('🧹 Cleaning up old backups...');
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
    
    const files = await fs.promises.readdir(this.backupPath);
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(this.backupPath, file);
      const stats = await fs.promises.stat(filePath);
      
      if (stats.mtime < cutoffDate) {
        if (stats.isDirectory()) {
          await this.removeDirectory(filePath);
        } else {
          await fs.promises.unlink(filePath);
        }
        deletedCount++;
      }
    }
    
    console.log(`✓ Cleaned up ${deletedCount} old backup(s)`);
  }

  async removeDirectory(dirPath) {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
  }

  async listBackups() {
    const files = await fs.promises.readdir(this.backupPath);
    const backups = [];
    
    for (const file of files) {
      const filePath = path.join(this.backupPath, file);
      const stats = await fs.promises.stat(filePath);
      
      if (file.includes('backup') || file.includes('full-backup')) {
        backups.push({
          name: file,
          size: this.formatBytes(stats.size),
          created: stats.birthtime.toISOString(),
          type: stats.isDirectory() ? 'directory' : 'compressed'
        });
      }
    }
    
    return backups.sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  scheduleAutomaticBackups(intervalHours = 24) {
    console.log(`⏰ Scheduling automatic backups every ${intervalHours} hours`);
    
    setInterval(async () => {
      try {
        console.log('🔄 Starting scheduled backup...');
        await this.createFullBackup();
        await this.cleanupOldBackups();
        console.log('✅ Scheduled backup completed');
      } catch (error) {
        console.error('❌ Scheduled backup failed:', error.message);
      }
    }, intervalHours * 60 * 60 * 1000);
  }
}

// CLI interface
if (require.main === module) {
  const backup = new LocalBackupManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      backup.createFullBackup().catch(console.error);
      break;
      
    case 'restore':
      const backupPath = process.argv[3];
      if (!backupPath) {
        console.error('Usage: node backup.js restore <backup-path>');
        process.exit(1);
      }
      
      try {
        const sanitizedPath = validateAndSanitizePath(backupPath);
        backup.restoreBackup(sanitizedPath).catch(console.error);
      } catch (error) {
        console.error('Error: Invalid backup path -', error.message);
        process.exit(1);
      }
      break;
      
    case 'list':
      backup.listBackups().then(backups => {
        console.log('Available backups:');
        backups.forEach(b => {
          console.log(`  ${b.name} (${b.size}) - ${b.created}`);
        });
      }).catch(console.error);
      break;
      
    case 'cleanup':
      backup.cleanupOldBackups().catch(console.error);
      break;
      
    case 'schedule':
      const hours = parseInt(process.argv[3]) || 24;
      backup.scheduleAutomaticBackups(hours);
      break;
      
    default:
      console.log('DAFF Backup Manager');
      console.log('Usage: node backup.js <command> [options]');
      console.log('');
      console.log('Commands:');
      console.log('  create          Create a full backup');
      console.log('  restore <path>  Restore from backup');
      console.log('  list            List available backups');
      console.log('  cleanup         Remove old backups');
      console.log('  schedule [hrs]  Schedule automatic backups');
  }
}

module.exports = LocalBackupManager;