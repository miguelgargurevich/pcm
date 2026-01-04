-- Script para corregir el estado de compromisos que ya tienen datos guardados
-- pero quedaron con estado "pendiente" en lugar de "en_proceso"
-- 
-- Ejecutar este script para actualizar los registros existentes
-- La corrección en el código ya está aplicada para nuevos registros

-- 1. Encontrar compromisos 1 que tienen datos en com1_liderg_td pero estado_id = 1 (pendiente)
-- y actualizar a estado_id = 4 (en_proceso)
UPDATE cumplimiento_normativo cn
SET estado_id = 4, -- EN PROCESO
    updated_at = NOW()
FROM com1_liderg_td c1
WHERE cn.entidad_id = c1.entidad_id
  AND cn.compromiso_id = 1
  AND c1.activo = true
  AND cn.estado_id = 1;  -- Solo actualizar los que están en PENDIENTE

-- 2. Encontrar compromisos 2 que tienen datos en com2_cgtd pero estado_id = 1 (pendiente)
-- y actualizar a estado_id = 4 (en_proceso)
UPDATE cumplimiento_normativo cn
SET estado_id = 4, -- EN PROCESO
    updated_at = NOW()
FROM com2_cgtd c2
WHERE cn.entidad_id = c2.entidad_id
  AND cn.compromiso_id = 2
  AND c2.activo = true
  AND cn.estado_id = 1;  -- Solo actualizar los que están en PENDIENTE

-- 3. Para compromisos que tienen datos en com1_liderg_td pero NO tienen registro en cumplimiento_normativo
-- O si tienen registro pero necesitan actualización, usar UPSERT
INSERT INTO cumplimiento_normativo (compromiso_id, entidad_id, estado_id, created_at)
SELECT 1, c1.entidad_id, 4, NOW()
FROM com1_liderg_td c1
WHERE c1.activo = true
ON CONFLICT (entidad_id, compromiso_id) 
DO UPDATE SET 
    estado_id = 4,
    updated_at = NOW()
WHERE cumplimiento_normativo.estado_id = 1; -- Solo actualizar si está en PENDIENTE

-- 4. Para compromisos que tienen datos en com2_cgtd pero NO tienen registro en cumplimiento_normativo
-- O si tienen registro pero necesitan actualización, usar UPSERT
INSERT INTO cumplimiento_normativo (compromiso_id, entidad_id, estado_id, created_at)
SELECT 2, c2.entidad_id, 4, NOW()
FROM com2_cgtd c2
WHERE c2.activo = true
ON CONFLICT (entidad_id, compromiso_id) 
DO UPDATE SET 
    estado_id = 4,
    updated_at = NOW()
WHERE cumplimiento_normativo.estado_id = 1; -- Solo actualizar si está en PENDIENTE

-- Verificar los cambios
SELECT 
  cn.cumplimiento_id,
  cn.compromiso_id,
  e.nombre as entidad,
  ec.nombre as estado,
  cn.estado_id,
  cn.updated_at
FROM cumplimiento_normativo cn
JOIN entidad e ON cn.entidad_id = e.entidad_id
LEFT JOIN estado_cumplimiento ec ON cn.estado_id = ec.estado_id
WHERE cn.compromiso_id IN (1, 2)
ORDER BY cn.entidad_id, cn.compromiso_id;
