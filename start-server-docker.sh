#!/bin/bash

# ================================================
# Script de Inicio para Servidor Linux del Cliente
# Arquitectura: x86_64/amd64
# ================================================

set -e  # Salir si hay error

echo "================================================"
echo "🚀 Iniciando PCM en Servidor Linux"
echo "================================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ================================================
# 1. Verificar Docker
# ================================================
echo "📋 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo "Instalar con: sudo apt-get install -y docker.io docker-compose"
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker no está corriendo${NC}"
    echo "Iniciar con: sudo systemctl start docker"
    exit 1
fi

echo -e "${GREEN}✅ Docker está corriendo${NC}"
echo ""

# ================================================
# 2. Verificar docker-compose
# ================================================
echo "📋 Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  docker-compose no encontrado, intentando con 'docker compose'${NC}"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi
echo -e "${GREEN}✅ Docker Compose disponible${NC}"
echo ""

# ================================================
# 3. Verificar arquitectura del sistema
# ================================================
echo "📋 Verificando arquitectura..."
ARCH=$(uname -m)
echo "Arquitectura detectada: $ARCH"

if [[ "$ARCH" == "x86_64" ]] || [[ "$ARCH" == "amd64" ]]; then
    echo -e "${GREEN}✅ Arquitectura compatible (x86_64/amd64)${NC}"
elif [[ "$ARCH" == "aarch64" ]] || [[ "$ARCH" == "arm64" ]]; then
    echo -e "${YELLOW}⚠️  Sistema ARM detectado - usando emulación para amd64${NC}"
else
    echo -e "${RED}⚠️  Arquitectura desconocida: $ARCH${NC}"
fi
echo ""

# ================================================
# 4. Verificar archivos necesarios
# ================================================
echo "📋 Verificando archivos..."
if [ ! -f "docker-compose.server.yml" ]; then
    echo -e "${RED}❌ Archivo docker-compose.server.yml no encontrado${NC}"
    exit 1
fi

if [ ! -f "Dockerfile.local" ]; then
    echo -e "${RED}❌ Archivo Dockerfile.local no encontrado${NC}"
    exit 1
fi

if [ ! -f "backend/PCM.API/appsettings.Docker.json" ]; then
    echo -e "${RED}❌ Archivo appsettings.Docker.json no encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Todos los archivos necesarios están presentes${NC}"
echo ""

# ================================================
# 5. Verificar conectividad a la base de datos
# ================================================
echo "📋 Verificando conectividad a PostgreSQL..."
DB_HOST="101.44.10.71"
DB_PORT="5432"

if command -v nc &> /dev/null; then
    if nc -zv $DB_HOST $DB_PORT 2>&1 | grep -q "succeeded\|open"; then
        echo -e "${GREEN}✅ Conexión a PostgreSQL disponible ($DB_HOST:$DB_PORT)${NC}"
    else
        echo -e "${YELLOW}⚠️  No se puede conectar a PostgreSQL ($DB_HOST:$DB_PORT)${NC}"
        echo "Verificar firewall y configuración de red"
    fi
elif command -v telnet &> /dev/null; then
    timeout 3 telnet $DB_HOST $DB_PORT 2>&1 | grep -q "Connected" && \
        echo -e "${GREEN}✅ Conexión a PostgreSQL disponible${NC}" || \
        echo -e "${YELLOW}⚠️  No se puede conectar a PostgreSQL${NC}"
else
    echo -e "${YELLOW}⚠️  nc o telnet no disponibles, saltando verificación de PostgreSQL${NC}"
fi
echo ""

# ================================================
# 6. Limpiar contenedores anteriores (opcional)
# ================================================
echo "🧹 Limpiando contenedores anteriores..."
$DOCKER_COMPOSE -f docker-compose.server.yml down 2>/dev/null || true
echo -e "${GREEN}✅ Limpieza completada${NC}"
echo ""

# ================================================
# 7. Construir y levantar contenedores
# ================================================
echo "🏗️  Construyendo imágenes Docker para arquitectura amd64..."
echo "Esto puede tomar varios minutos..."
echo ""

# Habilitar buildkit para mejor rendimiento
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Construir y levantar
$DOCKER_COMPOSE -f docker-compose.server.yml up -d --build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir o iniciar contenedores${NC}"
    echo "Ver logs con: docker-compose -f docker-compose.server.yml logs"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Contenedores iniciados correctamente${NC}"
echo ""

# ================================================
# 8. Esperar que los servicios estén listos
# ================================================
echo "⏳ Esperando que los servicios estén listos..."
sleep 5

# Verificar backend
echo "🔍 Verificando Backend..."
for i in {1..30}; do
    if curl -s http://localhost:5164/health > /dev/null 2>&1; then
        HEALTH=$(curl -s http://localhost:5164/health)
        echo -e "${GREEN}✅ Backend está respondiendo${NC}"
        echo "   Health check: $HEALTH"
        break
    fi
    echo "   Intento $i/30 - esperando..."
    sleep 2
done

# Verificar frontend
echo "🔍 Verificando Frontend..."
for i in {1..15}; do
    if curl -s -I http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend está respondiendo${NC}"
        break
    fi
    echo "   Intento $i/15 - esperando..."
    sleep 2
done

echo ""

# ================================================
# 9. Mostrar estado de contenedores
# ================================================
echo "================================================"
echo "📊 Estado de los Contenedores"
echo "================================================"
docker ps --filter "name=pcm-"
echo ""

# ================================================
# 10. Mostrar información de acceso
# ================================================
echo "================================================"
echo "✅ Despliegue Completado"
echo "================================================"
echo ""
echo "🌐 URLs de Acceso:"
echo "   - Frontend:     http://localhost:3000"
echo "   - Backend API:  http://localhost:5164"
echo "   - Health Check: http://localhost:5164/health"
echo "   - Swagger:      http://localhost:5164/swagger"
echo ""

# Obtener IP del servidor
SERVER_IP=$(hostname -I | awk '{print $1}')
if [ ! -z "$SERVER_IP" ]; then
    echo "🌐 Acceso desde otros equipos:"
    echo "   - Frontend:     http://$SERVER_IP:3000"
    echo "   - Backend API:  http://$SERVER_IP:5164"
    echo "   - Health Check: http://$SERVER_IP:5164/health"
    echo ""
fi

echo "👤 Credenciales de Prueba:"
echo "   - Usuario: admin@pcm.gob.pe"
echo "   - Password: Admin2024!"
echo ""
echo "📝 Comandos Útiles:"
echo "   - Ver logs:              docker-compose -f docker-compose.server.yml logs -f"
echo "   - Ver logs backend:      docker logs pcm-backend-server -f"
echo "   - Ver logs frontend:     docker logs pcm-frontend-server -f"
echo "   - Detener:               docker-compose -f docker-compose.server.yml down"
echo "   - Reiniciar:             docker-compose -f docker-compose.server.yml restart"
echo "   - Ver estado:            docker ps"
echo ""
echo "================================================"

# ================================================
# 11. Mostrar logs en tiempo real (opcional)
# ================================================
echo ""
read -p "¿Deseas ver los logs en tiempo real? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Mostrando logs (Ctrl+C para salir)..."
    echo ""
    $DOCKER_COMPOSE -f docker-compose.server.yml logs -f
fi
