#!/bin/bash

# Andistro Software Center Installation Script

set -e

echo "Installing Andistro Software Center..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "This script must be run as root. Use sudo."
    exit 1
fi

# Update package list
echo "Updating package list..."
apt update

# Install dependencies
echo "Installing dependencies..."
apt install -y python3 python3-pip python3-webview

# Create installation directory
echo "Creating installation directory..."
mkdir -p /opt/andistro-software-center

# Copy files
echo "Copying files..."
cp -r public /opt/andistro-software-center/
cp -r src /opt/andistro-software-center/
cp launcher.py /opt/andistro-software-center/

# Set permissions
echo "Setting permissions..."
chmod +x /opt/andistro-software-center/launcher.py
chown -R root:root /opt/andistro-software-center

# Create desktop entry
echo "Creating desktop entry..."
cat > /usr/share/applications/andistro-software-center.desktop << EOF
[Desktop Entry]
Name=Andistro Software Center
Comment=Andistro Software Center
Exec=python3 /opt/andistro-software-center/launcher.py
Icon=/opt/andistro-software-center/public/assets/ic_store.svg
Terminal=false
Type=Application
Categories=System;
EOF

# Update desktop database
update-desktop-database

echo "Installation completed successfully!"
echo "You can now find Andistro Software Center in your applications menu."
echo "Or run it directly with: python3 /opt/andistro-software-center/launcher.py"