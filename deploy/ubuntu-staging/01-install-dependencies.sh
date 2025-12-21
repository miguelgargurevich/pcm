#!/bin/bash
# ============================================================================
# PCM - Script de Instalación de Dependencias para Ubuntu 24.04 (ARM64)
# Ambiente: CERTIFICACIÓN/STAGING
# ============================================================================

set -e  # Salir si hay errores

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  PCM - Instalación de Dependencias para Certificación          ║"
echo "║  Ubuntu 24.04 LTS (ARM64)                                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# ============================================================================
# 1. Actualizar sistema
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Actualizando sistema..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sudo apt update && sudo apt upgrade -y
print_status "Sistema actualizado"

# ============================================================================
# 2. Instalar dependencias básicas
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Instalando dependencias básicas..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    build-essential

print_status "Dependencias básicas instaladas"

# ============================================================================
# 3. Instalar .NET 9 SDK (ARM64)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Instalando .NET 9 SDK para ARM64..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Agregar repositorio de Microsoft
wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Instalar .NET SDK 9
sudo apt update
sudo apt install -y dotnet-sdk-9.0

# Verificar instalación
dotnet --version
print_status ".NET 9 SDK instalado: $(dotnet --version)"

# ============================================================================
# 4. Instalar Node.js 20 LTS
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Instalando Node.js 20 LTS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Instalar NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
print_status "Node.js instalado: $(node --version)"
print_status "NPM instalado: $(npm --version)"

# ============================================================================
# 5. Instalar Nginx
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Instalando Nginx..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

print_status "Nginx instalado y activo"

# ============================================================================
# 6. Crear estructura de directorios
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Creando estructura de directorios..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Crear directorios para la aplicación
sudo mkdir -p /var/www/pcm
sudo mkdir -p /var/www/pcm/frontend
sudo mkdir -p /var/www/pcm/backend
sudo mkdir -p /var/www/pcm/logs

# Dar permisos al usuario actual
sudo chown -R $USER:$USER /var/www/pcm

print_status "Directorios creados en /var/www/pcm"

# ============================================================================
# 7. Configurar firewall
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Configurando firewall..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

print_status "Firewall configurado"

# ============================================================================
# Resumen
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ INSTALACIÓN COMPLETADA                                     ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Componentes instalados:                                       ║"
echo "║  • .NET SDK:    $(dotnet --version)                                          ║"
echo "║  • Node.js:     $(node --version)                                        ║"
echo "║  • NPM:         $(npm --version)                                         ║"
echo "║  • Nginx:       $(nginx -v 2>&1 | cut -d'/' -f2)                                        ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Siguiente paso: Ejecutar 02-clone-and-build.sh                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
