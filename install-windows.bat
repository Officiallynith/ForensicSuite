@echo off
REM DAFF Local Installation Script for Windows
REM Run as Administrator

echo ========================================
echo DAFF Local Installation for Windows
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo Checking system requirements...

REM Check Node.js
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please download and install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check PostgreSQL
pg_config --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: PostgreSQL is not installed
    echo Please download and install PostgreSQL from https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo ✓ Node.js found
echo ✓ PostgreSQL found
echo.

REM Create application directory
if not exist "daff-local" (
    mkdir daff-local
)
cd daff-local

REM Download or clone application (placeholder - user would need to add actual source)
echo Downloading DAFF application...
REM git clone [repository-url] .
echo NOTE: Please place DAFF application files in this directory
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorLevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Setup database
echo Setting up database...
echo CREATE DATABASE daff_local; | psql -U postgres
echo CREATE USER daff_user WITH ENCRYPTED PASSWORD 'daff_password_123'; | psql -U postgres
echo GRANT ALL PRIVILEGES ON DATABASE daff_local TO daff_user; | psql -U postgres

REM Create storage directories
mkdir local_storage 2>nul
mkdir local_storage\evidence 2>nul
mkdir local_storage\backups 2>nul
mkdir local_storage\logs 2>nul

REM Create environment file
echo # DAFF Local Environment Configuration > .env.local
echo DATABASE_URL=postgresql://daff_user:daff_password_123@localhost:5432/daff_local >> .env.local
echo NODE_ENV=production >> .env.local
echo PORT=5000 >> .env.local
echo HOST=0.0.0.0 >> .env.local
echo SESSION_SECRET=%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM% >> .env.local
echo EVIDENCE_STORAGE_PATH=./local_storage/evidence >> .env.local
echo BACKUP_STORAGE_PATH=./local_storage/backups >> .env.local
echo LOG_STORAGE_PATH=./local_storage/logs >> .env.local
echo LOCAL_ONLY=true >> .env.local

REM Initialize database
echo Initializing database...
call npm run db:push
if %errorLevel% neq 0 (
    echo ERROR: Failed to initialize database
    pause
    exit /b 1
)

REM Build application
echo Building application...
call npm run build
if %errorLevel% neq 0 (
    echo ERROR: Failed to build application
    pause
    exit /b 1
)

REM Configure Windows Firewall
echo Configuring Windows Firewall...
netsh advfirewall firewall add rule name="DAFF Local" dir=in action=allow protocol=TCP localport=5000

REM Create startup script
echo @echo off > start-daff.bat
echo echo Starting DAFF Local... >> start-daff.bat
echo call npm start >> start-daff.bat
echo pause >> start-daff.bat

REM Create backup script
echo @echo off > backup-daff.bat
echo echo Creating DAFF backup... >> backup-daff.bat
echo node scripts/backup.js create >> backup-daff.bat
echo pause >> backup-daff.bat

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To start DAFF:
echo   1. Double-click start-daff.bat
echo   2. Or run: npm start
echo.
echo Access the application at: http://localhost:5000
echo.
echo To create backups: Double-click backup-daff.bat
echo.
pause