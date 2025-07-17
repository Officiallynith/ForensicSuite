#!/bin/bash

# DAFF Local Installation Script for macOS
# Supports macOS 10.15 Catalina and newer

set -e  # Exit on any error

echo "========================================"
echo "DAFF Local Installation for macOS"
echo "========================================"
echo

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check macOS version
check_macos_version() {
    echo "Checking macOS version..."
    
    MACOS_VERSION=$(sw_vers -productVersion)
    MAJOR_VERSION=$(echo $MACOS_VERSION | cut -d. -f1)
    MINOR_VERSION=$(echo $MACOS_VERSION | cut -d. -f2)
    
    if [[ $MAJOR_VERSION -eq 10 && $MINOR_VERSION -lt 15 ]] || [[ $MAJOR_VERSION -lt 10 ]]; then
        print_error "macOS 10.15 or newer is required. Current version: $MACOS_VERSION"
        exit 1
    fi
    
    print_status "macOS version: $MACOS_VERSION"
}

# Function to install Homebrew
install_homebrew() {
    echo "Checking Homebrew installation..."
    
    if command -v brew &> /dev/null; then
        print_status "Homebrew is already installed"
        return
    fi
    
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for this session
    if [[ -f "/opt/homebrew/bin/brew" ]]; then
        # Apple Silicon Mac
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [[ -f "/usr/local/bin/brew" ]]; then
        # Intel Mac
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    
    print_status "Homebrew installed successfully"
}

# Function to install Node.js
install_nodejs() {
    echo "Installing Node.js..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $NODE_VERSION -ge 18 ]]; then
            print_status "Node.js $(node --version) is already installed"
            return
        fi
    fi
    
    brew install node
    print_status "Node.js installed successfully"
}

# Function to install PostgreSQL
install_postgresql() {
    echo "Installing PostgreSQL..."
    
    if command -v psql &> /dev/null; then
        print_status "PostgreSQL is already installed"
        
        # Check if PostgreSQL service is running
        if brew services list | grep postgresql | grep started &> /dev/null; then
            print_status "PostgreSQL service is running"
        else
            echo "Starting PostgreSQL service..."
            brew services start postgresql@15
        fi
        return
    fi
    
    brew install postgresql@15
    brew services start postgresql@15
    
    print_status "PostgreSQL installed and started"
}

# Function to check system requirements
check_requirements() {
    echo "Checking system requirements..."
    
    # Check available memory
    MEMORY_GB=$(sysctl hw.memsize | awk '{print int($2/1024/1024/1024)}')
    
    if [[ $MEMORY_GB -lt 8 ]]; then
        print_warning "Low system memory detected (${MEMORY_GB}GB). 8GB+ recommended"
    else
        print_status "System memory: ${MEMORY_GB}GB"
    fi
    
    # Check available disk space
    DISK_SPACE=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
    
    if [[ $DISK_SPACE -lt 20 ]]; then
        print_warning "Low disk space detected (${DISK_SPACE}GB). 20GB+ recommended"
    else
        print_status "Available disk space: ${DISK_SPACE}GB"
    fi
    
    # Check Command Line Tools
    if ! xcode-select -p &> /dev/null; then
        print_warning "Xcode Command Line Tools not found"
        echo "Installing Xcode Command Line Tools..."
        xcode-select --install
        echo "Please complete the installation and run this script again"
        exit 1
    fi
    
    print_status "Xcode Command Line Tools available"
}

# Function to setup database
setup_database() {
    echo "Setting up PostgreSQL database..."
    
    # Generate random password
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Create database and user
    psql postgres << EOF
CREATE DATABASE daff_local;
CREATE USER daff_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE daff_local TO daff_user;
ALTER USER daff_user CREATEDB;
\q
EOF

    # Test connection
    export PGPASSWORD=$DB_PASSWORD
    if psql -h localhost -U daff_user -d daff_local -c "SELECT 1;" &> /dev/null; then
        print_status "Database connection test successful"
    else
        print_error "Database connection test failed"
        exit 1
    fi
    
    echo "Database password: $DB_PASSWORD"
    echo "Please save this password securely!"
}

