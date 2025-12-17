-- Script para aumentar el límite de las columnas de numeración de 5 a 20 caracteres
-- Fecha: 2025-12-17
-- Problema: Valores como "OE-01.A" (7 chars) exceden el límite de varchar(5)

-- 1. Aumentar numeracion_obj en objetivos_entidades
ALTER TABLE objetivos_entidades 
ALTER COLUMN numeracion_obj TYPE varchar(20);

-- 2. Aumentar numeracion_acc en acciones_objetivos_entidades
ALTER TABLE acciones_objetivos_entidades 
ALTER COLUMN numeracion_acc TYPE varchar(20);

-- 3. Aumentar numeracion_proy en proyectos_entidades
ALTER TABLE proyectos_entidades 
ALTER COLUMN numeracion_proy TYPE varchar(20);

-- Verificación
SELECT 
    'objetivos_entidades' as tabla,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'objetivos_entidades' AND column_name = 'numeracion_obj'
UNION ALL
SELECT 
    'acciones_objetivos_entidades',
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'acciones_objetivos_entidades' AND column_name = 'numeracion_acc'
UNION ALL
SELECT 
    'proyectos_entidades',
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'proyectos_entidades' AND column_name = 'numeracion_proy';
