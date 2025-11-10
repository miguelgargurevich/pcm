-- VERIFICACIÓN URGENTE: ¿La columna activo existe realmente?
-- Ejecuta esto en Supabase SQL Editor para confirmar

-- 1. Ver TODAS las columnas de la tabla marco_normativo
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

-- 2. Si la columna NO aparece arriba, agrégala AHORA:
ALTER TABLE public.marco_normativo 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE NOT NULL;

-- 3. Actualizar todos los registros existentes
UPDATE public.marco_normativo 
SET activo = TRUE 
WHERE activo IS NULL;

-- 4. Crear índice
CREATE INDEX IF NOT EXISTS idx_marco_normativo_activo 
ON public.marco_normativo(activo);

-- 5. VERIFICAR que ahora sí existe
SELECT 
    column_name, 
    data_type, 
    ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'marco_normativo'
  AND column_name = 'activo';

-- Si la consulta anterior NO devuelve resultados, la columna NO existe
-- Si devuelve una fila, la columna SÍ existe

-- 6. Ver cuántos registros hay en la tabla
SELECT COUNT(*) as total_registros FROM public.marco_normativo;

-- 7. Ver si hay registros sin el campo activo
SELECT 
    norma_id,
    nombre_norma,
    CASE 
        WHEN activo IS NULL THEN 'NULL'
        WHEN activo = TRUE THEN 'TRUE'
        ELSE 'FALSE'
    END as estado_activo
FROM public.marco_normativo
LIMIT 5;
