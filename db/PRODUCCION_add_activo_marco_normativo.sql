-- ====================================
-- SCRIPT PARA PRODUCCIÓN EN SUPABASE
-- Agregar columna activo a marco_normativo
-- ====================================

-- PASO 1: Verificar el estado actual de la tabla
SELECT 
    '=== VERIFICANDO TABLA marco_normativo ===' as status;

-- Ver si existe la tabla
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'marco_normativo'
        ) THEN '✓ La tabla marco_normativo EXISTE'
        ELSE '✗ La tabla marco_normativo NO EXISTE'
    END as tabla_status;

-- Ver las columnas actuales
SELECT 
    '=== COLUMNAS ACTUALES ===' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

-- PASO 2: Agregar la columna activo si no existe
DO $$
BEGIN
    -- Verificar si la columna activo ya existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'marco_normativo' 
        AND column_name = 'activo'
    ) THEN
        -- Agregar la columna con valor por defecto
        ALTER TABLE marco_normativo 
        ADD COLUMN activo BOOLEAN DEFAULT TRUE NOT NULL;
        
        RAISE NOTICE '✓ Columna activo agregada exitosamente a marco_normativo';
    ELSE
        RAISE NOTICE '⚠ La columna activo ya existe en marco_normativo';
    END IF;
END $$;

-- PASO 3: Asegurar que todos los registros existentes tengan activo = TRUE
UPDATE marco_normativo 
SET activo = TRUE 
WHERE activo IS NULL OR activo = FALSE;

-- PASO 4: Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_marco_normativo_activo ON marco_normativo(activo);

-- PASO 5: Verificar el resultado final
SELECT 
    '=== ✓ RESULTADO FINAL ===' as resultado;

SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

-- Contar registros activos
SELECT 
    '=== ESTADÍSTICAS ===' as stats;
SELECT 
    COUNT(*) as total_registros,
    COUNT(*) FILTER (WHERE activo = TRUE) as registros_activos,
    COUNT(*) FILTER (WHERE activo = FALSE) as registros_inactivos
FROM marco_normativo;

SELECT '✓ MIGRACIÓN COMPLETADA EXITOSAMENTE' as resultado;
