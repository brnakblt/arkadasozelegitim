#!/bin/bash
set -e

echo "Starting installation for Arch Linux..."

# Update system
echo "Updating system..."
pacman -Syu --noconfirm

# Install packages
echo "Installing Docker, Docker Compose, and MariaDB..."
pacman -S --needed --noconfirm docker docker-compose mariadb

# Docker setup
echo "Configuring Docker..."
systemctl start docker
systemctl enable docker
usermod -aG docker $SUDO_USER || usermod -aG docker $(whoami)
echo "User added to docker group."

# MariaDB setup
echo "Configuring MariaDB..."
mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
systemctl start mariadb
systemctl enable mariadb

echo "Installation complete!"
echo "Please log out and log back in (or run 'newgrp docker') to use Docker without sudo."
echo "You may also want to run 'mysql_secure_installation' to secure your MariaDB installation."
