#!/bin/bash

# DAFF Local Installation Script for Linux
# Supports Ubuntu, Debian, CentOS, RHEL, and compatible distributions

set -e  # Exit on any error

echo "========================================"
echo "DAFF Local Installation for Linux"
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

# Function to detect Linux distribution
detect_distro() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        DISTRO=$ID
        VERSION=$VERSION_ID
    elif [[ -f /etc/redhat-release ]]; then
        DISTRO="rhel"
    elif [[ -f /etc/debian_version ]]; then
        DISTRO="debian"
    else
        DISTRO="unknown"
    fi
    
    echo "Detected distribution: $DISTRO"
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
    
    case $DISTRO in
        ubuntu|debian)
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        rhel|centos|fedora)
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs npm
            ;;
        *)
            print_error "Unsupported distribution for automatic Node.js installation"
            echo "Please install Node.js 18+ manually from https://nodejs.org"
            exit 1
            ;;
    esac
    
    print_status "Node.js installed successfully"
}

# Function to install PostgreSQL
install_postgresql() {
    echo "Installing PostgreSQL..."
    
    if command -v psql &> /dev/null; then
        print_status "PostgreSQL is already installed"
        return
    fi
    
    case $DISTRO in
        ubuntu|debian)
            sudo apt update
            sudo apt install -y postgresql postgresql-contrib
            ;;
        rhel|centos)
            sudo yum install -y postgresql-server postgresql-contrib
            sudo postgresql-setup initdb
            ;;
        fedora)
            sudo dnf install -y postgresql-server postgresql-contrib
            sudo postgresql-setup --initdb
            ;;
        *)
            print_error "Unsupported distribution for automatic PostgreSQL installation"
            echo "Please install PostgreSQL manually"
            exit 1
            ;;
    esac
    
    # Start and enable PostgreSQL service
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    print_status "PostgreSQL installed and started"
}

# Function to check system requirements
check_requirements() {
    echo "Checking system requirements..."
    
    # Check if running as root (not recommended)
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root is not recommended"
        echo "Consider creating a dedicated user for DAFF"
    fi
    
    # Check available memory
    MEMORY_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    MEMORY_GB=$((MEMORY_KB / 1024 / 1024))
    
    if [[ $MEMORY_GB -lt 4 ]]; then
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
}

# Function to setup database
setup_database() {
    echo "Setting up PostgreSQL database..."
    
    # Generate random password
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Switch to postgres user and create database and user
    sudo -u postgres psql << EOF
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

# Function to create system service
create_service() {
    echo "Creating systemd service..."
    
    sudo tee /etc/systemd/system/daff-local.service > /dev/null << EOF
[Unit]
Description=DAFF Local Forensic Framework
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/daff-local
Environment=NODE_ENV=production
EnvironmentFile=$HOME/daff-local/.env.local
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=$HOME/daff-local

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    print_status "Systemd service created"
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
sudo systemctl stop daff-local
EOF
    chmod +x stop-daff.sh
    
    # Status script
    cat > status-daff.sh << 'EOF'
#!/bin/bash
echo "DAFF Local Status:"
sudo systemctl status daff-local
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
    
    print_status "Helper scripts created"
}

# Function to configure firewall
configure_firewall() {
    echo "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        # Ubuntu/Debian firewall
        sudo ufw allow 5000/tcp comment "DAFF Local"
        print_status "UFW firewall configured"
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS/RHEL firewall
        sudo firewall-cmd --permanent --add-port=5000/tcp
        sudo firewall-cmd --reload
        print_status "Firewalld configured"
    else
        print_warning "No known firewall detected. Port 5000 may need manual configuration"
    fi
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

# Main installation function
main() {
    echo "Starting DAFF Local installation..."
    echo
    
    # Detect distribution
    detect_distro
    
    # Check system requirements
    check_requirements
    
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
    
    # Create system service
    create_service
    
    # Create helper scripts
    create_scripts
    
    # Configure firewall
    configure_firewall
    
    echo
    echo "========================================"
    echo "Installation completed successfully!"
    echo "========================================"
    echo
    echo "DAFF Local has been installed to: $HOME/daff-local"
    echo
    echo "To start DAFF:"
    echo "  sudo systemctl start daff-local"
    echo "  or run: ./start-daff.sh"
    echo
    echo "To enable auto-start on boot:"
    echo "  sudo systemctl enable daff-local"
    echo
    echo "To check status:"
    echo "  ./status-daff.sh"
    echo
    echo "To create backups:"
    echo "  ./backup-daff.sh"
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
}

# Check if script is run with sudo for PostgreSQL setup
if [[ $EUID -ne 0 ]] && ! sudo -n true 2>/dev/null; then
    echo "This script requires sudo access for PostgreSQL installation and service setup."
    echo "Please ensure you can run sudo commands."
    exit 1
fi

# Run main installation
main