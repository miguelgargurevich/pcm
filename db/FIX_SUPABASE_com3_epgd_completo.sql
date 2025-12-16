-- ====================================================================
-- FIX COMPLETO: com3_epgd - Secuencia y columna faltante
-- ====================================================================
-- Aplica todos los fixes necesarios para com3_epgd
-- ====================================================================

-- 1. Agregar columna rutaPDF_normativa si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com3_epgd' AND column_name = 'rutaPDF_normativa'
    ) THEN
        ALTER TABLE com3_epgd 
        ADD COLUMN "rutaPDF_normativa" varchar(500);
        
        RAISE NOTICE 'Columna rutaPDF_normativa agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna rutaPDF_normativa ya existe';
    END IF;
END $$;

-- 2. Crear la secuencia si no existe
CREATE SEQUENCE IF NOT EXISTS com3_epgd_comepgd_ent_id_seq;

-- 3. Obtener el valor máximo actual (si hay datos) y configurar secuencia
SELECT setval('com3_epgd_comepgd_ent_id_seq', 
              COALESCE((SELECT MAX(comepgd_ent_id) FROM com3_epgd), 0) + 1, 
              false);

-- 4. Asociar la secuencia a la columna para que sea auto-incremental
ALTER TABLE com3_epgd 
  ALTER COLUMN comepgd_ent_id 
  SET DEFAULT nextval('com3_epgd_comepgd_ent_id_seq');

-- 5. Establecer la secuencia como propiedad de la columna
ALTER SEQUENCE com3_epgd_comepgd_ent_id_seq OWNED BY com3_epgd.comepgd_ent_id;

-- 6. Verificar configuración
SELECT 
    'com3_epgd' as tabla,
    column_name,
    column_default,
    is_nullable,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'com3_epgd' 
  AND column_name IN ('comepgd_ent_id', 'rutaPDF_normativa')
ORDER BY column_name;

-- Resultado esperado:
-- comepgd_ent_id    | nextval('com3_epgd_comepgd_ent_id_seq'...)  | NO  | bigint   | null
-- rutaPDF_normativa | NULL                                        | YES | varchar  | 500