# Function to create application structure
setup_application() {
    echo "Setting up DAFF application..."
    
    # Create application directory
    APP_DIR="$HOME/daff-local"
    if [[ ! -d "$APP_DIR" ]]; then
        mkdir -p "$APP_DIR"
    fi
    
    cd "$APP_DIR"
    
    # Create storage directories
    mkdir -p local_storage/{evidence,backups,logs,temp}
    
    # Set secure permissions
    chmod 750 local_storage
    chmod -R 750 local_storage/*
    
    print_status "Application directory structure created"
    
    # Note: In real implementation, you would clone/copy the actual DAFF code here
    echo "NOTE: Please place DAFF application files in: $APP_DIR"
}

# Function to create environment configuration
create_environment() {
    echo "Creating environment configuration..."
    
    # Generate session secret
    SESSION_SECRET=$(openssl rand -hex 32)
    
    cat > .env.local << EOF
# DAFF Local Environment Configuration
# Generated on $(date)

# Database Configuration
DATABASE_URL="postgresql://daff_user:$DB_PASSWORD@localhost:5432/daff_local"

# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Security Configuration
SESSION_SECRET="$SESSION_SECRET"

# Local Storage Paths
EVIDENCE_STORAGE_PATH="./local_storage/evidence"
BACKUP_STORAGE_PATH="./local_storage/backups"
LOG_STORAGE_PATH="./local_storage/logs"
TEMP_STORAGE_PATH="./local_storage/temp"

# Application Settings
MAX_FILE_SIZE=104857600
MAX_CONCURRENT_UPLOADS=5
SESSION_TIMEOUT=3600000

# Local Operation Mode
LOCAL_ONLY=true
DISABLE_EXTERNAL_APIS=true
EOF

    chmod 600 .env.local  # Secure permissions for environment file
    print_status "Environment configuration created"
}

# Function to create LaunchAgent for auto-start
create_launchagent() {
    echo "Creating LaunchAgent for auto-start..."
    
    LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
    mkdir -p "$LAUNCH_AGENTS_DIR"
    
    cat > "$LAUNCH_AGENTS_DIR/com.daff.local.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.daff.local</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/npm</string>
        <string>start</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$HOME/daff-local</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin</string>
        <key>NODE_ENV</key>
        <string>production</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$HOME/daff-local/local_storage/logs/daff-stdout.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/daff-local/local_storage/logs/daff-stderr.log</string>
</dict>
</plist>
EOF

    print_status "LaunchAgent created"
}

# Function to create helper scripts
create_scripts() {
    echo "Creating helper scripts..."
    
    # Start script
    cat > start-daff.sh << 'EOF'
#!/bin/bash
echo "Starting DAFF Local..."
cd "$HOME/daff-local"
npm start
EOF
    chmod +x start-daff.sh
    
    # Stop script
    cat > stop-daff.sh << 'EOF'
#!/bin/bash
echo "Stopping DAFF Local..."
launchctl unload "$HOME/Library/LaunchAgents/com.daff.local.plist" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
echo "DAFF Local stopped"
EOF
    chmod +x stop-daff.sh
    
    # Status script
    cat > status-daff.sh << 'EOF'
#!/bin/bash
echo "DAFF Local Status:"
if pgrep -f "npm start" > /dev/null; then
    echo "✓ DAFF Local is running"
else
    echo "✗ DAFF Local is not running"
fi
echo
echo "Health Check:"
cd "$HOME/daff-local"
node scripts/health-check.js quick 2>/dev/null || echo "Health check script not available"
EOF
    chmod +x status-daff.sh
    
    # Backup script
    cat > backup-daff.sh << 'EOF'
#!/bin/bash
echo "Creating DAFF backup..."
cd "$HOME/daff-local"
node scripts/backup.js create
EOF
    chmod +x backup-daff.sh
    
    # Install script for auto-start
    cat > install-autostart.sh << 'EOF'
#!/bin/bash
echo "Installing auto-start service..."
launchctl load "$HOME/Library/LaunchAgents/com.daff.local.plist"
echo "DAFF Local will now start automatically on login"
EOF
    chmod +x install-autostart.sh
    
    # Uninstall script for auto-start
    cat > uninstall-autostart.sh << 'EOF'
#!/bin/bash
echo "Uninstalling auto-start service..."
launchctl unload "$HOME/Library/LaunchAgents/com.daff.local.plist" 2>/dev/null || true
echo "Auto-start disabled"
EOF
    chmod +x uninstall-autostart.sh
    
    print_status "Helper scripts created"
}

# Function to install application dependencies
install_dependencies() {
    echo "Installing application dependencies..."
    
    if [[ -f package.json ]]; then
        npm install
        print_status "Dependencies installed"
    else
        print_warning "package.json not found. Dependencies will need to be installed manually"
    fi
}

# Function to build application
build_application() {
    echo "Building application..."
    
    if [[ -f package.json ]]; then
        npm run build
        print_status "Application built successfully"
    else
        print_warning "Cannot build application - package.json not found"
    fi
}

# Function to initialize database schema
init_database() {
    echo "Initializing database schema..."
    
    if [[ -f package.json ]]; then
        npm run db:push
        print_status "Database schema initialized"
    else
        print_warning "Cannot initialize database - package.json not found"
    fi
}

# Function to configure macOS security
configure_security() {
    echo "Configuring macOS security settings..."
    
    # Check if System Integrity Protection allows local server
    print_status "Local server will be accessible on port 5000"
    
    # Note about firewall
    print_warning "If macOS Firewall is enabled, you may need to allow Node.js through the firewall"
    echo "Go to System Preferences > Security & Privacy > Firewall > Firewall Options"
    echo "and allow Node.js to accept incoming connections"
}

# Main installation function
main() {
    echo "Starting DAFF Local installation for macOS..."
    echo
    
    # Check macOS version
    check_macos_version
    
    # Check system requirements
    check_requirements
    
    # Install Homebrew
    install_homebrew
    
    # Install dependencies
    install_nodejs
    install_postgresql
    
    # Setup database
    setup_database
    
    # Setup application
    setup_application
    
    # Create environment
    create_environment
    
    # Install and build (if source is available)
    install_dependencies
    build_application
    init_database
    
    # Create LaunchAgent
    create_launchagent
    
    # Create helper scripts
    create_scripts
    
    # Configure security
    configure_security
    
    echo
    echo "========================================"
    echo "Installation completed successfully!"
    echo "========================================"
    echo
    echo "DAFF Local has been installed to: $HOME/daff-local"
    echo
    echo "To start DAFF:"
    echo "  ./start-daff.sh"
    echo "  or run: npm start"
    echo
    echo "To enable auto-start on login:"
    echo "  ./install-autostart.sh"
    echo
    echo "To check status:"
    echo "  ./status-daff.sh"
    echo
    echo "To create backups:"
    echo "  ./backup-daff.sh"
    echo
    echo "To stop DAFF:"
    echo "  ./stop-daff.sh"
    echo
    echo "Access the application at: http://localhost:5000"
    echo
    echo "Database credentials:"
    echo "  User: daff_user"
    echo "  Password: $DB_PASSWORD"
    echo "  Database: daff_local"
    echo
    echo "IMPORTANT: Save the database password securely!"
    echo
    echo "Note: If macOS Firewall is enabled, allow Node.js through"
    echo "the firewall when prompted or via System Preferences."
    echo
}

# Run main installation
main