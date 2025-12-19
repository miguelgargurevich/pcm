-- ============================================================
-- SCRIPT: Insertar datos de prueba para Compromisos 11-21
-- Entidad: entidad.test@gob.pe
-- Fecha: 2025-12-19
-- ============================================================

DO $$
DECLARE
    v_entidad_id UUID;
    v_user_id UUID;
BEGIN
    -- Obtener entidad_id y user_id del usuario de prueba
    SELECT entidad_id, user_id INTO v_entidad_id, v_user_id
    FROM usuarios 
    WHERE email = 'entidad.test@gob.pe' 
    LIMIT 1;
    
    IF v_entidad_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el usuario entidad.test@gob.pe';
    END IF;
    
    RAISE NOTICE '✅ Entidad ID encontrado: %', v_entidad_id;
    RAISE NOTICE '✅ User ID encontrado: %', v_user_id;

    -- ============================================================
    -- COM11: Aportación a GeoPeru (com11_ageop)
    -- ============================================================
    INSERT INTO com11_ageop (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        url_geo, tipo_informacion_geo, total_capas_publicadas,
        fecha_ultima_actualizacion_geo, responsable_geo, cargo_responsable_geo,
        correo_responsable_geo, telefono_responsable_geo, norma_aprobacion_geo,
        fecha_aprobacion_geo, interoperabilidad_geo, observacion_geo, ruta_pdf_geo
    ) VALUES (
        11, v_entidad_id, 'finalizado', 'enviado',
        true, true, 'aprobado', 'Datos verificados correctamente',
        NOW(), NOW(), v_user_id, true,
        'https://geoperu.gob.pe/entidad-test', 'Catastral', 15,
        '2025-11-15', 'Juan Carlos Mendoza', 'Especialista GIS',
        'juan.mendoza@entidad.gob.pe', '01-1234567', 'RD-001-2025',
        '2025-01-15', true, 'Información catastral completa', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM11 insertado';

    -- ============================================================
    -- COM12: Responsable de Software Público (com12_drsp)
    -- ============================================================
    INSERT INTO com12_drsp (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        dni_rsp, nombre_rsp, ape_pat_rsp, ape_mat_rsp,
        cargo_rsp, correo_rsp, telefono_rsp, fecha_designacion_rsp,
        numero_resolucion_rsp, observacion_rsp, ruta_pdf_rsp
    ) VALUES (
        12, v_entidad_id, 'finalizado', 'enviado',
        true, true, 'en_revision', 'Pendiente verificación de designación',
        NOW(), NOW(), v_user_id, true,
        '45678912', 'María Elena', 'Torres', 'Ramírez',
        'Coordinadora de TI', 'maria.torres@entidad.gob.pe', '01-2345678', '2025-03-01',
        'RD-012-2025', 'Responsable designada', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM12 insertado';

    -- ============================================================
    -- COM13: Interoperabilidad PIDE (com13_pcpide)
    -- ============================================================
    INSERT INTO com13_pcpide (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        tipo_integracion_pide, nombre_servicio_pide, descripcion_servicio_pide,
        fecha_inicio_operacion_pide, responsable_pide, cargo_responsable_pide,
        correo_responsable_pide, telefono_responsable_pide, numero_convenio_pide,
        fecha_convenio_pide, interoperabilidad_pide, url_servicio_pide, observacion_pide, ruta_pdf_pide
    ) VALUES (
        13, v_entidad_id, 'finalizado', 'enviado',
        true, true, 'observado', 'Falta documentación de integración',
        NOW(), NOW(), v_user_id, true,
        'Consumidor', 'Consulta DNI RENIEC', 'Servicio de validación de identidad',
        '2025-06-01', 'Roberto Sánchez', 'Analista de Sistemas',
        'roberto.sanchez@entidad.gob.pe', '01-3456789', 'CONV-PIDE-001',
        '2025-05-15', true, 'https://pide.gob.pe/servicios', 'Integración activa', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM13 insertado';

    -- ============================================================
    -- COM14: Oficial de Seguridad Digital (com14_doscd)
    -- ============================================================
    INSERT INTO com14_doscd (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        dni_oscd, nombre_oscd, ape_pat_oscd, ape_mat_oscd,
        cargo_oscd, correo_oscd, telefono_oscd, fecha_designacion_oscd,
        numero_resolucion_oscd, comunicado_pcm_oscd, observacion_oscd, ruta_pdf_oscd
    ) VALUES (
        14, v_entidad_id, 'finalizado', 'enviado',
        true, true, 'aprobado', 'Designación correcta',
        NOW(), NOW(), v_user_id, true,
        '12345678', 'Carlos Alberto', 'Gutiérrez', 'Pérez',
        'Oficial de Seguridad y Confianza Digital', 'carlos.gutierrez@entidad.gob.pe', '01-4567890', '2025-02-01',
        'RD-014-2025', true, 'Oficial designado correctamente', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM14 insertado';

    -- ============================================================
    -- COM15: CSIRT Institucional (com15_csirt)
    -- ============================================================
    INSERT INTO com15_csirt (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        nombre_csirt, fecha_conformacion_csirt, numero_resolucion_csirt,
        responsable_csirt, cargo_responsable_csirt, correo_csirt, telefono_csirt,
        protocolo_incidentes_csirt, comunicado_pcm_csirt, observacion_csirt, ruta_pdf_csirt
    ) VALUES (
        15, v_entidad_id, 'paso2', 'borrador',
        false, false, '', '',
        NOW(), NOW(), v_user_id, true,
        'CSIRT-ENTIDAD', '2025-03-15', 'RD-045-2025',
        'Ana María López', 'Coordinadora CSIRT', 'csirt@entidad.gob.pe', '01-5678901',
        false, false, 'En proceso de conformación', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM15 insertado';

    -- ============================================================
    -- COM16: Sistema de Gestión de Seguridad (com16_sgsi)
    -- ============================================================
    INSERT INTO com16_sgsi (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        responsable_sgsi, cargo_responsable_sgsi, correo_sgsi,
        telefono_sgsi, estado_implementacion_sgsi, alcance_sgsi, 
        fecha_inicio_sgsi, fecha_certificacion_sgsi, entidad_certificadora_sgsi,
        version_norma_sgsi, ruta_pdf_certificado_sgsi, ruta_pdf_politicas_sgsi,
        observacion_sgsi, "rutaPDF_normativa", fecha_implementacion_sgsi,
        norma_aplicada_sgsi, ruta_pdf_sgsi, nivel_implementacion_sgsi
    ) VALUES (
        16, v_entidad_id, 'finalizado', 'enviado',
        true, true, 'en_revision', 'En proceso de evaluación',
        NOW(), NOW(), v_user_id, true,
        'Pedro Martínez', 'Jefe de Seguridad TI', 'pedro.martinez@entidad.gob.pe',
        '01-6789012', 'En implementación', 'Toda la organización',
        '2025-04-01', '2025-12-01', 'SGS del Perú',
        'ISO/IEC 27001:2022', '', '',
        'Implementación en curso', '', '2025-04-01',
        'ISO 27001:2022', '', 'Nivel 3'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM16 insertado';

    -- ============================================================
    -- COM17: Plan de Transición a IPv6 (com17_ptipv6)
    -- ============================================================
    INSERT INTO com17_ptipv6 (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        responsable_ipv6, cargo_responsable_ipv6, correo_ipv6,
        telefono_ipv6, estado_plan_ipv6,
        fecha_formulacion_ipv6, fecha_aprobacion_ipv6, fecha_inicio_ipv6,
        fecha_fin_ipv6, descripcion_plan_ipv6, ruta_pdf_plan_ipv6,
        observacion_ipv6, "rutaPDF_normativa"
    ) VALUES (
        17, v_entidad_id, 'paso1', 'bandeja',
        false, false, '', '',
        NOW(), NOW(), v_user_id, true,
        '', '', '',
        '', '',
        '2025-01-01', '2025-02-01', '2025-03-01',
        '2026-12-31', '', '',
        '', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM17 insertado';

    -- ============================================================
    -- COM18: Portal de Transparencia (com18_sapte)
    -- ============================================================
    INSERT INTO com18_sapte (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        responsable_pte, cargo_responsable_pte, correo_pte,
        telefono_pte, fecha_solicitud_pte, fecha_acceso_pte,
        numero_oficio_pte, estado_acceso_pte, enlace_portal_pte,
        descripcion_pte, ruta_pdf_pte, observacion_pte, "rutaPDF_normativa"
    ) VALUES (
        18, v_entidad_id, 'finalizado', 'enviado',
        true, true, 'aprobado', 'Acceso otorgado',
        NOW(), NOW(), v_user_id, true,
        'Luisa Fernández', 'Responsable de Transparencia', 'luisa.fernandez@entidad.gob.pe',
        '01-7890123', '2025-02-10', '2025-02-20',
        'OF-018-2025', 'Activo', 'https://pte.gob.pe/entidad-test',
        'Portal activo y actualizado', '', '', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM18 insertado';

    -- ============================================================
    -- COM19: Encuesta Nacional de Gobierno Digital (com19_renad)
    -- ============================================================
    INSERT INTO com19_renad (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        anio_enad, responsable_enad, cargo_responsable_enad,
        correo_enad, telefono_enad, fecha_envio_enad,
        estado_respuesta_enad, enlace_formulario_enad, observacion_enad,
        ruta_pdf_enad, "rutaPDF_normativa"
    ) VALUES (
        19, v_entidad_id, 'finalizado', 'enviado',
        true, true, 'aprobado', 'Encuesta completada',
        NOW(), NOW(), v_user_id, true,
        2025, 'Jorge Vargas', 'Coordinador de Estadísticas',
        'jorge.vargas@entidad.gob.pe', '01-8901234', '2025-08-30',
        'Completada', 'https://enad.gob.pe/formulario', 'Encuesta respondida completamente',
        '', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM19 insertado';

    -- ============================================================
    -- COM20: Digitalización Facilita Perú (com20_dsfpe)
    -- ============================================================
    INSERT INTO com20_dsfpe (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        responsable_facilita, cargo_responsable_facilita, correo_facilita,
        telefono_facilita, estado_implementacion_facilita, fecha_inicio_facilita,
        fecha_ultimo_avance_facilita, total_servicios_digitalizados,
        ruta_pdf_facilita, observacion_facilita, "rutaPDF_normativa"
    ) VALUES (
        20, v_entidad_id, 'paso3', 'borrador',
        true, false, '', '',
        NOW(), NOW(), v_user_id, true,
        'Carmen Quispe', 'Analista de Procesos', 'carmen.quispe@entidad.gob.pe',
        '01-9012345', 'En planificación', '2025-10-01',
        '2025-11-15', 5,
        '', 'En proceso de digitalización', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM20 insertado';

    -- ============================================================
    -- COM21: Oficial de Gobierno de Datos (com21_dogd)
    -- ============================================================
    INSERT INTO com21_dogd (
        compromiso_id, entidad_id, etapa_formulario, estado,
        check_privacidad, check_ddjj, "estado_PCM", "observaciones_PCM",
        created_at, fec_registro, usuario_registra, activo,
        dni_ogd, nombre_ogd, ape_pat_ogd, ape_mat_ogd,
        cargo_ogd, correo_ogd, telefono_ogd, fecha_designacion_ogd,
        numero_resolucion_ogd, comunicado_pcm_ogd, ruta_pdf_ogd,
        observacion_ogd, "rutaPDF_normativa"
    ) VALUES (
        21, v_entidad_id, 'finalizado', 'enviado',
        true, true, 'observado', 'Requiere actualizar resolución de designación',
        NOW(), NOW(), v_user_id, true,
        '87654321', 'Diana Carolina', 'Rojas', 'Silva',
        'Oficial de Gobierno de Datos', 'diana.rojas@entidad.gob.pe', '01-0123456', '2025-03-15',
        'RD-021-2025', true, '',
        'Oficial designado formalmente', ''
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ COM21 insertado';

    RAISE NOTICE '';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '✅ DATOS DE PRUEBA INSERTADOS EXITOSAMENTE';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'Entidad: entidad.test@gob.pe';
    RAISE NOTICE 'Compromisos: 11 al 21';
    RAISE NOTICE '';
    RAISE NOTICE 'Estados PCM variados para testing:';
    RAISE NOTICE '  - COM11: aprobado';
    RAISE NOTICE '  - COM12: en_revision';
    RAISE NOTICE '  - COM13: observado';
    RAISE NOTICE '  - COM14: aprobado';
    RAISE NOTICE '  - COM15: (sin estado - borrador)';
    RAISE NOTICE '  - COM16: en_revision';
    RAISE NOTICE '  - COM17: (sin estado - bandeja)';
    RAISE NOTICE '  - COM18: aprobado';
    RAISE NOTICE '  - COM19: aprobado';
    RAISE NOTICE '  - COM20: (sin estado - borrador)';
    RAISE NOTICE '  - COM21: observado';
    RAISE NOTICE '============================================================';

END $$;
