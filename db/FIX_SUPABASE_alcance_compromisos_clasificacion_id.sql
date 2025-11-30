-- ====================================
-- FIX: Verificar y agregar columna clasificacion_id en alcance_compromisos
-- Ejecutar en Supabase SQL Editor
-- ====================================

-- PASO 1: Verificar estructura actual de la tabla
SELECT 
    '=== ESTRUCTURA ACTUAL DE alcance_compromisos ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'alcance_compromisos'
ORDER BY ordinal_position;

-- PASO 2: Verificar si la columna clasificacion_id existe
DO $$
DECLARE
    col_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'alcance_compromisos' 
        AND column_name = 'clasificacion_id'
    ) INTO col_exists;
    
    IF col_exists THEN
        RAISE NOTICE '✓ La columna clasificacion_id ya existe en alcance_compromisos';
    ELSE
        RAISE NOTICE '✗ La columna clasificacion_id NO existe en alcance_compromisos';
        RAISE NOTICE 'Agregando la columna...';
        
        -- Agregar la columna
        ALTER TABLE alcance_compromisos 
        ADD COLUMN clasificacion_id BIGINT;
        
        RAISE NOTICE '✓ Columna clasificacion_id agregada';
    END IF;
END $$;

-- PASO 3: Crear FK si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_alcance_compromiso_clasificacion'
    ) THEN
        ALTER TABLE alcance_compromisos
        ADD CONSTRAINT fk_alcance_compromiso_clasificacion
        FOREIGN KEY (clasificacion_id) 
        REFERENCES clasificacion(clasificacion_id);
        
        RAISE NOTICE '✓ FK fk_alcance_compromiso_clasificacion creada';
    ELSE
        RAISE NOTICE '✓ FK fk_alcance_compromiso_clasificacion ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al crear FK: %', SQLERRM;
END $$;

-- PASO 4: Crear índice si no existe
CREATE INDEX IF NOT EXISTS idx_alcance_compromisos_clasificacion 
ON alcance_compromisos(clasificacion_id);

-- PASO 5: Verificar estructura final
SELECT 
    '=== ESTRUCTURA FINAL DE alcance_compromisos ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'alcance_compromisos'
ORDER BY ordinal_position;

-- PASO 6: Verificar datos existentes
SELECT 
    '=== DATOS EXISTENTES ===' as info;

SELECT * FROM alcance_compromisos LIMIT 10;

SELECT '✓✓✓ VERIFICACIÓN/CORRECCIÓN COMPLETADA ✓✓✓' as status;
