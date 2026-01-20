#!/bin/bash

# Script de deploy al servidor 
set -e

SERVER_IP="101.44.1.6"
SERVER_USER="root"
KEY_FILE="/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/KeyPair-cumplimiento.pem"
REMOTE_PATH="/root/PCM"
LOCAL_PATH="/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM"

echo "🚀 Iniciando deploy al servidor $SERVER_IP..."

# Crear archivo comprimido
echo "📦 Paso 1: Creando archivo comprimido..."
cd "$LOCAL_PATH"

# Limpiar archivos de macOS antes de comprimir
find . -name "._*" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

# Usar tar con COPYFILE_DISABLE para evitar archivos de metadatos de macOS
COPYFILE_DISABLE=1 tar --exclude='node_modules' --exclude='bin' --exclude='obj' --exclude='.git' --exclude='*.tar.gz' --exclude='._*' --exclude='.DS_Store' -czf /tmp/pcm-deploy.tar.gz .
echo "✅ Archivo creado: /tmp/pcm-deploy.tar.gz"

# Copiar al servidor
echo "📤 Paso 2: Copiando al servidor..."
scp -i "$KEY_FILE" /tmp/pcm-deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/
if [ $? -ne 0 ]; then
    echo "❌ Error al copiar el archivo. Verifica la contraseña."
    exit 1
fi
echo "✅ Archivo copiado exitosamente"

# Ejecutar deploy en el servidor
echo "🔄 Paso 3: Conectando y ejecutando deploy en el servidor..."
ssh -i "$KEY_FILE" ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
echo "📁 Creando/actualizando directorio del proyecto..."
mkdir -p /root/PCM
cd /root/PCM

echo "📦 Descomprimiendo archivos..."
tar -xzf /tmp/pcm-deploy.tar.gz
rm /tmp/pcm-deploy.tar.gz

echo "🧹 Limpiando archivos de macOS..."
find . -name "._*" -type f -delete
find . -name ".DS_Store" -type f -delete

echo "📍 Directorio actual: $(pwd)"
ls -la docker-compose.server.yml

echo "🛑 Deteniendo contenedores..."
docker compose -f docker-compose.server.yml down 2>/dev/null || docker-compose -f docker-compose.server.yml down 2>/dev/null || true
echo "🏗️  Construyendo y levantando contenedores..."
docker compose -f docker-compose.server.yml up -d --build 2>/dev/null || docker-compose -f docker-compose.server.yml up -d --build

echo "⏳ Esperando que los servicios inicien (30 segundos)..."
sleep 30

echo "📊 Estado de contenedores:"
docker ps --filter "name=pcm-"

echo ""
echo "✅ DEPLOY COMPLETADO EXITOSAMENTE"
echo "=================================================="
echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://101.44.1.6:3000"
echo "   Backend:  http://101.44.1.6:5164/api"
echo "   Health:   http://101.44.1.6:5164/health"
echo ""
echo "📋 Comandos útiles:"
echo "   ssh -i '$KEY_FILE' $SERVER_USER@$SERVER_IP 'docker ps'"
echo "   ssh -i '$KEY_FILE' $SERVER_USER@$SERVER_IP 'docker logs pcm-backend-server'"
echo "   Frontend: http://101.44.1.6:3000
echo "   Backend:  http://101.44.1.6:5165/api

📋 claves reCAPTCHA configuradas:
   Site Key: 6LcbukMsAAAAAIPzvfzToFDYpLxuSZEz3IkfVeCy
   Secret Key: 6LcbukMsAAAAAN1vrEdKmrFX_ISzqkN3Um4mPhWC
"
