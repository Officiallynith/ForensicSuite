#!/usr/bin/env node

/**
 * DAFF Local Installation Script
 * Automated setup for local DAFF installation
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const crypto = require('crypto');
const readline = require('readline');

class DAFFLocalInstaller {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.config = {
      dbName: 'daff_local',
      dbUser: 'daff_user',
      dbPassword: '',
      sessionSecret: '',
      port: 5000,
      storagePath: './local_storage'
    };
  }

  async run() {
    console.log('🔧 DAFF Local Installation Wizard');
    console.log('==================================');
    console.log('');

    try {
      await this.checkSystemRequirements();
      await this.gatherConfiguration();
      await this.setupDirectories();
      await this.setupDatabase();
      await this.createEnvironmentFile();
      await this.installDependencies();
      await this.buildApplication();
      await this.runInitialSetup();
      
      console.log('');
      console.log('✅ Installation completed successfully!');
      console.log('');
      console.log('To start DAFF:');
      console.log('  npm start');
      console.log('');
      console.log('Access the application at: http://localhost:' + this.config.port);
      
    } catch (error) {
      console.error('❌ Installation failed:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async checkSystemRequirements() {
    console.log('🔍 Checking system requirements...');
    
    // Check Node.js
    try {
      const nodeVersion = await this.execCommand('node', ['--version']);
      const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
      if (majorVersion < 18) {
        throw new Error('Node.js 18 or newer is required');
      }
      console.log('✓ Node.js:', nodeVersion.trim());
    } catch (error) {
      throw new Error('Node.js is not installed or not in PATH');
    }

    // Check PostgreSQL
    try {
      const pgVersion = await this.execCommand('pg_config', ['--version']);
      console.log('✓ PostgreSQL:', pgVersion.trim());
    } catch (error) {
      throw new Error('PostgreSQL is not installed or not in PATH');
    }

    // Check npm
    try {
      const npmVersion = await this.execCommand('npm', ['--version']);
      console.log('✓ npm:', npmVersion.trim());
    } catch (error) {
      throw new Error('npm is not available');
    }

    console.log('');
  }

  async gatherConfiguration() {
    console.log('⚙️  Configuration Setup');
    console.log('');

    // Database password
    this.config.dbPassword = await this.askQuestion(
      'Enter password for database user (min 8 characters): ',
      (input) => input.length >= 8,
      'Password must be at least 8 characters long'
    );

    // Port configuration
    const portInput = await this.askQuestion(
      `Enter port number for the application (default: ${this.config.port}): `,
      (input) => !input || (!isNaN(input) && parseInt(input) > 1024 && parseInt(input) < 65536),
      'Port must be a number between 1024 and 65535'
    );
    
    if (portInput) {
      this.config.port = parseInt(portInput);
    }

    // Generate session secret
    this.config.sessionSecret = crypto.randomBytes(32).toString('hex');

    console.log('');
  }

  async setupDirectories() {
    console.log('📁 Creating storage directories...');
    
    const directories = [
      this.config.storagePath,
      path.join(this.config.storagePath, 'evidence'),
      path.join(this.config.storagePath, 'backups'),
      path.join(this.config.storagePath, 'logs'),
      path.join(this.config.storagePath, 'temp')
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('✓ Created:', dir);
      } else {
        console.log('✓ Exists:', dir);
      }
    }

    // Set permissions on Unix-like systems
    if (process.platform !== 'win32') {
      try {
        await this.execCommand('chmod', ['750', this.config.storagePath]);
        await this.execCommand('chmod', ['-R', '750', this.config.storagePath + '/*']);
        console.log('✓ Set secure permissions');
      } catch (error) {
        console.log('⚠ Warning: Could not set permissions');
      }
    }

    console.log('');
  }

  async setupDatabase() {
    console.log('🗄️  Setting up local database...');
    
    const dbCommands = [
      `CREATE DATABASE ${this.config.dbName};`,
      `CREATE USER ${this.config.dbUser} WITH ENCRYPTED PASSWORD '${this.config.dbPassword}';`,
      `GRANT ALL PRIVILEGES ON DATABASE ${this.config.dbName} TO ${this.config.dbUser};`,
      `ALTER USER ${this.config.dbUser} CREATEDB;`
    ];

    for (const command of dbCommands) {
      try {
        await this.execCommand('psql', ['-U', 'postgres', '-c', command]);
        console.log('✓ Executed:', command.split(' ').slice(0, 3).join(' '));
      } catch (error) {
        // Some commands might fail if already exists, that's okay
        console.log('⚠ Note:', command.split(' ').slice(0, 3).join(' '), '(may already exist)');
      }
    }

    // Test connection
    try {
      process.env.PGPASSWORD = this.config.dbPassword;
      await this.execCommand('psql', ['-h', 'localhost', '-U', this.config.dbUser, '-d', this.config.dbName, '-c', 'SELECT 1;']);
      console.log('✓ Database connection verified');
    } catch (error) {
      throw new Error('Database connection failed. Please check credentials and try again.');
    }

    console.log('');
  }

  async createEnvironmentFile() {
    console.log('🔧 Creating environment configuration...');
    
    const envContent = `# DAFF Local Environment Configuration
# Generated by installation script on ${new Date().toISOString()}

# Database Configuration
DATABASE_URL="postgresql://${this.config.dbUser}:${this.config.dbPassword}@localhost:5432/${this.config.dbName}"

# Server Configuration
NODE_ENV=production
PORT=${this.config.port}
HOST=0.0.0.0

# Security Configuration
SESSION_SECRET="${this.config.sessionSecret}"

# Local Storage Paths
EVIDENCE_STORAGE_PATH="${this.config.storagePath}/evidence"
BACKUP_STORAGE_PATH="${this.config.storagePath}/backups"
LOG_STORAGE_PATH="${this.config.storagePath}/logs"
TEMP_STORAGE_PATH="${this.config.storagePath}/temp"

# Application Settings
MAX_FILE_SIZE=104857600
MAX_CONCURRENT_UPLOADS=5
SESSION_TIMEOUT=3600000

# Optional: AI Features (uncomment and add your OpenAI API key)
# OPENAI_API_KEY="your-openai-api-key-here"

# Local Operation Mode
LOCAL_ONLY=true
DISABLE_EXTERNAL_APIS=true
`;

    fs.writeFileSync('.env.local', envContent);
    console.log('✓ Environment file created: .env.local');
    console.log('');
  }

  async installDependencies() {
    console.log('📦 Installing application dependencies...');
    console.log('This may take a few minutes...');
    
    try {
      await this.execCommand('npm', ['install'], { showOutput: true });
      console.log('✓ Dependencies installed successfully');
    } catch (error) {
      throw new Error('Failed to install dependencies: ' + error.message);
    }
    
    console.log('');
  }

  async buildApplication() {
    console.log('🏗️  Building application...');
    
    try {
      await this.execCommand('npm', ['run', 'build'], { showOutput: true });
      console.log('✓ Application built successfully');
    } catch (error) {
      throw new Error('Failed to build application: ' + error.message);
    }
    
    console.log('');
  }

  async runInitialSetup() {
    console.log('🚀 Running initial database setup...');
    
    try {
      // Load environment variables
      require('dotenv').config({ path: '.env.local' });
      
      // Run database migrations
      await this.execCommand('npm', ['run', 'db:push']);
      console.log('✓ Database schema initialized');
      
      // Create initial admin user (optional)
      console.log('');
      const createAdmin = await this.askQuestion(
        'Create initial admin user? (y/N): ',
        (input) => ['y', 'n', ''].includes(input.toLowerCase()),
        'Please enter y or n'
      );
      
      if (createAdmin.toLowerCase() === 'y') {
        await this.createAdminUser();
      }
      
    } catch (error) {
      throw new Error('Failed to initialize database: ' + error.message);
    }
    
    console.log('');
  }

  async createAdminUser() {
    const username = await this.askQuestion('Admin username: ');
    const password = await this.askQuestion(
      'Admin password (min 8 characters): ',
      (input) => input.length >= 8,
      'Password must be at least 8 characters long'
    );
    
    // Note: In a real implementation, you'd hash the password and insert into database
    console.log('ℹ️  Admin user creation will be completed on first application start');
    
    // Store admin credentials for first-run setup
    const adminConfig = {
      username,
      password: crypto.createHash('sha256').update(password).digest('hex'),
      created: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(this.config.storagePath, 'admin-setup.json'),
      JSON.stringify(adminConfig, null, 2)
    );
  }

  async askQuestion(question, validator = null, errorMessage = null) {
    return new Promise((resolve) => {
      const ask = () => {
        this.rl.question(question, (answer) => {
          if (validator && !validator(answer)) {
            if (errorMessage) {
              console.log('❌ ' + errorMessage);
            }
            ask();
          } else {
            resolve(answer);
          }
        });
      };
      ask();
    });
  }

  async execCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      // Use spawn instead of exec for better security with argument separation
      const child = spawn(command, args, { shell: false });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data;
        if (options.showOutput) {
          process.stdout.write(data);
        }
      });
      
      child.stderr.on('data', (data) => {
        stderr += data;
        if (options.showOutput) {
          process.stderr.write(data);
        }
      });
      
      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        } else {
          resolve(stdout);
        }
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// Run installer if called directly
if (require.main === module) {
  const installer = new DAFFLocalInstaller();
  installer.run().catch(console.error);
}

module.exports = DAFFLocalInstaller;