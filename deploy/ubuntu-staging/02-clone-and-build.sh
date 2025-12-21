#!/bin/bash
# ============================================================================
# PCM - Script de Clonación y Build
# Ambiente: CERTIFICACIÓN/STAGING
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  PCM - Clonación y Build para Certificación                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Variables
APP_DIR="/var/www/pcm"
REPO_URL="https://github.com/miguelgargurevich/pcm.git"
BRANCH="main"

# ============================================================================
# 1. Clonar o actualizar repositorio
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Clonando/Actualizando repositorio..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd $APP_DIR

if [ -d "source/.git" ]; then
    print_warning "Repositorio existente, actualizando..."
    cd source
    git fetch origin
    git reset --hard origin/$BRANCH
    git pull origin $BRANCH
else
    print_status "Clonando repositorio..."
    git clone $REPO_URL source
    cd source
fi

COMMIT=$(git rev-parse --short HEAD)
print_status "Repositorio actualizado. Commit: $COMMIT"

# ============================================================================
# 2. Build del Backend (.NET)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Compilando Backend (.NET 9)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd $APP_DIR/source/backend

# Restaurar paquetes
dotnet restore

# Publicar en modo Release
dotnet publish PCM.API/PCM.API.csproj -c Release -o $APP_DIR/backend/publish

print_status "Backend compilado en $APP_DIR/backend/publish"

# ============================================================================
# 3. Build del Frontend (React/Vite)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Compilando Frontend (React/Vite)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd $APP_DIR/source/frontend

# Instalar dependencias
npm ci

# Crear archivo .env para staging
cat > .env.production << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://mtphzudwmpxewmtspird.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cGh6dWR3bXB4ZXdtdHNwaXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1OTA2MTYsImV4cCI6MjA0NzE2NjYxNn0.Ib7JbHYXfvDBzjN5R3OsQlXLfNW2N1BlzrpZhYPLpfA
VITE_ENVIRONMENT=staging
EOF

# Build de producción
npm run build

# Copiar archivos estáticos
rm -rf $APP_DIR/frontend/dist
cp -r dist $APP_DIR/frontend/

print_status "Frontend compilado en $APP_DIR/frontend/dist"

# ============================================================================
# Resumen
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ BUILD COMPLETADO                                           ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Backend:  $APP_DIR/backend/publish                  ║"
echo "║  Frontend: $APP_DIR/frontend/dist                    ║"
echo "║  Commit:   $COMMIT                                             ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Siguiente paso: Ejecutar 03-configure-services.sh             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
