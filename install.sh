#!/bin/bash
# Andistro Software Center Installation Script
# This script installs the Andistro Software Center and its dependencies

echo "Installing Andistro Software Center..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root (sudo ./install.sh)"
    exit 1
fi

# Update package list
echo "Updating package list..."
apt update

# Install required packages if not already installed
# Updated packages for better compatibility with Debian 13+ (Trixie) and Bookworm
echo "Installing required packages..."
REQUIRED_PACKAGES="python3-gi libwebkit2gtk-4.1-0 gir1.2-gtk-3.0"

for package in $REQUIRED_PACKAGES; do
    if ! dpkg -l | grep -q "^ii.*$package"; then
        echo "Installing $package..."
        sudo apt-get install --no-install-recommends -y $package
    else
        echo "$package is already installed"
    fi
done

# Create installation directory
echo "Creating installation directory..."
mkdir -p /opt/andistro-software-center

# Copy files to installation directory
echo "Copying files..."
cp -r public /opt/andistro-software-center/
cp -r src /opt/andistro-software-center/
cp launcher.py /opt/andistro-software-center/
cp reeadme.md /opt/andistro-software-center/

# Set proper permissions
echo "Setting permissions..."
chmod +x /opt/andistro-software-center/launcher.py
chmod -R 755 /opt/andistro-software-center

# Create desktop entry
echo "Creating desktop entry..."
cat > /usr/share/applications/andistro-software-center.desktop << 'EOF'
[Desktop Entry]
Name=Andistro Software Center
Name[pt_BR]=Central de Software Andistro
Comment=Software management application
Comment[pt_BR]=Aplicativo de gerenciamento de software
Exec=python3 /opt/andistro-software-center/launcher.py
Icon=/opt/andistro-software-center/public/assets/ic_store.svg
Terminal=false
Type=Application
Categories=System;PackageManager;
StartupNotify=true
EOF

# Update desktop database
echo "Updating desktop database..."
update-desktop-database /usr/share/applications/

echo "Installation completed successfully!"
echo "You can now find 'Andistro Software Center' in your applications menu."
