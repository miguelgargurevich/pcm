-- PRODUCCIÓN: Fix urgente para ubigeo_id en tablas ubigeo y entidades
-- Ejecutar este script en la base de datos de producción

-- 1. Primero, eliminar FK existente si existe
ALTER TABLE IF EXISTS entidades 
DROP CONSTRAINT IF EXISTS fk_entidades_ubigeo;

-- 2. Convertir ubigeo_id en tabla UBIGEO de VARCHAR a UUID
ALTER TABLE ubigeo 
ALTER COLUMN ubigeo_id TYPE UUID 
USING ubigeo_id::UUID;

-- 3. Convertir ubigeo_id en tabla ENTIDADES de VARCHAR a UUID  
ALTER TABLE entidades 
ALTER COLUMN ubigeo_id TYPE UUID 
USING ubigeo_id::UUID;

-- 4. Recrear constraint FK
ALTER TABLE entidades
ADD CONSTRAINT fk_entidades_ubigeo
FOREIGN KEY (ubigeo_id)
REFERENCES ubigeo(ubigeo_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- 5. Verificar resultado
SELECT 
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE (table_name = 'entidades' OR table_name = 'ubigeo')
  AND column_name = 'ubigeo_id'
ORDER BY table_name;
