-- Script para insertar los alcances de cada compromiso en la tabla alcance_compromisos
-- Ejecutar después de insertar los compromisos y tener las clasificaciones

-- Obtener los IDs de las clasificaciones (ajustar según tu base de datos)
-- Asumo: 1=Nacional, 2=Regional, 3=Local, 4=Sectorial

-- Eliminar alcances existentes si los hay (opcional)
-- DELETE FROM alcance_compromisos WHERE compromiso_id BETWEEN 1 AND 21;

-- Compromisos 1-5: Todos los alcances (nacional, regional, local)
INSERT INTO alcance_compromisos (compromiso_id, clasificacion_id, activo, created_at)
SELECT c.compromiso_id, cl.clasificacion_id, true, CURRENT_TIMESTAMP
FROM compromiso_gobierno_digital c
CROSS JOIN clasificacion cl
WHERE c.compromiso_id IN (1, 2, 3, 4, 5, 9, 12, 13, 14, 15, 16, 17, 19, 21)
  AND cl.nombre IN ('Gobierno Nacional', 'Gobierno Regional', 'Gobierno Local')
ON CONFLICT (compromiso_id, clasificacion_id) DO NOTHING;

-- Compromisos 6-8, 10-11, 18, 20: Solo nacional, regional, local (todos igual que arriba)
INSERT INTO alcance_compromisos (compromiso_id, clasificacion_id, activo, created_at)
SELECT c.compromiso_id, cl.clasificacion_id, true, CURRENT_TIMESTAMP
FROM compromiso_gobierno_digital c
CROSS JOIN clasificacion cl
WHERE c.compromiso_id IN (6, 7, 8, 10, 11, 18, 20)
  AND cl.nombre IN ('Gobierno Nacional', 'Gobierno Regional', 'Gobierno Local')
ON CONFLICT (compromiso_id, clasificacion_id) DO NOTHING;

-- Verificar la inserción
SELECT 
    c.compromiso_id,
    c.nombre_compromiso,
    STRING_AGG(cl.nombre, ', ' ORDER BY cl.clasificacion_id) as alcances
FROM compromiso_gobierno_digital c
LEFT JOIN alcance_compromisos ac ON c.compromiso_id = ac.compromiso_id AND ac.activo = true
LEFT JOIN clasificacion cl ON ac.clasificacion_id = cl.clasificacion_id
WHERE c.compromiso_id BETWEEN 1 AND 21
GROUP BY c.compromiso_id, c.nombre_compromiso
ORDER BY c.compromiso_id;
