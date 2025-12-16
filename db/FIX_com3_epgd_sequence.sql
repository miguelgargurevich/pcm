-- ====================================================================
-- FIX: Agregar secuencia auto-incremental a com3_epgd.comepgd_ent_id
-- ====================================================================
-- Problema: La columna comepgd_ent_id no tiene SERIAL/auto-increment
-- Solución: Crear secuencia y asociarla a la columna
-- ====================================================================

-- 1. Crear la secuencia si no existe
CREATE SEQUENCE IF NOT EXISTS com3_epgd_comepgd_ent_id_seq;

-- 2. Obtener el valor máximo actual (si hay datos)
SELECT setval('com3_epgd_comepgd_ent_id_seq', COALESCE((SELECT MAX(comepgd_ent_id) FROM com3_epgd), 0) + 1, false);

-- 3. Asociar la secuencia a la columna para que sea auto-incremental
ALTER TABLE com3_epgd 
  ALTER COLUMN comepgd_ent_id 
  SET DEFAULT nextval('com3_epgd_comepgd_ent_id_seq');

-- 4. Establecer la secuencia como propiedad de la columna (se eliminará si se elimina la columna)
ALTER SEQUENCE com3_epgd_comepgd_ent_id_seq OWNED BY com3_epgd.comepgd_ent_id;

-- 5. Verificar que la configuración sea correcta
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'com3_epgd' 
  AND column_name = 'comepgd_ent_id';

-- Resultado esperado:
-- column_name       | column_default                              | is_nullable | data_type
-- comepgd_ent_id    | nextval('com3_epgd_comepgd_ent_id_seq'...)  | NO          | bigint
