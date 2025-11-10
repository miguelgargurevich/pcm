-- Ejecuta esto en Supabase para verificar si la columna activo existe

SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'marco_normativo'
AND column_name = 'activo';

-- Si no hay resultados, la columna NO EXISTE
-- Si hay resultados, la columna SÍ EXISTE
