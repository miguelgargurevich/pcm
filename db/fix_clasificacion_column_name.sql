-- ====================================
-- FIX: Renombrar columna clasificacion_id(36) a clasificacion_id
-- ====================================

-- PASO 1: Primero verificar el nombre real de la columna
SELECT 
    '=== COLUMNAS ACTUALES DE CLASIFICACION ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'clasificacion'
ORDER BY ordinal_position;

-- PASO 2: Ver los datos antes del cambio
SELECT 
    '=== PRIMEROS 5 REGISTROS ===' as info;

SELECT * FROM clasificacion LIMIT 5;

-- PASO 3: Renombrar la columna si tiene el nombre incorrecto
-- Nota: PostgreSQL permite nombres de columna con paréntesis si están entre comillas
DO $$
DECLARE
    col_exists BOOLEAN;
BEGIN
    -- Verificar si existe la columna con el nombre incorrecto
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clasificacion' 
        AND column_name = 'clasificacion_id(36)'
    ) INTO col_exists;
    
    IF col_exists THEN
        RAISE NOTICE 'Renombrando columna "clasificacion_id(36)" a "clasificacion_id"...';
        
        -- Renombrar la columna
        ALTER TABLE clasificacion 
        RENAME COLUMN "clasificacion_id(36)" TO clasificacion_id;
        
        RAISE NOTICE '✓ Columna renombrada exitosamente';
    ELSE
        RAISE NOTICE 'La columna ya tiene el nombre correcto o no existe con ese nombre';
    END IF;
END $$;

-- PASO 4: Verificar el resultado
SELECT 
    '=== COLUMNAS DESPUÉS DEL CAMBIO ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'clasificacion'
ORDER BY ordinal_position;

-- PASO 5: Verificar que ahora podemos consultar correctamente
SELECT 
    '=== DATOS FINALES ===' as info;

SELECT * FROM clasificacion ORDER BY clasificacion_id LIMIT 5;

-- PASO 6: Agregar columnas faltantes
DO $$
BEGIN
    -- Agregar columna descripcion si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clasificacion' 
        AND column_name = 'descripcion'
    ) THEN
        ALTER TABLE clasificacion 
        ADD COLUMN descripcion VARCHAR(255);
        
        RAISE NOTICE '✓ Columna descripcion agregada';
    ELSE
        RAISE NOTICE 'La columna descripcion ya existe';
    END IF;
    
    -- Agregar columna activo si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clasificacion' 
        AND column_name = 'activo'
    ) THEN
        ALTER TABLE clasificacion 
        ADD COLUMN activo BOOLEAN DEFAULT true;
        
        -- Actualizar registros existentes
        UPDATE clasificacion SET activo = true WHERE activo IS NULL;
        
        RAISE NOTICE '✓ Columna activo agregada';
    ELSE
        RAISE NOTICE 'La columna activo ya existe';
    END IF;
    
    -- Agregar columna created_at si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clasificacion' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE clasificacion 
        ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
        
        -- Actualizar registros existentes
        UPDATE clasificacion SET created_at = NOW() WHERE created_at IS NULL;
        
        RAISE NOTICE '✓ Columna created_at agregada';
    ELSE
        RAISE NOTICE 'La columna created_at ya existe';
    END IF;
END $$;

-- PASO 7: Verificar estructura final
SELECT 
    '=== ESTRUCTURA FINAL ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'clasificacion'
ORDER BY ordinal_position;

-- PASO 8: Verificar datos finales
SELECT 
    '=== DATOS FINALES (después de agregar columnas) ===' as info;

SELECT * FROM clasificacion ORDER BY clasificacion_id LIMIT 5;

SELECT '✓✓✓ CORRECCIÓN COMPLETADA ✓✓✓' as status;
