-- ====================================================================
-- FIX MASIVO: Agregar secuencias a TODAS las tablas de Compromiso 3
-- ====================================================================
-- PROBLEMA: Ninguna tabla relacionada con Com3 tiene auto-increment
-- SOLUCIÓN: Crear secuencias para todas las PKs
-- ====================================================================

-- 1. PERSONAL_TI
CREATE SEQUENCE IF NOT EXISTS personal_ti_personal_id_seq;
SELECT setval('personal_ti_personal_id_seq', COALESCE((SELECT MAX(personal_id) FROM personal_ti), 0) + 1, false);
ALTER TABLE personal_ti ALTER COLUMN personal_id SET DEFAULT nextval('personal_ti_personal_id_seq');
ALTER SEQUENCE personal_ti_personal_id_seq OWNED BY personal_ti.personal_id;

-- 2. INVENTARIO_SOFTWARE
CREATE SEQUENCE IF NOT EXISTS inventario_software_inv_soft_id_seq;
SELECT setval('inventario_software_inv_soft_id_seq', COALESCE((SELECT MAX(inv_soft_id) FROM inventario_software), 0) + 1, false);
ALTER TABLE inventario_software ALTER COLUMN inv_soft_id SET DEFAULT nextval('inventario_software_inv_soft_id_seq');
ALTER SEQUENCE inventario_software_inv_soft_id_seq OWNED BY inventario_software.inv_soft_id;

-- 3. INVENTARIO_SISTEMAS_INFO
CREATE SEQUENCE IF NOT EXISTS inventario_sistemas_info_inv_si_id_seq;
SELECT setval('inventario_sistemas_info_inv_si_id_seq', COALESCE((SELECT MAX(inv_si_id) FROM inventario_sistemas_info), 0) + 1, false);
ALTER TABLE inventario_sistemas_info ALTER COLUMN inv_si_id SET DEFAULT nextval('inventario_sistemas_info_inv_si_id_seq');
ALTER SEQUENCE inventario_sistemas_info_inv_si_id_seq OWNED BY inventario_sistemas_info.inv_si_id;

-- 4. INVENTARIO_RED
CREATE SEQUENCE IF NOT EXISTS inventario_red_inv_red_id_seq;
SELECT setval('inventario_red_inv_red_id_seq', COALESCE((SELECT MAX(inv_red_id) FROM inventario_red), 0) + 1, false);
ALTER TABLE inventario_red ALTER COLUMN inv_red_id SET DEFAULT nextval('inventario_red_inv_red_id_seq');
ALTER SEQUENCE inventario_red_inv_red_id_seq OWNED BY inventario_red.inv_red_id;

-- 5. INVENTARIO_SERVIDORES
CREATE SEQUENCE IF NOT EXISTS inventario_servidores_inv_srv_id_seq;
SELECT setval('inventario_servidores_inv_srv_id_seq', COALESCE((SELECT MAX(inv_srv_id) FROM inventario_servidores), 0) + 1, false);
ALTER TABLE inventario_servidores ALTER COLUMN inv_srv_id SET DEFAULT nextval('inventario_servidores_inv_srv_id_seq');
ALTER SEQUENCE inventario_servidores_inv_srv_id_seq OWNED BY inventario_servidores.inv_srv_id;

-- 6. OBJETIVOS_ENTIDADES
CREATE SEQUENCE IF NOT EXISTS objetivos_entidades_obj_ent_id_seq;
SELECT setval('objetivos_entidades_obj_ent_id_seq', COALESCE((SELECT MAX(obj_ent_id) FROM objetivos_entidades), 0) + 1, false);
ALTER TABLE objetivos_entidades ALTER COLUMN obj_ent_id SET DEFAULT nextval('objetivos_entidades_obj_ent_id_seq');
ALTER SEQUENCE objetivos_entidades_obj_ent_id_seq OWNED BY objetivos_entidades.obj_ent_id;

-- 7. PROYECTOS_ENTIDADES
CREATE SEQUENCE IF NOT EXISTS proyectos_entidades_proy_ent_id_seq;
SELECT setval('proyectos_entidades_proy_ent_id_seq', COALESCE((SELECT MAX(proy_ent_id) FROM proyectos_entidades), 0) + 1, false);
ALTER TABLE proyectos_entidades ALTER COLUMN proy_ent_id SET DEFAULT nextval('proyectos_entidades_proy_ent_id_seq');
ALTER SEQUENCE proyectos_entidades_proy_ent_id_seq OWNED BY proyectos_entidades.proy_ent_id;

-- 8. SEGURIDAD_INFO
CREATE SEQUENCE IF NOT EXISTS seguridad_info_seginfo_id_seq;
SELECT setval('seguridad_info_seginfo_id_seq', COALESCE((SELECT MAX(seginfo_id) FROM seguridad_info), 0) + 1, false);
ALTER TABLE seguridad_info ALTER COLUMN seginfo_id SET DEFAULT nextval('seguridad_info_seginfo_id_seq');
ALTER SEQUENCE seguridad_info_seginfo_id_seq OWNED BY seguridad_info.seginfo_id;

-- 9. CAPACITACIONES_SEGINFO
CREATE SEQUENCE IF NOT EXISTS capacitaciones_seginfo_capseg_id_seq;
SELECT setval('capacitaciones_seginfo_capseg_id_seq', COALESCE((SELECT MAX(capseg_id) FROM capacitaciones_seginfo), 0) + 1, false);
ALTER TABLE capacitaciones_seginfo ALTER COLUMN capseg_id SET DEFAULT nextval('capacitaciones_seginfo_capseg_id_seq');
ALTER SEQUENCE capacitaciones_seginfo_capseg_id_seq OWNED BY capacitaciones_seginfo.capseg_id;

-- 10. ACCIONES_OBJETIVOS (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'acciones_objetivos') THEN
        CREATE SEQUENCE IF NOT EXISTS acciones_objetivos_accion_id_seq;
        PERFORM setval('acciones_objetivos_accion_id_seq', COALESCE((SELECT MAX(accion_id) FROM acciones_objetivos), 0) + 1, false);
        ALTER TABLE acciones_objetivos ALTER COLUMN accion_id SET DEFAULT nextval('acciones_objetivos_accion_id_seq');
        ALTER SEQUENCE acciones_objetivos_accion_id_seq OWNED BY acciones_objetivos.accion_id;
        RAISE NOTICE 'Secuencia creada para acciones_objetivos';
    END IF;
END $$;

-- ====================================================================
-- VERIFICACIÓN FINAL
-- ====================================================================
SELECT 
    t.table_name,
    c.column_name,
    c.column_default,
    CASE 
        WHEN c.column_default IS NOT NULL AND c.column_default LIKE 'nextval%' THEN '✅ OK'
        ELSE '❌ FALTA'
    END as estado
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
  AND t.table_name IN (
    'com3_epgd',
    'personal_ti', 
    'inventario_software', 
    'inventario_sistemas_info', 
    'inventario_red', 
    'inventario_servidores',
    'objetivos_entidades',
    'proyectos_entidades',
    'seguridad_info',
    'capacitaciones_seginfo'
  )
  AND c.ordinal_position = 1
ORDER BY t.table_name;
