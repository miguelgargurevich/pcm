-- =====================================================
-- Script: Agregar columna criterios_evaluados a com1_liderg_td
-- Fecha: 2025-11-22
-- Descripción: Agregar campo JSON para almacenar los criterios
--              que el usuario ha marcado como cumplidos
-- =====================================================

BEGIN;

-- Agregar columna criterios_evaluados como JSONB
ALTER TABLE public.com1_liderg_td 
ADD COLUMN IF NOT EXISTS criterios_evaluados JSONB;

COMMENT ON COLUMN public.com1_liderg_td.criterios_evaluados IS 'Array JSON de criterios marcados: [{"criterioId": 1, "cumple": true}]';

COMMIT;

-- Verificar el cambio
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'com1_liderg_td' 
  AND column_name = 'criterios_evaluados';
