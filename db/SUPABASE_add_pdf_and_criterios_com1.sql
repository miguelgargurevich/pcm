-- =====================================================
-- Script: Agregar columnas url_doc_pcm y criterios_evaluados a com1_liderg_td
-- Fecha: 2025-11-22
-- Descripción: Migración para Supabase
--              Agrega campos necesarios para persistir PDF y criterios evaluados
-- =====================================================

BEGIN;

-- Agregar columna url_doc_pcm
ALTER TABLE public.com1_liderg_td 
ADD COLUMN IF NOT EXISTS url_doc_pcm TEXT;

COMMENT ON COLUMN public.com1_liderg_td.url_doc_pcm IS 'URL del documento PDF normativo subido en Supabase Storage';

-- Agregar columna criterios_evaluados como JSONB
ALTER TABLE public.com1_liderg_td 
ADD COLUMN IF NOT EXISTS criterios_evaluados JSONB;

COMMENT ON COLUMN public.com1_liderg_td.criterios_evaluados IS 'Array JSON de criterios marcados: [{"criterioId": 1, "cumple": true}]';

COMMIT;

-- Verificar los cambios
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'com1_liderg_td' 
AND column_name IN ('url_doc_pcm', 'criterios_evaluados')
ORDER BY ordinal_position;
