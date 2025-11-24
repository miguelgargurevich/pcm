-- Migración de criterios_evaluados de com1_liderg_td a cumplimiento_normativo
-- Este script migra los criterios del compromiso 1 al nuevo campo JSON en cumplimiento_normativo

-- Paso 1: Verificar los datos actuales en com1_liderg_td
SELECT 
    comlgtd_ent_id,
    compromiso_id,
    entidad_id,
    criterios_evaluados,
    etapa_formulario
FROM com1_liderg_td
WHERE criterios_evaluados IS NOT NULL
ORDER BY comlgtd_ent_id;

-- Paso 2: Verificar los registros en cumplimiento_normativo del compromiso 1
SELECT 
    cumplimiento_normativo_id,
    compromiso_id,
    entidad_id,
    criterios_evaluados,
    documento_url
FROM cumplimiento_normativo
WHERE compromiso_id = 1
ORDER BY cumplimiento_normativo_id;

-- Paso 3: Migrar los datos de criterios_evaluados de com1_liderg_td a cumplimiento_normativo
-- Solo si existe el registro en cumplimiento_normativo
UPDATE cumplimiento_normativo cn
SET criterios_evaluados = c1.criterios_evaluados::jsonb
FROM com1_liderg_td c1
WHERE cn.compromiso_id = c1.compromiso_id
  AND cn.entidad_id = c1.entidad_id
  AND c1.compromiso_id = 1
  AND c1.criterios_evaluados IS NOT NULL
  AND c1.criterios_evaluados != '';

-- Paso 4: Verificar la migración
SELECT 
    cn.cumplimiento_normativo_id,
    cn.compromiso_id,
    cn.entidad_id,
    cn.criterios_evaluados as criterios_en_cumplimiento,
    c1.criterios_evaluados as criterios_en_com1,
    cn.documento_url
FROM cumplimiento_normativo cn
LEFT JOIN com1_liderg_td c1 ON cn.compromiso_id = c1.compromiso_id AND cn.entidad_id = c1.entidad_id
WHERE cn.compromiso_id = 1
ORDER BY cn.cumplimiento_normativo_id;

-- Paso 5: Eliminar la columna criterios_evaluados de com1_liderg_td
-- (Descomenta esta línea cuando estés seguro de la migración)
-- ALTER TABLE com1_liderg_td DROP COLUMN IF EXISTS criterios_evaluados;

-- Verificación final: Contar registros con criterios en ambas tablas
SELECT 
    'com1_liderg_td' as tabla,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN criterios_evaluados IS NOT NULL AND criterios_evaluados != '' THEN 1 END) as con_criterios
FROM com1_liderg_td
WHERE compromiso_id = 1

UNION ALL

SELECT 
    'cumplimiento_normativo' as tabla,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN criterios_evaluados IS NOT NULL AND criterios_evaluados != '[]'::jsonb THEN 1 END) as con_criterios
FROM cumplimiento_normativo
WHERE compromiso_id = 1;
