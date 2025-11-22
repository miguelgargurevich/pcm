-- ====================================
-- PRODUCCIÓN: Limpiar duplicados en tabla_tablas
-- Ejecutar en: Supabase SQL Editor ANTES del seed de compromisos
-- ====================================

-- Eliminar todos los registros de ALCANCE
DELETE FROM tabla_tablas WHERE nombre_tabla = 'ALCANCE';

-- Insertar ALCANCES correctos (sin duplicados)
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo) VALUES
('ALCANCE', '1', 'Nacional', 'nacional', 1, true),
('ALCANCE', '2', 'Regional', 'regional', 2, true),
('ALCANCE', '3', 'Local', 'local', 3, true),
('ALCANCE', '4', 'Sectorial', 'sectorial', 4, true);

-- Verificación
SELECT 'ALCANCES LIMPIOS:' as resultado, tabla_id, descripcion as nombre, valor, orden
FROM tabla_tablas
WHERE nombre_tabla = 'ALCANCE'
ORDER BY orden;

-- Contar registros
SELECT COUNT(*) as total_alcances FROM tabla_tablas WHERE nombre_tabla = 'ALCANCE';
