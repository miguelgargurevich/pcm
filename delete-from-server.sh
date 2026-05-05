#!/bin/bash

# Script para eliminar el proyecto del servidor
set -e

SERVER_IP="101.44.1.6"
SERVER_USER="root"
KEY_FILE="/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/KeyPair-cumplimiento.pem"

echo "🗑️  Eliminando proyecto PCM del servidor $SERVER_IP..."

ssh -i "$KEY_FILE" ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
echo "🛑 Deteniendo contenedores Docker..."
cd /root/PCM 2>/dev/null && docker compose down 2>/dev/null || echo "No se pudo ejecutar docker compose down"

echo "🛑 Deteniendo contenedores por nombre..."
docker stop pcm-frontend-server pcm-backend-server 2>/dev/null || echo "No hay contenedores corriendo"

echo "🗑️  Eliminando contenedores..."
docker rm pcm-frontend-server pcm-backend-server 2>/dev/null || echo "No hay contenedores para eliminar"

echo "🗑️  Eliminando imágenes Docker del proyecto..."
docker rmi pcm-frontend:latest pcm-backend:latest 2>/dev/null || echo "No hay imágenes para eliminar"

echo "🗑️  Eliminando directorio del proyecto..."
rm -rf /root/PCM

echo "🧹 Limpiando sistema Docker (imágenes, redes, volúmenes no utilizados)..."
docker system prune -af --volumes

echo "✅ Proyecto eliminado exitosamente del servidor"
ENDSSH

echo "✅ Proceso completado"
