-- Script MUY SIMPLE para corregir el estado de compromisos existentes
-- Sin JOINs para evitar problemas con nombres de tablas

-- 1. Actualizar compromisos 1 que tienen datos guardados pero están en PENDIENTE
UPDATE cumplimiento_normativo 
SET estado_id = 4, -- EN PROCESO
    updated_at = NOW()
WHERE compromiso_id = 1 
  AND estado_id = 1  -- Solo los que están en PENDIENTE
  AND EXISTS (
    SELECT 1 FROM com1_liderg_td c1 
    WHERE c1.entidad_id = cumplimiento_normativo.entidad_id 
    AND c1.activo = true
  );

-- 2. Actualizar compromisos 2 que tienen datos guardados pero están en PENDIENTE
UPDATE cumplimiento_normativo 
SET estado_id = 4, -- EN PROCESO
    updated_at = NOW()
WHERE compromiso_id = 2 
  AND estado_id = 1  -- Solo los que están en PENDIENTE
  AND EXISTS (
    SELECT 1 FROM com2_cgtd c2 
    WHERE c2.entidad_id = cumplimiento_normativo.entidad_id 
    AND c2.activo = true
  );

-- Verificar cuántos registros se actualizaron
SELECT 
  compromiso_id,
  COUNT(*) as registros_actualizados
FROM cumplimiento_normativo 
WHERE estado_id = 4 
  AND compromiso_id IN (1, 2)
GROUP BY compromiso_id;

-- Ver todos los compromisos 1 y 2 que ahora están EN PROCESO
SELECT 
  cumplimiento_id,
  compromiso_id,
  entidad_id,
  estado_id,
  updated_at
FROM cumplimiento_normativo 
WHERE compromiso_id IN (1, 2)
  AND estado_id = 4
ORDER BY compromiso_id, entidad_id;