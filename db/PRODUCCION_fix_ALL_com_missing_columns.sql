-- =====================================================
-- SCRIPT COMPLETO: Agregar columnas faltantes a todas las tablas com4-com21
-- Ejecutar en Supabase SQL Editor
-- Fecha: 2024-12-05
-- =====================================================

-- =====================================================
-- COM4_TDPEI - Incorporar TD en el PEI
-- =====================================================
ALTER TABLE com4_tdpei 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM5_DESTRATEGIAD - Estrategia Digital
-- =====================================================
ALTER TABLE com5_destrategiad 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM6_MIGRACIONGOBPE - Migración a Gob.pe
-- =====================================================
ALTER TABLE com6_migraciongobpe 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM7_IMPD - Implementación MPD
-- =====================================================
ALTER TABLE com7_impd 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM8_PTUPA - Publicación TUPA
-- =====================================================
ALTER TABLE com8_ptupa 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM9_AMGD - Modelo Gestión Documental
-- =====================================================
ALTER TABLE com9_amgd 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM10_PDA - Datos Abiertos
-- =====================================================
ALTER TABLE com10_pda 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM11_AGEOPERU - Aportación GeoPeru
-- =====================================================
ALTER TABLE com11_ageoperu 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM12_DRSP - Responsable Software Público
-- =====================================================
ALTER TABLE com12_drsp 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM13_PCPIDE - Interoperabilidad PIDE
-- =====================================================
ALTER TABLE com13_pcpide 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500),
ADD COLUMN IF NOT EXISTS fecha_integracion_pide DATE,
ADD COLUMN IF NOT EXISTS servicios_publicados_pide INTEGER,
ADD COLUMN IF NOT EXISTS servicios_consumidos_pide INTEGER,
ADD COLUMN IF NOT EXISTS total_transacciones_pide BIGINT,
ADD COLUMN IF NOT EXISTS enlace_portal_pide VARCHAR(255),
ADD COLUMN IF NOT EXISTS integrado_pide BOOLEAN;

-- =====================================================
-- COM14_DOSCD - Oficial Seguridad Digital
-- =====================================================
ALTER TABLE com14_doscd 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM15_CSIRT - CSIRT Institucional
-- =====================================================
ALTER TABLE com15_csirt 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM16_ASGSI - Sistema Gestión Seguridad
-- =====================================================
ALTER TABLE com16_asgsi 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM17_PTIPv6 - Plan Transición IPv6
-- =====================================================
ALTER TABLE com17_ptipv6 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM18_APTEC - Acceso Portal Transparencia
-- =====================================================
ALTER TABLE com18_aptec 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM19_PENGE - Encuesta Nacional Gob Digital
-- =====================================================
ALTER TABLE com19_penge 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM20_DSFACILITA - Digitalización Servicios Facilita
-- =====================================================
ALTER TABLE com20_dsfacilita 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- COM21_DOGD - Oficial Gobierno de Datos
-- =====================================================
ALTER TABLE com21_dogd 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(500);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT 'com13_pcpide' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'com13_pcpide' 
AND column_name IN ('rutaPDF_normativa', 'fecha_integracion_pide', 'servicios_publicados_pide', 
                    'servicios_consumidos_pide', 'total_transacciones_pide', 'enlace_portal_pide', 'integrado_pide')
ORDER BY column_name;
