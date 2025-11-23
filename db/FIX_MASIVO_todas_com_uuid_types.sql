-- =====================================================
-- MIGRACION MASIVA: Corregir tipos BIGINT a UUID 
-- en todas las tablas com* de Supabase
-- =====================================================
-- Autor: Sistema
-- Fecha: 2025-11-23
-- Descripción: Cambiar entidad_id y usuario_registra 
--              de BIGINT a UUID y agregar FK constraints
-- =====================================================

BEGIN;

-- =====================================================
-- COM2_CGTD - Solo agregar FK constraints (ya tiene UUID)
-- =====================================================
ALTER TABLE com2_cgtd
  ADD CONSTRAINT fk_com2_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com2_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

COMMENT ON CONSTRAINT fk_com2_entidad ON com2_cgtd IS 'FK a entidades';
COMMENT ON CONSTRAINT fk_com2_usuario ON com2_cgtd IS 'FK a usuarios';

-- =====================================================
-- COM3_EPGD - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com3_epgd
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com3_epgd
  ADD CONSTRAINT fk_com3_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com3_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM6_MPGOBPE - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com6_mpgobpe
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com6_mpgobpe
  ADD CONSTRAINT fk_com6_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com6_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM7_IMPD - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com7_impd
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com7_impd
  ADD CONSTRAINT fk_com7_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com7_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM8_PTUPA - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com8_ptupa
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com8_ptupa
  ADD CONSTRAINT fk_com8_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com8_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM9_IMGD - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com9_imgd
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com9_imgd
  ADD CONSTRAINT fk_com9_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com9_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM10_PNDA - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com10_pnda
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com10_pnda
  ADD CONSTRAINT fk_com10_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com10_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM11_AGEOP - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com11_ageop
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com11_ageop
  ADD CONSTRAINT fk_com11_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com11_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM12_DRSP - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com12_drsp
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com12_drsp
  ADD CONSTRAINT fk_com12_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com12_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM13_PCPIDE - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com13_pcpide
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com13_pcpide
  ADD CONSTRAINT fk_com13_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com13_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM14_DOSCD - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com14_doscd
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com14_doscd
  ADD CONSTRAINT fk_com14_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com14_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM15_CSIRT - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com15_csirt
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com15_csirt
  ADD CONSTRAINT fk_com15_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com15_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM16_SGSI - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com16_sgsi
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com16_sgsi
  ADD CONSTRAINT fk_com16_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com16_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM17_PTIPV6 - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com17_ptipv6
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com17_ptipv6
  ADD CONSTRAINT fk_com17_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com17_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM18_SAPTE - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com18_sapte
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com18_sapte
  ADD CONSTRAINT fk_com18_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com18_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM19_RENAD - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com19_renad
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com19_renad
  ADD CONSTRAINT fk_com19_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com19_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM20_DSFPE - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com20_dsfpe
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com20_dsfpe
  ADD CONSTRAINT fk_com20_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com20_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

-- =====================================================
-- COM21_DOGD - Cambiar tipos y agregar FK
-- =====================================================
ALTER TABLE com21_dogd
  ALTER COLUMN entidad_id TYPE uuid USING entidad_id::text::uuid,
  ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;

ALTER TABLE com21_dogd
  ADD CONSTRAINT fk_com21_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
  ADD CONSTRAINT fk_com21_usuario 
    FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id);

COMMIT;

-- =====================================================
-- Verificación de cambios
-- =====================================================
SELECT 
    'com2_cgtd' as tabla,
    pg_typeof(entidad_id) as tipo_entidad_id,
    pg_typeof(usuario_registra) as tipo_usuario_registra
FROM com2_cgtd LIMIT 1;

SELECT 
    'com3_epgd' as tabla,
    pg_typeof(entidad_id) as tipo_entidad_id,
    pg_typeof(usuario_registra) as tipo_usuario_registra
FROM com3_epgd LIMIT 1;

-- Verificar FK constraints creados
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints AS tc 
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema='public'
  AND tc.table_name LIKE 'com%'
ORDER BY tc.table_name, tc.constraint_name;
