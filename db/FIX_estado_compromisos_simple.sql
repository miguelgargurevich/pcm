-- Script SIMPLIFICADO para corregir el estado de compromisos existentes
-- Este script es más seguro ya que solo actualiza registros existentes

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

-- Verificar los cambios
SELECT 
  cn.cumplimiento_id,
  cn.compromiso_id,
  e.nombre as entidad,
  ec.nombre as estado,
  cn.estado_id,
  cn.created_at,
  cn.updated_at
FROM cumplimiento_normativo cn
JOIN entidades e ON cn.entidad_id = e.entidad_id
LEFT JOIN estado_cumplimiento ec ON cn.estado_id = ec.estado_id
WHERE cn.compromiso_id IN (1, 2)
  AND cn.estado_id = 4  -- Solo mostrar los que ahora están EN PROCESO
ORDER BY cn.entidad_id, cn.compromiso_id;