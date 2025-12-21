#!/bin/bash
# ============================================================================
# PCM - Script de Deploy Rápido (actualización)
# Ambiente: CERTIFICACIÓN/STAGING
# Uso: ./deploy.sh [--backend-only] [--frontend-only]
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  PCM - Deploy Rápido a Certificación                           ║"
echo "║  $(date '+%Y-%m-%d %H:%M:%S')                                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }

# Variables
APP_DIR="/var/www/pcm"
SOURCE_DIR="$APP_DIR/source"
BRANCH="main"

# Parse argumentos
DEPLOY_BACKEND=true
DEPLOY_FRONTEND=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            DEPLOY_FRONTEND=false
            shift
            ;;
        --frontend-only)
            DEPLOY_BACKEND=false
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# ============================================================================
# 1. Pull últimos cambios
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Actualizando código fuente..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd $SOURCE_DIR

# Guardar commit actual
OLD_COMMIT=$(git rev-parse --short HEAD)

# Pull cambios
git fetch origin
git reset --hard origin/$BRANCH
git pull origin $BRANCH

# Nuevo commit
NEW_COMMIT=$(git rev-parse --short HEAD)

if [ "$OLD_COMMIT" == "$NEW_COMMIT" ]; then
    print_warning "No hay cambios nuevos (commit: $NEW_COMMIT)"
else
    print_status "Actualizado: $OLD_COMMIT → $NEW_COMMIT"
fi

# ============================================================================
# 2. Build Backend (si aplica)
# ============================================================================
if [ "$DEPLOY_BACKEND" = true ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "2. Compilando Backend..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    cd $SOURCE_DIR/backend
    
    # Build
    dotnet restore --verbosity quiet
    dotnet publish PCM.API/PCM.API.csproj -c Release -o $APP_DIR/backend/publish --verbosity quiet
    
    # Reiniciar servicio
    sudo systemctl restart pcm-backend
    
    print_status "Backend desplegado y reiniciado"
fi

# ============================================================================
# 3. Build Frontend (si aplica)
# ============================================================================
if [ "$DEPLOY_FRONTEND" = true ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "3. Compilando Frontend..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    cd $SOURCE_DIR/frontend
    
    # Build
    npm ci --silent
    npm run build
    
    # Copiar archivos
    rm -rf $APP_DIR/frontend/dist
    cp -r dist $APP_DIR/frontend/
    
    print_status "Frontend desplegado"
fi

# ============================================================================
# 4. Verificar servicios
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Verificando servicios..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sleep 3

# Verificar backend
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    print_status "Backend API: OK ✓"
else
    # Intentar con endpoint alternativo
    if curl -s http://localhost:5000/swagger/index.html > /dev/null 2>&1; then
        print_status "Backend API: OK (swagger) ✓"
    else
        print_error "Backend API: No responde"
        echo "Ver logs: sudo journalctl -u pcm-backend -n 50"
    fi
fi

# Verificar frontend
if curl -s http://localhost/ > /dev/null 2>&1; then
    print_status "Frontend: OK ✓"
else
    print_error "Frontend: No responde"
fi

# ============================================================================
# Resumen
# ============================================================================
IP=$(hostname -I | awk '{print $1}')

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ DEPLOY COMPLETADO                                          ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Commit: $NEW_COMMIT                                           ║"
echo "║  Fecha:  $(date '+%Y-%m-%d %H:%M:%S')                                 ║"
echo "║                                                                ║"
echo "║  🌐 Acceso: http://$IP                                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
