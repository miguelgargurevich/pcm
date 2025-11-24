-- ============================================================
-- Script de Migración: Criterios Evaluados Com1
-- Objetivo: Mover criterios_evaluados de com1_liderg_td 
--           a cumplimiento_normativo.criterios_evaluados
-- ============================================================

BEGIN;

-- Paso 1: Mostrar datos actuales antes de la migración
SELECT 'ANTES DE LA MIGRACIÓN - Datos en com1_liderg_td:' as paso;
SELECT 
    comlgtd_ent_id, 
    entidad_id,
    criterios_evaluados,
    created_at
FROM com1_liderg_td 
WHERE criterios_evaluados IS NOT NULL AND criterios_evaluados != '[]'
ORDER BY comlgtd_ent_id;

SELECT 'ANTES DE LA MIGRACIÓN - Datos en cumplimiento_normativo para Com1:' as paso;
SELECT 
    id,
    compromiso_id,
    entidad_id,
    criterios_evaluados,
    created_at
FROM cumplimiento_normativo
WHERE compromiso_id = 1
ORDER BY id;

-- Paso 2: Actualizar cumplimiento_normativo con los criterios de com1_liderg_td
UPDATE cumplimiento_normativo cn
SET 
    criterios_evaluados = c1.criterios_evaluados,
    updated_at = CURRENT_TIMESTAMP
FROM com1_liderg_td c1
WHERE cn.compromiso_id = 1 
  AND cn.entidad_id = c1.entidad_id
  AND c1.criterios_evaluados IS NOT NULL 
  AND c1.criterios_evaluados != '[]';

-- Mostrar cuántos registros fueron actualizados
SELECT 'REGISTROS ACTUALIZADOS:' as paso, COUNT(*) as cantidad
FROM cumplimiento_normativo cn
JOIN com1_liderg_td c1 ON cn.entidad_id = c1.entidad_id
WHERE cn.compromiso_id = 1 
  AND c1.criterios_evaluados IS NOT NULL 
  AND c1.criterios_evaluados != '[]';

-- Paso 3: Verificar datos después de la migración
SELECT 'DESPUÉS DE LA MIGRACIÓN - Datos en cumplimiento_normativo:' as paso;
SELECT 
    id,
    compromiso_id,
    entidad_id,
    criterios_evaluados,
    updated_at
FROM cumplimiento_normativo
WHERE compromiso_id = 1 
  AND criterios_evaluados IS NOT NULL 
  AND criterios_evaluados != '[]'
ORDER BY id;

-- Paso 4: Eliminar el campo criterios_evaluados de com1_liderg_td
ALTER TABLE com1_liderg_td DROP COLUMN IF EXISTS criterios_evaluados;

-- Verificar que el campo fue eliminado
SELECT 'VERIFICACIÓN FINAL - Columnas de com1_liderg_td:' as paso;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'com1_liderg_td' 
ORDER BY ordinal_position;

COMMIT;

SELECT '✅ MIGRACIÓN COMPLETADA EXITOSAMENTE' as resultado;
