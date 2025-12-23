-- Verificar si existen los compromisos 8 y 9 para la entidad específica
-- EntidadId: 019a99c9-7bd1-7525-b01d-a5a7379ba9fa

-- 1. Ver TODOS los registros de cumplimiento normativo para esta entidad
SELECT 
    cn.cumplimiento_id,
    cn.entidad_id,
    cn.compromiso_id,
    cn.estado_id,
    cgd.nombre_compromiso,
    e.nombre as entidad_nombre
FROM cumplimiento_normativo cn
LEFT JOIN compromiso_gobierno_digital cgd ON cn.compromiso_id = cgd.compromiso_id
LEFT JOIN entidades e ON cn.entidad_id = e.entidad_id
WHERE cn.entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
ORDER BY cn.compromiso_id;

-- 2. Verificar específicamente los compromisos 8 y 9
SELECT 
    cn.cumplimiento_id,
    cn.entidad_id,
    cn.compromiso_id,
    cn.estado_id,
    cgd.nombre_compromiso,
    CASE cn.estado_id
        WHEN 1 THEN 'PENDIENTE'
        WHEN 2 THEN 'SIN REPORTAR'
        WHEN 3 THEN 'NO EXIGIBLE'
        WHEN 4 THEN 'EN PROCESO'
        WHEN 5 THEN 'ENVIADO'
        WHEN 6 THEN 'EN REVISIÓN'
        WHEN 7 THEN 'OBSERVADO'
        WHEN 8 THEN 'ACEPTADO'
        ELSE 'DESCONOCIDO'
    END as estado_nombre
FROM cumplimiento_normativo cn
LEFT JOIN compromiso_gobierno_digital cgd ON cn.compromiso_id = cgd.compromiso_id
WHERE cn.entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
AND cn.compromiso_id IN (8, 9);

-- 3. Ver cuántos compromisos tiene esta entidad por compromiso_id
SELECT 
    compromiso_id,
    COUNT(*) as total
FROM cumplimiento_normativo
WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
GROUP BY compromiso_id
ORDER BY compromiso_id;

-- 4. Verificar si los compromisos 8 y 9 existen en la tabla de compromisos
SELECT 
    compromiso_id,
    nombre_compromiso,
    activo
FROM compromiso_gobierno_digital
WHERE compromiso_id IN (8, 9);
