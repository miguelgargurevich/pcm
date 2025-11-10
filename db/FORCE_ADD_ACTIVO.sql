-- ====================================
-- FORZAR AGREGAR COLUMNA activo
-- Ejecuta esto AHORA en Supabase SQL Editor
-- ====================================

-- PASO 1: Eliminar la columna si existe (para empezar limpio)
ALTER TABLE marco_normativo DROP COLUMN IF EXISTS activo;

-- PASO 2: Agregar la columna activo
ALTER TABLE marco_normativo 
ADD COLUMN activo BOOLEAN DEFAULT TRUE NOT NULL;

-- PASO 3: Actualizar todos los registros existentes
UPDATE marco_normativo 
SET activo = TRUE;

-- PASO 4: Crear índice
CREATE INDEX IF NOT EXISTS idx_marco_normativo_activo ON marco_normativo(activo);

-- PASO 5: Verificar
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

-- PASO 6: Contar registros
SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE activo = TRUE) as activos
FROM marco_normativo;

SELECT '✓ COLUMNA activo AGREGADA EXITOSAMENTE' as resultado;
