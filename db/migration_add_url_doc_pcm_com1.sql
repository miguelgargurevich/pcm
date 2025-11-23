-- =====================================================
-- Script: Agregar columna url_doc_pcm a com1_liderg_td
-- Fecha: 2025-11-22
-- Descripción: Agregar campo para almacenar la URL del documento
--              PDF subido en el paso 2
-- =====================================================

BEGIN;

-- Agregar columna url_doc_pcm
ALTER TABLE public.com1_liderg_td 
ADD COLUMN IF NOT EXISTS url_doc_pcm TEXT;

COMMENT ON COLUMN public.com1_liderg_td.url_doc_pcm IS 'URL del documento PDF normativo subido en Supabase Storage';

COMMIT;

-- Verificar el cambio
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'com1_liderg_td' 
  AND column_name = 'url_doc_pcm';
