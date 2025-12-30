#!/bin/bash

# ============================================
# Script de prueba local - PCM Docker
# ============================================

set -e

echo "🐳 Iniciando prueba local de PCM con Docker..."
echo ""

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "   Por favor, inicia Docker Desktop e intenta nuevamente"
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Verificar puertos disponibles
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Puerto $port ($service) ya está en uso"
        echo "   Detén el servicio que lo está usando o cambia el puerto en docker-compose.local.yml"
        return 1
    fi
    return 0
}

echo "🔍 Verificando puertos disponibles..."
ALL_PORTS_OK=true

if ! check_port 5164 "Backend"; then ALL_PORTS_OK=false; fi
if ! check_port 3000 "Frontend"; then ALL_PORTS_OK=false; fi

if [ "$ALL_PORTS_OK" = false ]; then
    echo ""
    read -p "¿Quieres continuar de todos modos? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Abortado."
        exit 1
    fi
fi

echo "✅ Puertos disponibles"
echo ""

# Limpiar contenedores anteriores
echo "🧹 Limpiando contenedores anteriores..."
docker-compose -f docker-compose.local.yml down -v 2>/dev/null || true
echo ""

# Build y start
echo "🏗️  Construyendo imágenes..."
echo "   (Esto puede tomar varios minutos la primera vez)"
echo ""

docker-compose -f docker-compose.local.yml build

echo ""
echo "🚀 Iniciando servicios..."
echo ""

docker-compose -f docker-compose.local.yml up -d

echo ""
echo "⏳ Esperando que los servicios estén listos..."
sleep 5

# Verificar health
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:5164/health > /dev/null 2>&1; then
        echo "✅ Backend está listo!"
        break
    fi
    ATTEMPT=$((ATTEMPT+1))
    echo "   Intento $ATTEMPT/$MAX_ATTEMPTS..."
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "❌ Error: El backend no respondió después de $MAX_ATTEMPTS intentos"
    echo ""
    echo "Ver logs con:"
    echo "docker-compose -f docker-compose.local.yml logs -f backend"
    exit 1
fi

echo ""
echo "================================================"
echo "✅ ¡PCM está corriendo localmente!"
echo "================================================"
echo ""
echo "📡 Endpoints disponibles:"
echo "   • Frontend:       http://localhost:3000"
echo "   • Backend API:    http://localhost:5164"
echo "   • Swagger UI:     http://localhost:5164"
echo "   • Health Check:   http://localhost:5164/health"
echo ""
echo "🗄️  Base de Datos (Externa):"
echo "   • Tu PostgreSQL local en localhost:5433"
echo "   • O producción: 101.44.10.71:5432"
echo ""
echo "📧 Email:"
echo "   • Configurar credenciales SMTP en appsettings.Docker.json"
echo ""
echo "📁 Storage de Archivos:"
echo "   • Los archivos se guardan en volumen Docker: storage_data"
echo "   • Acceso via: GET http://localhost:5164/api/files/{path}"
echo ""
echo "================================================"
echo ""
echo "📊 Ver logs en tiempo real:"
echo "   docker-compose -f docker-compose.local.yml logs -f"
echo ""
echo "🛑 Detener servicios:"
echo "   docker-compose -f docker-compose.local.yml down"
echo ""
echo "🗑️  Limpiar todo (incluyendo datos):"
echo "   docker-compose -f docker-compose.local.yml down -v"
echo ""
echo "📖 Documentación completa:"
echo "   Ver DOCKER_LOCAL_README.md"
echo ""
echo "================================================"
echo ""

# Abrir browser automáticamente (opcional)
if command -v open > /dev/null 2>&1; then
    # macOS
    open http://localhost:3000
    open http://localhost:5164
    open http://localhost:8025
elif command -v xdg-open > /dev/null 2>&1; then
    # Linux
    xdg-open http://localhost:3000
    xdg-open http://localhost:5164
elif command -v xdg-open > /dev/null 2>&1; then
    # Linux
    xdg-open http://localhost:3000
    xdg-open http://localhost:5164
elif command -v start > /dev/null 2>&1; then
    # Windows
    start http://localhost:3000
    start http://localhost:5164
docker-compose -f docker-compose.local.yml logs -f
