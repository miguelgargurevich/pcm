-- ============================================
-- Script de Verificación: Criterios Guardados
-- ============================================
-- Verificar si hay criterios guardados en cumplimiento_normativo

-- 1. Ver todos los registros de cumplimiento_normativo con criterios
SELECT 
    cumplimiento_id,
    compromiso_id,
    entidad_id,
    criterios_evaluados,
    documento_url,
    etapa_formulario,
    estado,
    created_at,
    updated_at
FROM cumplimiento_normativo
WHERE criterios_evaluados IS NOT NULL 
  AND criterios_evaluados != '[]'::jsonb
  AND criterios_evaluados != '{}'::jsonb
ORDER BY compromiso_id, entidad_id;

-- 2. Ver específicamente el compromiso 1
SELECT 
    cumplimiento_id,
    compromiso_id,
    entidad_id,
    criterios_evaluados,
    CASE 
        WHEN criterios_evaluados IS NULL THEN 'NULL'
        WHEN criterios_evaluados::text = '[]' THEN 'ARRAY VACÍO'
        WHEN criterios_evaluados::text = '{}' THEN 'OBJETO VACÍO'
        ELSE 'CON DATOS: ' || criterios_evaluados::text
    END as estado_criterios,
    documento_url,
    etapa_formulario,
    estado
FROM cumplimiento_normativo
WHERE compromiso_id = 1
ORDER BY entidad_id;

-- 3. Ver la estructura de los criterios (si existen)
SELECT 
    cumplimiento_id,
    compromiso_id,
    jsonb_pretty(criterios_evaluados) as criterios_formateados
FROM cumplimiento_normativo
WHERE criterios_evaluados IS NOT NULL 
  AND criterios_evaluados != '[]'::jsonb
LIMIT 5;

-- 4. Ver los criterios disponibles para el compromiso 1
SELECT 
    criterio_evaluacion_id,
    compromiso_id,
    descripcion,
    activo,
    created_at
FROM criterio_evaluacion
WHERE compromiso_id = 1
  AND activo = true
ORDER BY criterio_evaluacion_id;
