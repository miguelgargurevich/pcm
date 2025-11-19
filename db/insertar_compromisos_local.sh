#!/bin/bash

# =====================================================
# Script para insertar compromisos en base de datos local
# =====================================================

echo "🔍 Verificando compromisos en base de datos local..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Solicitar datos de conexión
read -p "Host PostgreSQL (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Puerto (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Nombre de la base de datos (default: pcm_db): " DB_NAME
DB_NAME=${DB_NAME:-pcm_db}

read -p "Usuario (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Password: " DB_PASS
echo ""
echo ""

export PGPASSWORD=$DB_PASS

# Verificar conexión
echo "📡 Probando conexión..."
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Conexión exitosa${NC}"
else
    echo -e "${RED}❌ Error de conexión. Verifica tus credenciales.${NC}"
    exit 1
fi

echo ""
echo "🔍 Verificando compromisos existentes..."
CURRENT_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM compromiso_gobierno_digital;")
echo -e "   Compromisos actuales: ${YELLOW}${CURRENT_COUNT}${NC}"

echo ""
echo "📥 Insertando 4 compromisos base..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/FIX_LOCAL_insertar_compromisos.sql"

echo ""
NEW_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM compromiso_gobierno_digital;")
echo -e "${GREEN}✅ Completado. Total de compromisos: ${NEW_COUNT}${NC}"

echo ""
echo "📋 Listando compromisos:"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT compromiso_id, nombre_compromiso, orden, activo FROM compromiso_gobierno_digital ORDER BY orden;"

unset PGPASSWORD
