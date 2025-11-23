-- =====================================================
-- Script: Limpiar registros de prueba de com1_liderg_td
-- Fecha: 2025-11-22
-- Descripción: Elimina todos los registros de prueba para comenzar limpio
-- =====================================================

BEGIN;

-- Eliminar todos los registros de la entidad de prueba
DELETE FROM public.com1_liderg_td 
WHERE entidad_id = '019aad0c-9c95-732a-bc1c-ea8e5200ef93';

COMMIT;

-- Verificar que se eliminaron
SELECT COUNT(*) as registros_restantes 
FROM public.com1_liderg_td 
WHERE entidad_id = '019aad0c-9c95-732a-bc1c-ea8e5200ef93';
