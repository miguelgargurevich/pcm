#!/bin/bash

# =====================================================
# Script para ejecutar FIX de COM6 en base de datos local
# =====================================================

echo "🔧 Ejecutando FIX para tabla COM6_MPGOBPE..."
echo ""

# Configuración de base de datos local
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="pcm_db"
DB_USER="postgres"

# Ruta al script SQL
SCRIPT_PATH="$(dirname "$0")/FIX_URGENTE_com6_estructura_completa.sql"

# Verificar que existe el script
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ Error: No se encontró el archivo $SCRIPT_PATH"
    exit 1
fi

echo "📄 Script: $SCRIPT_PATH"
echo "🗄️  Base de datos: $DB_NAME en $DB_HOST:$DB_PORT"
echo ""
echo "⚠️  Asegúrate de que PostgreSQL esté corriendo y que tengas las credenciales correctas"
echo ""

# Solicitar contraseña
read -sp "🔑 Ingresa la contraseña de PostgreSQL: " DB_PASSWORD
echo ""
echo ""

# Ejecutar el script
echo "⏳ Ejecutando script SQL..."
echo ""

PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SCRIPT_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ FIX ejecutado exitosamente"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Si el backend está corriendo, reinícialo (Ctrl+C y npm run dev nuevamente)"
    echo "   2. Recarga la página del frontend"
    echo "   3. Intenta abrir/editar el Compromiso 6"
    echo ""
else
    echo ""
    echo "❌ Error al ejecutar el script"
    echo ""
    echo "Posibles causas:"
    echo "  - PostgreSQL no está corriendo"
    echo "  - Credenciales incorrectas"
    echo "  - El nombre de la base de datos es diferente"
    echo ""
    echo "Para verificar, intenta conectarte manualmente:"
    echo "  psql -h localhost -p 5432 -U postgres -d pcm_db"
    echo ""
    exit 1
fi
