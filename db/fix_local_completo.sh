#!/bin/bash

# =====================================================
# Script COMPLETO: Arreglar BD Local para Cumplimiento Normativo
# =====================================================

echo "🔧 FIX COMPLETO: Base de Datos Local"
echo "====================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Solicitar datos de conexión
echo -e "${BLUE}📋 Datos de conexión PostgreSQL:${NC}"
read -p "Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Puerto (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Base de datos (default: pcm_db): " DB_NAME
DB_NAME=${DB_NAME:-pcm_db}

read -p "Usuario (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Password: " DB_PASS
echo ""
echo ""

export PGPASSWORD=$DB_PASS

# Verificar conexión
echo -e "${YELLOW}📡 Probando conexión...${NC}"
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Conexión exitosa${NC}"
else
    echo -e "${RED}❌ Error de conexión. Verifica tus credenciales.${NC}"
    exit 1
fi

echo ""
echo "============================================"
echo "🔧 FIX 1: Agregar updated_at a marco_normativo"
echo "============================================"

psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME <<EOF
-- Agregar columna updated_at
DO \$\$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'marco_normativo' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE marco_normativo 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        UPDATE marco_normativo 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
        
        RAISE NOTICE '✅ Columna updated_at agregada exitosamente';
    ELSE
        RAISE NOTICE '⚠️  La columna updated_at ya existe';
    END IF;
END \$\$;
EOF

echo ""
echo "============================================"
echo "🔧 FIX 2: Insertar 4 Compromisos Base"
echo "============================================"

# Verificar compromisos existentes
CURRENT_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM compromiso_gobierno_digital WHERE compromiso_id IN (1,2,3,4);")
echo -e "Compromisos actuales (IDs 1-4): ${YELLOW}${CURRENT_COUNT}${NC}"

# Insertar compromisos
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME <<EOF
INSERT INTO compromiso_gobierno_digital (
    compromiso_id,
    nombre_compromiso,
    descripcion,
    orden,
    alcances,
    estado,
    activo,
    created_at
) VALUES
(1, 'Designar al Líder de Gobierno y Transformación Digital', 
 'La entidad deberá designar mediante Resolución al Líder de Gobierno y Transformación Digital, quien será responsable de liderar la implementación de las políticas y estrategias de gobierno digital.', 
 1, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(2, 'Construir el Comité de Gobierno y Transformación Digital', 
 'La entidad deberá conformar el Comité de Gobierno y Transformación Digital como órgano colegiado responsable de aprobar y supervisar las iniciativas de transformación digital.', 
 2, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(3, 'Elaborar Plan de Gobierno Digital', 
 'La entidad deberá elaborar su Plan de Gobierno Digital alineado a los objetivos estratégicos institucionales y a la Agenda Digital al Bicentenario.', 
 3, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(4, 'Desplegar la Estrategia Digital', 
 'La entidad deberá implementar y desplegar la estrategia de gobierno digital mediante proyectos y actividades que materialicen la transformación digital institucional.', 
 4, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP)
ON CONFLICT (compromiso_id) DO NOTHING;
EOF

NEW_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM compromiso_gobierno_digital WHERE compromiso_id IN (1,2,3,4);")
echo -e "${GREEN}✅ Compromisos insertados. Total: ${NEW_COUNT}${NC}"

echo ""
echo "============================================"
echo "📋 VERIFICACIÓN FINAL"
echo "============================================"

echo ""
echo -e "${BLUE}1. Compromisos en la BD:${NC}"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT compromiso_id, nombre_compromiso, orden, activo FROM compromiso_gobierno_digital WHERE compromiso_id IN (1,2,3,4) ORDER BY orden;"

echo ""
echo -e "${BLUE}2. Columna updated_at en marco_normativo:${NC}"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'marco_normativo' AND column_name = 'updated_at';"

echo ""
echo "============================================"
echo -e "${GREEN}✅ FIX COMPLETADO${NC}"
echo "============================================"
echo ""
echo "📌 Próximos pasos:"
echo "   1. El backend ya debería cargar los compromisos sin errores"
echo "   2. Recarga la página del frontend: http://localhost:5173"
echo "   3. Deberías ver una tabla con 4 compromisos"
echo ""

unset PGPASSWORD
