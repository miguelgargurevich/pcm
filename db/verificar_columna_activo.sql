-- Verificar si la columna activo existe y tiene datos correctos
SELECT 
    'Verificando tabla marco_normativo' as status;

-- 1. Verificar estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'marco_normativo'
ORDER BY ordinal_position;

-- 2. Contar registros con y sin valor en activo
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN activo IS NOT NULL THEN 1 END) as con_activo,
    COUNT(CASE WHEN activo IS NULL THEN 1 END) as sin_activo
FROM marco_normativo;

-- 3. Ver algunos registros de ejemplo
SELECT 
    norma_id,
    nombre_norma,
    activo
FROM marco_normativo
LIMIT 5;

-- 4. Si hay registros NULL, actualízalos
UPDATE marco_normativo 
SET activo = TRUE 
WHERE activo IS NULL;

-- 5. Verificar nuevamente después de la actualización
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN activo IS NOT NULL THEN 1 END) as con_activo,
    COUNT(CASE WHEN activo IS NULL THEN 1 END) as sin_activo
FROM marco_normativo;
