-- =============================================
-- VERIFICACIÓN: Confirmar que com2_cgtd tiene las columnas necesarias
-- DESCRIPCIÓN: Verifica la estructura de com2_cgtd en Supabase
-- FECHA: 2025-11-22
-- INSTRUCCIONES: Ejecutar en Supabase SQL Editor
-- =============================================

-- Verificar columnas de com2_cgtd
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'com2_cgtd'
ORDER BY ordinal_position;

-- Resultado esperado debe incluir:
-- entidad_id (uuid)
-- usuario_registra (uuid)
-- url_doc_pcm (text)
-- criterios_evaluados (jsonb)
