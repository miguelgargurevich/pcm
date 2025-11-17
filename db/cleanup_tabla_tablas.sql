-- ====================================
-- LIMPIAR tabla_tablas - Dejar solo ALCANCES
-- ====================================

-- Eliminar datos duplicados de catálogos que tienen tablas dedicadas
DELETE FROM tabla_tablas 
WHERE nombre_tabla IN ('TIPO_NORMA', 'NIVEL_GOBIERNO', 'SECTOR');

-- Verificar contenido final
SELECT '=== CONTENIDO DE tabla_tablas ===' as resultado;
SELECT nombre_tabla, COUNT(*) as cantidad
FROM tabla_tablas
GROUP BY nombre_tabla
ORDER BY nombre_tabla;

-- Mostrar detalle de ALCANCES
SELECT '=== ALCANCES EN tabla_tablas ===' as resultado;
SELECT tabla_id, nombre_tabla, columna_id, descripcion, valor, orden
FROM tabla_tablas
WHERE nombre_tabla = 'ALCANCE'
ORDER BY orden;
