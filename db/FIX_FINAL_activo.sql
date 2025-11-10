-- ================================================
-- FIX DEFINITIVO: Agregar columna activo
-- Ejecuta SOLO estas 3 líneas en Supabase
-- ================================================

ALTER TABLE public.marco_normativo ADD COLUMN activo BOOLEAN DEFAULT TRUE NOT NULL;

UPDATE public.marco_normativo SET activo = TRUE;

CREATE INDEX idx_marco_normativo_activo ON public.marco_normativo(activo);
