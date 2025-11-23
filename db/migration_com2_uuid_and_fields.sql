-- =============================================
-- MIGRACIÓN: Actualizar com2_cgtd para usar UUID y agregar campos
-- DESCRIPCIÓN: 
--   1. Cambiar entidad_id y usuario_registra de BIGINT a UUID
--   2. Agregar url_doc_pcm TEXT
--   3. Agregar criterios_evaluados JSONB
-- FECHA: 2025-11-22
-- =============================================

BEGIN;

-- 1. Cambiar entidad_id de BIGINT a UUID
ALTER TABLE com2_cgtd 
  ALTER COLUMN entidad_id TYPE UUID USING entidad_id::TEXT::UUID;

-- 2. Cambiar usuario_registra de BIGINT a UUID
ALTER TABLE com2_cgtd 
  ALTER COLUMN usuario_registra TYPE UUID USING usuario_registra::TEXT::UUID;

-- 3. Agregar url_doc_pcm para almacenar URL del PDF en Supabase
ALTER TABLE com2_cgtd 
  ADD COLUMN IF NOT EXISTS url_doc_pcm TEXT;

-- 4. Agregar criterios_evaluados para almacenar criterios marcados en JSON
ALTER TABLE com2_cgtd 
  ADD COLUMN IF NOT EXISTS criterios_evaluados JSONB;

COMMIT;

-- Verificar cambios
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'com2_cgtd'
ORDER BY ordinal_position;
