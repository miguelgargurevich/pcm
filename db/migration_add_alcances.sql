-- ====================================
-- MIGRATION: Agregar ALCANCES a tabla_tablas
-- ====================================

-- Insertar ALCANCES en tabla_tablas
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo) VALUES
('ALCANCE', '1', 'Nacional', 'nacional', 1, true),
('ALCANCE', '2', 'Regional', 'regional', 2, true),
('ALCANCE', '3', 'Local', 'local', 3, true),
('ALCANCE', '4', 'Sectorial', 'sectorial', 4, true)
ON CONFLICT DO NOTHING;

-- Verificar inserción
SELECT '=== ALCANCES INSERTADOS ===' as resultado;
SELECT tabla_id, nombre_tabla, columna_id, descripcion, valor, orden
FROM tabla_tablas
WHERE nombre_tabla = 'ALCANCE'
ORDER BY orden;
