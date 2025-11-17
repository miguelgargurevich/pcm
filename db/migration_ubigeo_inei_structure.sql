-- ====================================
-- MIGRATION: Actualizar estructura de tabla ubigeo para formato INEI
-- ====================================

-- Paso 1: Crear tabla de respaldo
CREATE TABLE IF NOT EXISTS ubigeo_backup AS 
SELECT * FROM ubigeo;

-- Paso 2: Eliminar tabla actual (si existe)
DROP TABLE IF EXISTS ubigeo CASCADE;

-- Paso 3: Crear nueva tabla con estructura INEI (con campos TEXT sin límite)
CREATE TABLE ubigeo (
    ubigeo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Códigos INEI (TEXT para máxima flexibilidad)
    "UBDEP" TEXT,                  -- Código departamento
    "UBPRV" TEXT,                  -- Código provincia
    "UBDIS" TEXT,                  -- Código distrito - ÚNICO
    "UBLOC" TEXT,                  -- Código localidad
    "COREG" TEXT,                  -- Código región
    
    -- Nombres
    "NODEP" TEXT NOT NULL,         -- Nombre departamento
    "NOPRV" TEXT NOT NULL,         -- Nombre provincia
    "NODIS" TEXT NOT NULL,         -- Nombre distrito
    
    -- Código postal
    "CPDIS" TEXT,                  -- Código postal distrito
    
    -- Estados
    "STUBI" TEXT,                  -- Estado ubigeo
    "STSOB" TEXT,                  -- Estado sobre
    
    -- Información adicional
    "FERES" TEXT,                  -- Fecha resolución
    "INUBI" TEXT,                  -- Información ubigeo
    "UB_INEI" TEXT,                -- Código ubigeo INEI
    "CCOD_TIPO_UBI" TEXT,          -- Tipo ubigeo
    
    -- Campos de control
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Paso 4: Crear índices (sin UNIQUE en UBDIS porque puede haber duplicados)
CREATE INDEX idx_ubigeo_ubdis ON ubigeo("UBDIS");  -- Cambiado a índice normal
CREATE INDEX idx_ubigeo_ubdep ON ubigeo("UBDEP");
CREATE INDEX idx_ubigeo_ubprv ON ubigeo("UBPRV");
CREATE INDEX idx_ubigeo_nodep ON ubigeo("NODEP");
CREATE INDEX idx_ubigeo_noprv ON ubigeo("NOPRV");
CREATE INDEX idx_ubigeo_nodis ON ubigeo("NODIS");
CREATE INDEX idx_ubigeo_activo ON ubigeo(activo);

-- Índice compuesto para búsquedas por departamento-provincia-distrito
CREATE INDEX idx_ubigeo_completo ON ubigeo("UBDEP", "UBPRV", "UBDIS");

-- Paso 5: Comentarios de documentación
COMMENT ON TABLE ubigeo IS 'Tabla de ubigeos del Perú según formato INEI';
COMMENT ON COLUMN ubigeo."UBDIS" IS 'Código único de 6 dígitos del distrito (INEI)';
COMMENT ON COLUMN ubigeo."NODEP" IS 'Nombre del departamento';
COMMENT ON COLUMN ubigeo."NOPRV" IS 'Nombre de la provincia';
COMMENT ON COLUMN ubigeo."NODIS" IS 'Nombre del distrito';

-- Paso 6: Verificación
SELECT 
    'Tabla ubigeo recreada exitosamente' as mensaje,
    COUNT(*) as registros_actuales
FROM ubigeo;

-- Paso 7: Información sobre cómo importar datos
SELECT '============================================' as info;
SELECT 'IMPORTANTE: Ahora debes importar el CSV de INEI' as info;
SELECT 'Columnas esperadas en el CSV:' as info;
SELECT 'UBDEP, UBPRV, UBDIS, UBLOC, COREG, NODEP, NOPRV, NODIS, CPDIS, STUBI, STSOB, FERES, INUBI, UB_INEI, CCOD_TIPO_UBI' as columnas;
SELECT '============================================' as info;
