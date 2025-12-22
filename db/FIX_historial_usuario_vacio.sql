-- Script para corregir los registros de historial con usuario_responsable_id = '00000000-0000-0000-0000-000000000000'
-- Este script asigna el usuario correcto basándose en la entidad del cumplimiento

-- Primero, ver cuántos registros tienen Guid.Empty
SELECT COUNT(*) as total_registros_vacios
FROM cumplimiento_historial
WHERE usuario_responsable_id = '00000000-0000-0000-0000-000000000000';

-- Ver qué entidades tienen esos registros
SELECT 
    cn.entidad_id,
    e.nombre as entidad_nombre,
    COUNT(*) as cantidad_registros
FROM cumplimiento_historial ch
INNER JOIN cumplimiento_normativo cn ON ch.cumplimiento_id = cn.cumplimiento_id
INNER JOIN entidades e ON cn.entidad_id = e.entidad_id
WHERE ch.usuario_responsable_id = '00000000-0000-0000-0000-000000000000'
GROUP BY cn.entidad_id, e.nombre
ORDER BY cantidad_registros DESC;

-- Actualizar los registros con el primer usuario activo de cada entidad
UPDATE cumplimiento_historial ch
SET usuario_responsable_id = (
    SELECT u.user_id
    FROM cumplimiento_normativo cn
    INNER JOIN usuarios u ON cn.entidad_id = u.entidad_id
    WHERE ch.cumplimiento_id = cn.cumplimiento_id
      AND u.activo = true
    ORDER BY u.created_at ASC
    LIMIT 1
)
WHERE ch.usuario_responsable_id = '00000000-0000-0000-0000-000000000000'
  AND EXISTS (
      SELECT 1
      FROM cumplimiento_normativo cn2
      INNER JOIN usuarios u2 ON cn2.entidad_id = u2.entidad_id
      WHERE ch.cumplimiento_id = cn2.cumplimiento_id
        AND u2.activo = true
  );

-- Verificar que no queden registros con Guid.Empty
SELECT COUNT(*) as registros_pendientes
FROM cumplimiento_historial
WHERE usuario_responsable_id = '00000000-0000-0000-0000-000000000000';

-- Si aún quedan registros (entidades sin usuarios), eliminarlos ya que no son válidos
DELETE FROM cumplimiento_historial
WHERE usuario_responsable_id = '00000000-0000-0000-0000-000000000000';

-- Confirmar la corrección
SELECT 
    'Registros corregidos' as resultado,
    COUNT(*) as total_registros
FROM cumplimiento_historial;
