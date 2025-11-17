#!/bin/bash

# Script para importar ubigeos a base de datos local PostgreSQL
# Asegúrate de tener el archivo CSV en la misma carpeta

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         IMPORTAR UBIGEOS A BASE DE DATOS LOCAL            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Configuración de conexión (ajusta según tu configuración local)
DB_HOST="localhost"
DB_PORT="5433"
DB_NAME="plataforma_cumplimiento_digital"
DB_USER="dashboard_user"
DB_PASSWORD="dashboard_pass"  # Cambia esto por tu contraseña

# Archivo CSV
CSV_FILE="ubigeo.csv"

if [ ! -f "$CSV_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo $CSV_FILE"
    echo "Por favor coloca el archivo CSV en la carpeta db/"
    exit 1
fi

echo "📁 Archivo CSV encontrado: $CSV_FILE"
echo "🗄️  Conectando a base de datos: $DB_NAME"
echo ""

# Ejecutar la migración SQL
echo "1️⃣  Ejecutando migración de estructura..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f migration_ubigeo_inei_structure.sql

if [ $? -ne 0 ]; then
    echo "❌ Error al ejecutar la migración"
    exit 1
fi

echo "✅ Estructura creada exitosamente"
echo ""

# Importar datos desde CSV
echo "2️⃣  Importando datos desde CSV..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\COPY ubigeo(\"UBDEP\", \"UBPRV\", \"UBDIS\", \"UBLOC\", \"COREG\", \"NODEP\", \"NOPRV\", \"NODIS\", \"CPDIS\", \"STUBI\", \"STSOB\", \"FERES\", \"INUBI\", \"UB_INEI\", \"CCOD_TIPO_UBI\") FROM '$CSV_FILE' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');"

if [ $? -ne 0 ]; then
    echo "❌ Error al importar datos"
    exit 1
fi

echo "✅ Datos importados exitosamente"
echo ""

# Limpiar espacios en blanco de los nombres
echo "2.1️⃣  Limpiando espacios en blanco..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "UPDATE ubigeo SET \"NODEP\" = TRIM(\"NODEP\"), \"NOPRV\" = TRIM(\"NOPRV\"), \"NODIS\" = TRIM(\"NODIS\"), \"UBDEP\" = TRIM(\"UBDEP\"), \"UBPRV\" = TRIM(\"UBPRV\"), \"UBDIS\" = TRIM(\"UBDIS\");"

if [ $? -ne 0 ]; then
    echo "❌ Error al limpiar espacios"
    exit 1
fi

echo "✅ Espacios limpiados exitosamente"
echo ""

# Verificar importación
echo "3️⃣  Verificando importación..."
REGISTRO_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM ubigeo;")

echo "📊 Total de registros importados: $REGISTRO_COUNT"
echo ""

# Mostrar algunos ejemplos
echo "📋 Primeros 5 registros:"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT \"UBDEP\", \"UBPRV\", \"UBDIS\", \"NODEP\", \"NOPRV\", \"NODIS\" FROM ubigeo LIMIT 5;"

echo ""
echo "✅ Importación completada exitosamente"
