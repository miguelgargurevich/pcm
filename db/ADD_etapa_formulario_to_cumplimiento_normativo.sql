-- =============================================
-- Script: ADD_etapa_formulario_to_cumplimiento_normativo.sql
-- Descripción: Agregar columna etapa_formulario a la tabla cumplimiento_normativo
-- Fecha: 2024
-- =============================================

BEGIN;

-- Agregar columna etapa_formulario
ALTER TABLE cumplimiento_normativo 
ADD COLUMN IF NOT EXISTS etapa_formulario VARCHAR(20) DEFAULT 'paso1';

-- Agregar comentario descriptivo
COMMENT ON COLUMN cumplimiento_normativo.etapa_formulario IS 'Etapa actual del formulario: paso1, paso2, paso3, completado';

-- Verificar la estructura actualizada
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'cumplimiento_normativo'
    AND column_name = 'etapa_formulario';

COMMIT;

-- =============================================
-- Resultado esperado:
-- ✓ Columna etapa_formulario agregada a cumplimiento_normativo
-- ✓ Tipo: VARCHAR(20)
-- ✓ Default: 'paso1'
-- =============================================
