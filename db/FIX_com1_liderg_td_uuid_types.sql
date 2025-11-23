-- =====================================================
-- Script: Homologar tipos de datos en com1_liderg_td
-- Fecha: 2025-11-22
-- Descripción: Cambiar entidad_id y usuario_registra de bigint a UUID
--              y agregar foreign keys correctas
-- =====================================================

BEGIN;

-- 1. Cambiar entidad_id de bigint a UUID
ALTER TABLE public.com1_liderg_td 
ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid;

-- 2. Cambiar usuario_registra de bigint a UUID
ALTER TABLE public.com1_liderg_td 
ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

-- 3. Agregar foreign key a entidades (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'com1_liderg_td_fk2'
    ) THEN
        ALTER TABLE public.com1_liderg_td
        ADD CONSTRAINT com1_liderg_td_fk2 
        FOREIGN KEY (entidad_id) REFERENCES public.entidades(entidad_id);
    END IF;
END $$;

-- 4. Agregar foreign key a usuarios (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'com1_liderg_td_fk3'
    ) THEN
        ALTER TABLE public.com1_liderg_td
        ADD CONSTRAINT com1_liderg_td_fk3
        FOREIGN KEY (usuario_registra) REFERENCES public.usuarios(user_id);
    END IF;
END $$;

COMMIT;

-- Verificar los cambios
SELECT 
    column_name, 
    data_type, 
    udt_name 
FROM information_schema.columns 
WHERE table_name = 'com1_liderg_td' 
  AND column_name IN ('entidad_id', 'usuario_registra')
ORDER BY column_name;

-- Verificar foreign keys
SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    confrelid::regclass AS referenced_table
FROM pg_constraint 
WHERE conname LIKE 'com1_liderg_td_fk%'
ORDER BY conname;
