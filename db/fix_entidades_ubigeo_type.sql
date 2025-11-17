-- FIX: Corregir tipo de dato de ubigeo_id en tabla entidades
-- Error: operator does not exist: character varying = uuid
-- La columna ubigeo_id debe ser UUID, no VARCHAR

-- Paso 1: Verificar el tipo actual de la columna
SELECT 
    column_name, 
    data_type, 
    udt_name 
FROM information_schema.columns 
WHERE table_name = 'entidades' 
  AND column_name = 'ubigeo_id';

-- Paso 2: Si la columna es VARCHAR, necesitamos convertirla a UUID
-- Primero, verificar si hay datos que no son UUID válidos
SELECT 
    entidad_id, 
    ubigeo_id,
    CASE 
        WHEN ubigeo_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 'UUID válido'
        ELSE 'UUID inválido'
    END as validacion
FROM entidades
WHERE ubigeo_id IS NOT NULL
  AND ubigeo_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Paso 3: Alterar el tipo de la columna
-- IMPORTANTE: Esto solo funciona si todos los valores son UUIDs válidos o NULL
BEGIN;

-- Intentar conversión directa con USING
ALTER TABLE entidades 
ALTER COLUMN ubigeo_id TYPE UUID 
USING CASE 
    WHEN ubigeo_id IS NULL THEN NULL
    WHEN ubigeo_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN ubigeo_id::UUID
    ELSE NULL  -- Si no es válido, convertir a NULL
END;

-- Verificar que el cambio se hizo correctamente
SELECT 
    column_name, 
    data_type, 
    udt_name 
FROM information_schema.columns 
WHERE table_name = 'entidades' 
  AND column_name = 'ubigeo_id';

COMMIT;

-- Paso 4: Verificar las foreign keys
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'entidades'
  AND kcu.column_name = 'ubigeo_id';

-- Paso 5: Si no existe la FK, crearla
ALTER TABLE entidades
ADD CONSTRAINT fk_entidades_ubigeo
FOREIGN KEY (ubigeo_id)
REFERENCES ubigeo(ubigeo_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Paso 6: Verificar el tipo de dato de ubigeo_id en la tabla ubigeo
SELECT 
    column_name, 
    data_type, 
    udt_name 
FROM information_schema.columns 
WHERE table_name = 'ubigeo' 
  AND column_name = 'ubigeo_id';
