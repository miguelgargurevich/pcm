-- ============================================================
-- SCRIPT: Agregar autoincremento a tablas COM1-COM21
-- Fecha: 2025-12-19
-- Descripción: Crea secuencias y configura DEFAULT para PKs
-- ============================================================

-- ============================================================
-- COM1: com1_liderg_td - comlgtd_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com1_liderg_td_comlgtd_ent_id_seq') THEN
        CREATE SEQUENCE com1_liderg_td_comlgtd_ent_id_seq;
        PERFORM setval('com1_liderg_td_comlgtd_ent_id_seq', COALESCE((SELECT MAX(comlgtd_ent_id) FROM com1_liderg_td), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com1_liderg_td 
ALTER COLUMN comlgtd_ent_id SET DEFAULT nextval('com1_liderg_td_comlgtd_ent_id_seq');

ALTER SEQUENCE com1_liderg_td_comlgtd_ent_id_seq OWNED BY com1_liderg_td.comlgtd_ent_id;

-- ============================================================
-- COM2: com2_cgtd - comcgtd_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com2_cgtd_comcgtd_ent_id_seq') THEN
        CREATE SEQUENCE com2_cgtd_comcgtd_ent_id_seq;
        PERFORM setval('com2_cgtd_comcgtd_ent_id_seq', COALESCE((SELECT MAX(comcgtd_ent_id) FROM com2_cgtd), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com2_cgtd 
ALTER COLUMN comcgtd_ent_id SET DEFAULT nextval('com2_cgtd_comcgtd_ent_id_seq');

ALTER SEQUENCE com2_cgtd_comcgtd_ent_id_seq OWNED BY com2_cgtd.comcgtd_ent_id;

-- ============================================================
-- COM3: com3_epgd - comepgd_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com3_epgd_comepgd_ent_id_seq') THEN
        CREATE SEQUENCE com3_epgd_comepgd_ent_id_seq;
        PERFORM setval('com3_epgd_comepgd_ent_id_seq', COALESCE((SELECT MAX(comepgd_ent_id) FROM com3_epgd), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com3_epgd 
ALTER COLUMN comepgd_ent_id SET DEFAULT nextval('com3_epgd_comepgd_ent_id_seq');

ALTER SEQUENCE com3_epgd_comepgd_ent_id_seq OWNED BY com3_epgd.comepgd_ent_id;

-- ============================================================
-- COM4: com4_tdpei - comtdpei_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com4_tdpei_comtdpei_ent_id_seq') THEN
        CREATE SEQUENCE com4_tdpei_comtdpei_ent_id_seq;
        PERFORM setval('com4_tdpei_comtdpei_ent_id_seq', COALESCE((SELECT MAX(comtdpei_ent_id) FROM com4_tdpei), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com4_tdpei 
ALTER COLUMN comtdpei_ent_id SET DEFAULT nextval('com4_tdpei_comtdpei_ent_id_seq');

ALTER SEQUENCE com4_tdpei_comtdpei_ent_id_seq OWNED BY com4_tdpei.comtdpei_ent_id;

-- ============================================================
-- COM5: com5_destrategiad - comded_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com5_destrategiad_comded_ent_id_seq') THEN
        CREATE SEQUENCE com5_destrategiad_comded_ent_id_seq;
        PERFORM setval('com5_destrategiad_comded_ent_id_seq', COALESCE((SELECT MAX(comded_ent_id) FROM com5_destrategiad), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com5_destrategiad 
ALTER COLUMN comded_ent_id SET DEFAULT nextval('com5_destrategiad_comded_ent_id_seq');

ALTER SEQUENCE com5_destrategiad_comded_ent_id_seq OWNED BY com5_destrategiad.comded_ent_id;

-- ============================================================
-- COM6: com6_mpgobpe - commpgobpe_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com6_mpgobpe_commpgobpe_ent_id_seq') THEN
        CREATE SEQUENCE com6_mpgobpe_commpgobpe_ent_id_seq;
        PERFORM setval('com6_mpgobpe_commpgobpe_ent_id_seq', COALESCE((SELECT MAX(commpgobpe_ent_id) FROM com6_mpgobpe), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com6_mpgobpe 
ALTER COLUMN commpgobpe_ent_id SET DEFAULT nextval('com6_mpgobpe_commpgobpe_ent_id_seq');

ALTER SEQUENCE com6_mpgobpe_commpgobpe_ent_id_seq OWNED BY com6_mpgobpe.commpgobpe_ent_id;

-- ============================================================
-- COM7: com7_impd - comimpd_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com7_impd_comimpd_ent_id_seq') THEN
        CREATE SEQUENCE com7_impd_comimpd_ent_id_seq;
        PERFORM setval('com7_impd_comimpd_ent_id_seq', COALESCE((SELECT MAX(comimpd_ent_id) FROM com7_impd), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com7_impd 
ALTER COLUMN comimpd_ent_id SET DEFAULT nextval('com7_impd_comimpd_ent_id_seq');

ALTER SEQUENCE com7_impd_comimpd_ent_id_seq OWNED BY com7_impd.comimpd_ent_id;

-- ============================================================
-- COM8: com8_ptupa - comptupa_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com8_ptupa_comptupa_ent_id_seq') THEN
        CREATE SEQUENCE com8_ptupa_comptupa_ent_id_seq;
        PERFORM setval('com8_ptupa_comptupa_ent_id_seq', COALESCE((SELECT MAX(comptupa_ent_id) FROM com8_ptupa), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com8_ptupa 
ALTER COLUMN comptupa_ent_id SET DEFAULT nextval('com8_ptupa_comptupa_ent_id_seq');

ALTER SEQUENCE com8_ptupa_comptupa_ent_id_seq OWNED BY com8_ptupa.comptupa_ent_id;

-- ============================================================
-- COM9: com9_imgd - comimgd_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com9_imgd_comimgd_ent_id_seq') THEN
        CREATE SEQUENCE com9_imgd_comimgd_ent_id_seq;
        PERFORM setval('com9_imgd_comimgd_ent_id_seq', COALESCE((SELECT MAX(comimgd_ent_id) FROM com9_imgd), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com9_imgd 
ALTER COLUMN comimgd_ent_id SET DEFAULT nextval('com9_imgd_comimgd_ent_id_seq');

ALTER SEQUENCE com9_imgd_comimgd_ent_id_seq OWNED BY com9_imgd.comimgd_ent_id;

-- ============================================================
-- COM10: com10_pnda - compnda_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com10_pnda_compnda_ent_id_seq') THEN
        CREATE SEQUENCE com10_pnda_compnda_ent_id_seq;
        PERFORM setval('com10_pnda_compnda_ent_id_seq', COALESCE((SELECT MAX(compnda_ent_id) FROM com10_pnda), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com10_pnda 
ALTER COLUMN compnda_ent_id SET DEFAULT nextval('com10_pnda_compnda_ent_id_seq');

ALTER SEQUENCE com10_pnda_compnda_ent_id_seq OWNED BY com10_pnda.compnda_ent_id;

-- ============================================================
-- COM11: com11_ageop - comageop_ent_id
-- ============================================================
DO $$
BEGIN
    -- Crear secuencia si no existe
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com11_ageop_comageop_ent_id_seq') THEN
        CREATE SEQUENCE com11_ageop_comageop_ent_id_seq;
        -- Obtener el máximo valor actual y ajustar la secuencia
        PERFORM setval('com11_ageop_comageop_ent_id_seq', COALESCE((SELECT MAX(comageop_ent_id) FROM com11_ageop), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com11_ageop 
ALTER COLUMN comageop_ent_id SET DEFAULT nextval('com11_ageop_comageop_ent_id_seq');

ALTER SEQUENCE com11_ageop_comageop_ent_id_seq OWNED BY com11_ageop.comageop_ent_id;

-- ============================================================
-- COM12: com12_drsp - comdrsp_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com12_drsp_comdrsp_ent_id_seq') THEN
        CREATE SEQUENCE com12_drsp_comdrsp_ent_id_seq;
        PERFORM setval('com12_drsp_comdrsp_ent_id_seq', COALESCE((SELECT MAX(comdrsp_ent_id) FROM com12_drsp), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com12_drsp 
ALTER COLUMN comdrsp_ent_id SET DEFAULT nextval('com12_drsp_comdrsp_ent_id_seq');

ALTER SEQUENCE com12_drsp_comdrsp_ent_id_seq OWNED BY com12_drsp.comdrsp_ent_id;

-- ============================================================
-- COM13: com13_pcpide - compcpide_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com13_pcpide_compcpide_ent_id_seq') THEN
        CREATE SEQUENCE com13_pcpide_compcpide_ent_id_seq;
        PERFORM setval('com13_pcpide_compcpide_ent_id_seq', COALESCE((SELECT MAX(compcpide_ent_id) FROM com13_pcpide), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com13_pcpide 
ALTER COLUMN compcpide_ent_id SET DEFAULT nextval('com13_pcpide_compcpide_ent_id_seq');

ALTER SEQUENCE com13_pcpide_compcpide_ent_id_seq OWNED BY com13_pcpide.compcpide_ent_id;

-- ============================================================
-- COM14: com14_doscd - comdoscd_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com14_doscd_comdoscd_ent_id_seq') THEN
        CREATE SEQUENCE com14_doscd_comdoscd_ent_id_seq;
        PERFORM setval('com14_doscd_comdoscd_ent_id_seq', COALESCE((SELECT MAX(comdoscd_ent_id) FROM com14_doscd), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com14_doscd 
ALTER COLUMN comdoscd_ent_id SET DEFAULT nextval('com14_doscd_comdoscd_ent_id_seq');

ALTER SEQUENCE com14_doscd_comdoscd_ent_id_seq OWNED BY com14_doscd.comdoscd_ent_id;

-- ============================================================
-- COM15: com15_csirt - comcsirt_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com15_csirt_comcsirt_ent_id_seq') THEN
        CREATE SEQUENCE com15_csirt_comcsirt_ent_id_seq;
        PERFORM setval('com15_csirt_comcsirt_ent_id_seq', COALESCE((SELECT MAX(comcsirt_ent_id) FROM com15_csirt), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com15_csirt 
ALTER COLUMN comcsirt_ent_id SET DEFAULT nextval('com15_csirt_comcsirt_ent_id_seq');

ALTER SEQUENCE com15_csirt_comcsirt_ent_id_seq OWNED BY com15_csirt.comcsirt_ent_id;

-- ============================================================
-- COM16: com16_sgsi - comsgsi_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com16_sgsi_comsgsi_ent_id_seq') THEN
        CREATE SEQUENCE com16_sgsi_comsgsi_ent_id_seq;
        PERFORM setval('com16_sgsi_comsgsi_ent_id_seq', COALESCE((SELECT MAX(comsgsi_ent_id) FROM com16_sgsi), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com16_sgsi 
ALTER COLUMN comsgsi_ent_id SET DEFAULT nextval('com16_sgsi_comsgsi_ent_id_seq');

ALTER SEQUENCE com16_sgsi_comsgsi_ent_id_seq OWNED BY com16_sgsi.comsgsi_ent_id;

-- ============================================================
-- COM17: com17_ptipv6 - comptipv6_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com17_ptipv6_comptipv6_ent_id_seq') THEN
        CREATE SEQUENCE com17_ptipv6_comptipv6_ent_id_seq;
        PERFORM setval('com17_ptipv6_comptipv6_ent_id_seq', COALESCE((SELECT MAX(comptipv6_ent_id) FROM com17_ptipv6), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com17_ptipv6 
ALTER COLUMN comptipv6_ent_id SET DEFAULT nextval('com17_ptipv6_comptipv6_ent_id_seq');

ALTER SEQUENCE com17_ptipv6_comptipv6_ent_id_seq OWNED BY com17_ptipv6.comptipv6_ent_id;

-- ============================================================
-- COM18: com18_sapte - comsapte_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com18_sapte_comsapte_ent_id_seq') THEN
        CREATE SEQUENCE com18_sapte_comsapte_ent_id_seq;
        PERFORM setval('com18_sapte_comsapte_ent_id_seq', COALESCE((SELECT MAX(comsapte_ent_id) FROM com18_sapte), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com18_sapte 
ALTER COLUMN comsapte_ent_id SET DEFAULT nextval('com18_sapte_comsapte_ent_id_seq');

ALTER SEQUENCE com18_sapte_comsapte_ent_id_seq OWNED BY com18_sapte.comsapte_ent_id;

-- ============================================================
-- COM19: com19_renad - comrenad_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com19_renad_comrenad_ent_id_seq') THEN
        CREATE SEQUENCE com19_renad_comrenad_ent_id_seq;
        PERFORM setval('com19_renad_comrenad_ent_id_seq', COALESCE((SELECT MAX(comrenad_ent_id) FROM com19_renad), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com19_renad 
ALTER COLUMN comrenad_ent_id SET DEFAULT nextval('com19_renad_comrenad_ent_id_seq');

ALTER SEQUENCE com19_renad_comrenad_ent_id_seq OWNED BY com19_renad.comrenad_ent_id;

-- ============================================================
-- COM20: com20_dsfpe - comdsfpe_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com20_dsfpe_comdsfpe_ent_id_seq') THEN
        CREATE SEQUENCE com20_dsfpe_comdsfpe_ent_id_seq;
        PERFORM setval('com20_dsfpe_comdsfpe_ent_id_seq', COALESCE((SELECT MAX(comdsfpe_ent_id) FROM com20_dsfpe), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com20_dsfpe 
ALTER COLUMN comdsfpe_ent_id SET DEFAULT nextval('com20_dsfpe_comdsfpe_ent_id_seq');

ALTER SEQUENCE com20_dsfpe_comdsfpe_ent_id_seq OWNED BY com20_dsfpe.comdsfpe_ent_id;

-- ============================================================
-- COM21: com21_dogd - comdogd_ent_id
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'com21_dogd_comdogd_ent_id_seq') THEN
        CREATE SEQUENCE com21_dogd_comdogd_ent_id_seq;
        PERFORM setval('com21_dogd_comdogd_ent_id_seq', COALESCE((SELECT MAX(comdogd_ent_id) FROM com21_dogd), 0) + 1, false);
    END IF;
END $$;

ALTER TABLE com21_dogd 
ALTER COLUMN comdogd_ent_id SET DEFAULT nextval('com21_dogd_comdogd_ent_id_seq');

ALTER SEQUENCE com21_dogd_comdogd_ent_id_seq OWNED BY com21_dogd.comdogd_ent_id;

-- ============================================================
-- Verificación final
-- ============================================================
DO $$
DECLARE
    seq_count INT;
BEGIN
    SELECT COUNT(*) INTO seq_count 
    FROM pg_sequences 
    WHERE schemaname = 'public' 
    AND sequencename LIKE 'com%_seq';
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '✅ AUTOINCREMENT CONFIGURADO EXITOSAMENTE';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'Secuencias creadas/verificadas: %', seq_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Tablas actualizadas:';
    RAISE NOTICE '  - com1_liderg_td (comlgtd_ent_id)';
    RAISE NOTICE '  - com2_cgtd (comcgtd_ent_id)';
    RAISE NOTICE '  - com3_epgd (comepgd_ent_id)';
    RAISE NOTICE '  - com4_tdpei (comtdpei_ent_id)';
    RAISE NOTICE '  - com5_destrategiad (comded_ent_id)';
    RAISE NOTICE '  - com6_mpgobpe (commpgobpe_ent_id)';
    RAISE NOTICE '  - com7_impd (comimpd_ent_id)';
    RAISE NOTICE '  - com8_ptupa (comptupa_ent_id)';
    RAISE NOTICE '  - com9_imgd (comimgd_ent_id)';
    RAISE NOTICE '  - com10_pnda (compnda_ent_id)';
    RAISE NOTICE '  - com11_ageop (comageop_ent_id)';
    RAISE NOTICE '  - com12_drsp (comdrsp_ent_id)';
    RAISE NOTICE '  - com13_pcpide (compcpide_ent_id)';
    RAISE NOTICE '  - com14_doscd (comdoscd_ent_id)';
    RAISE NOTICE '  - com15_csirt (comcsirt_ent_id)';
    RAISE NOTICE '  - com16_sgsi (comsgsi_ent_id)';
    RAISE NOTICE '  - com17_ptipv6 (comptipv6_ent_id)';
    RAISE NOTICE '  - com18_sapte (comsapte_ent_id)';
    RAISE NOTICE '  - com19_renad (comrenad_ent_id)';
    RAISE NOTICE '  - com20_dsfpe (comdsfpe_ent_id)';
    RAISE NOTICE '  - com21_dogd (comdogd_ent_id)';
    RAISE NOTICE '============================================================';
END $$;
