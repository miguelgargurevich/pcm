-- =====================================================
-- Insertar catálogos de ROLES en tabla_tablas
-- =====================================================
-- Fecha: 2025-11-23
-- Descripción: Agregar opciones de roles para funcionarios
--              y roles de comité en tabla_tablas
-- =====================================================

BEGIN;

-- =====================================================
-- ROLES DE FUNCIONARIOS (para Paso 1 de compromisos)
-- =====================================================
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo)
VALUES
  ('ROL_FUNCIONARIO', '1', 'Funcionario público de carrera', 'Funcionario', 1, true),
  ('ROL_FUNCIONARIO', '2', 'Personal contratado bajo modalidad CAS', 'Contratado', 2, true),
  ('ROL_FUNCIONARIO', '3', 'Personal designado por autoridad', 'Designado', 3, true),
  ('ROL_FUNCIONARIO', '4', 'Personal encargado temporalmente', 'Encargado', 4, true);

-- =====================================================
-- ROLES DE COMITÉ (para miembros del Comité GTD)
-- =====================================================
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo)
VALUES
  ('ROL_COMITE', '1', 'Presidente del comité', 'Presidente', 1, true),
  ('ROL_COMITE', '2', 'Vicepresidente del comité', 'Vicepresidente', 2, true),
  ('ROL_COMITE', '3', 'Secretario técnico del comité', 'Secretario Técnico', 3, true),
  ('ROL_COMITE', '4', 'Miembro del comité', 'Miembro', 4, true);

COMMIT;

-- Verificar inserción
SELECT 
  nombre_tabla,
  columna_id,
  valor,
  descripcion,
  orden
FROM tabla_tablas
WHERE nombre_tabla IN ('ROL_FUNCIONARIO', 'ROL_COMITE')
ORDER BY nombre_tabla, orden;
