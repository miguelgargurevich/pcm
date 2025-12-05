-- Script para agregar columnas faltantes en com13_pcpide
-- Ejecutar en Supabase SQL Editor
-- Fecha: 2024-12-05

-- Verificar estructura actual
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'com13_pcpide' 
ORDER BY ordinal_position;

-- Agregar columnas faltantes a com13_pcpide
ALTER TABLE com13_pcpide 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500),
ADD COLUMN IF NOT EXISTS fecha_integracion_pide DATE,
ADD COLUMN IF NOT EXISTS servicios_publicados_pide INTEGER,
ADD COLUMN IF NOT EXISTS servicios_consumidos_pide INTEGER,
ADD COLUMN IF NOT EXISTS total_transacciones_pide BIGINT,
ADD COLUMN IF NOT EXISTS enlace_portal_pide VARCHAR(255),
ADD COLUMN IF NOT EXISTS integrado_pide BOOLEAN;

-- Verificar que las columnas se agregaron
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'com13_pcpide' 
ORDER BY ordinal_position;
