-- ============================================
-- SCRIPT: Datos de prueba para Compromiso 3
-- Plan de Gobierno Digital
-- ============================================

-- Primero obtener el entidad_id del usuario de prueba
DO $$
DECLARE
    v_entidad_id UUID;
    v_user_id UUID;
    v_com3_id BIGINT;
    v_next_id BIGINT;
    v_obj_est_1 BIGINT;
    v_obj_est_2 BIGINT;
    v_obj_gd_1 BIGINT;
    v_obj_gd_2 BIGINT;
    v_seginfo_id BIGINT;
BEGIN
    -- Obtener entidad_id y user_id del usuario de prueba
    SELECT entidad_id, user_id INTO v_entidad_id, v_user_id 
    FROM usuarios 
    WHERE email = 'entidad.test@gob.pe' 
    LIMIT 1;
    
    IF v_entidad_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el usuario entidad.test@gob.pe';
    END IF;
    
    RAISE NOTICE 'Entidad ID encontrada: %', v_entidad_id;
    
    -- Eliminar datos existentes de prueba para esta entidad (si existen)
    DELETE FROM capacitaciones_seginfo WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM seguridad_info WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM proyectos_entidades WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM acciones_objetivos_entidades WHERE obj_ent_id IN (SELECT obj_ent_id FROM objetivos_entidades WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id));
    DELETE FROM objetivos_entidades WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM inventario_servidores WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM inventario_red WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM inventario_sistemas_info WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM inventario_software WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM personal_ti WHERE com_entidad_id IN (SELECT comepgd_ent_id FROM com3_epgd WHERE entidad_id = v_entidad_id);
    DELETE FROM com3_epgd WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'Datos anteriores eliminados';
    
    -- Obtener siguiente ID disponible
    SELECT COALESCE(MAX(comepgd_ent_id), 0) + 1 INTO v_next_id FROM com3_epgd;
    
    -- 1. Crear registro principal de Com3EPGD
    INSERT INTO com3_epgd (
        comepgd_ent_id,
        compromiso_id,
        entidad_id,
        etapa_formulario,
        estado,
        check_privacidad,
        check_ddjj,
        "estado_PCM",
        "observaciones_PCM",
        created_at,
        fec_registro,
        usuario_registra,
        activo,
        fecha_reporte,
        sede,
        observaciones,
        ubicacion_area_ti,
        organigrama_ti,
        dependencia_area_ti,
        costo_anual_ti,
        existe_comision_gd_ti
    ) VALUES (
        v_next_id,
        3,
        v_entidad_id,
        'paso1',
        'bandeja',
        false,
        false,
        '',
        '',
        NOW(),
        NOW(),
        v_user_id, -- user_id del usuario
        true,
        NOW()::date,
        'Lima',
        'Datos de prueba para Compromiso 3',
        'Oficina de Tecnologías de la Información',
        'Unidad de TI en el Organigrama',
        'Secretaría General',
        250000.00,
        true
    ) RETURNING comepgd_ent_id INTO v_com3_id;
    
    RAISE NOTICE 'Com3EPGD creado con ID: %', v_com3_id;
    
    -- 2. Insertar Personal TI (con IDs explícitos)
    INSERT INTO personal_ti (personal_id, com_entidad_id, nombre_persona, dni, cargo, rol, especialidad, grado_instruccion, certificacion, acreditadora, codigo_certificacion, colegiatura, email_personal, telefono) VALUES
    ((SELECT COALESCE(MAX(personal_id), 0) + 1 FROM personal_ti), v_com3_id, 'Juan Carlos Pérez García', '12345678', 'Jefe de TI', 'Líder', 'Gestión de TI', 'Magister', 'PMP', 'PMI', 'PMP-123456', 'CIP-12345', 'jperez@entidad.gob.pe', '987654321'),
    ((SELECT COALESCE(MAX(personal_id), 0) + 2 FROM personal_ti), v_com3_id, 'María Elena Torres López', '23456789', 'Analista de Sistemas', 'Desarrollador', 'Desarrollo Web', 'Bachiller', 'SCRUM Master', 'Scrum Alliance', 'CSM-789', 'N/A', 'mtorres@entidad.gob.pe', '987654322'),
    ((SELECT COALESCE(MAX(personal_id), 0) + 3 FROM personal_ti), v_com3_id, 'Roberto Sánchez Mendoza', '34567890', 'Administrador de BD', 'DBA', 'Base de Datos', 'Titulado', 'Oracle DBA', 'Oracle', 'OCA-456', 'CIP-23456', 'rsanchez@entidad.gob.pe', '987654323'),
    ((SELECT COALESCE(MAX(personal_id), 0) + 4 FROM personal_ti), v_com3_id, 'Ana Lucía Ramírez Castro', '45678901', 'Soporte Técnico', 'Soporte', 'Infraestructura', 'Técnico', 'ITIL Foundation', 'AXELOS', 'ITIL-789', 'N/A', 'aramirez@entidad.gob.pe', '987654324');
    
    RAISE NOTICE 'Personal TI insertado';
    
    -- 3. Insertar Inventario Software (con IDs explícitos)
    INSERT INTO inventario_software (inv_soft_id, com_entidad_id, cod_producto, nombre_producto, version, tipo_software, cantidad_instalaciones, cantidad_licencias, exceso_deficiencia, costo_licencias) VALUES
    ((SELECT COALESCE(MAX(inv_soft_id), 0) + 1 FROM inventario_software), v_com3_id, 'SW-001', 'Microsoft Office 365', '2024', 'Ofimática', 150, 200, 50, 45000.00),
    ((SELECT COALESCE(MAX(inv_soft_id), 0) + 2 FROM inventario_software), v_com3_id, 'SW-002', 'Windows 11 Pro', '23H2', 'Sistema Operativo', 150, 150, 0, 30000.00),
    ((SELECT COALESCE(MAX(inv_soft_id), 0) + 3 FROM inventario_software), v_com3_id, 'SW-003', 'Visual Studio Enterprise', '2024', 'Desarrollo', 10, 10, 0, 12000.00),
    ((SELECT COALESCE(MAX(inv_soft_id), 0) + 4 FROM inventario_software), v_com3_id, 'SW-004', 'Adobe Creative Cloud', '2024', 'Diseño', 5, 5, 0, 8000.00),
    ((SELECT COALESCE(MAX(inv_soft_id), 0) + 5 FROM inventario_software), v_com3_id, 'SW-005', 'Antivirus Kaspersky', '2024', 'Seguridad', 150, 200, 50, 5000.00);
    
    RAISE NOTICE 'Inventario Software insertado';
    
    -- 4. Insertar Inventario Sistemas de Información (con IDs explícitos)
    INSERT INTO inventario_sistemas_info (inv_si_id, com_entidad_id, codigo, nombre_sistema, descripcion, tipo_sistema, lenguaje_programacion, base_datos, plataforma) VALUES
    ((SELECT COALESCE(MAX(inv_si_id), 0) + 1 FROM inventario_sistemas_info), v_com3_id, 'SI-001', 'Sistema de Trámite Documentario', 'Gestión de documentos y expedientes', 'Transaccional', 'Java', 'PostgreSQL', 'Web'),
    ((SELECT COALESCE(MAX(inv_si_id), 0) + 2 FROM inventario_sistemas_info), v_com3_id, 'SI-002', 'Sistema de Recursos Humanos', 'Gestión de personal y planillas', 'Transaccional', 'C#', 'SQL Server', 'Web'),
    ((SELECT COALESCE(MAX(inv_si_id), 0) + 3 FROM inventario_sistemas_info), v_com3_id, 'SI-003', 'Sistema de Contabilidad', 'Gestión contable y presupuestal', 'Transaccional', 'Java', 'Oracle', 'Web'),
    ((SELECT COALESCE(MAX(inv_si_id), 0) + 4 FROM inventario_sistemas_info), v_com3_id, 'SI-004', 'Portal Web Institucional', 'Sitio web de la entidad', 'Informativo', 'PHP', 'MySQL', 'Web'),
    ((SELECT COALESCE(MAX(inv_si_id), 0) + 5 FROM inventario_sistemas_info), v_com3_id, 'SI-005', 'Sistema de Mesa de Partes Virtual', 'Recepción de documentos en línea', 'Transaccional', 'Python', 'PostgreSQL', 'Web');
    
    RAISE NOTICE 'Inventario Sistemas insertado';
    
    -- 5. Insertar Inventario Red (con IDs explícitos)
    INSERT INTO inventario_red (inv_red_id, com_entidad_id, tipo_equipo, cantidad, puertos_operativos, puertos_inoperativos, total_puertos, costo_mantenimiento_anual, observaciones) VALUES
    ((SELECT COALESCE(MAX(inv_red_id), 0) + 1 FROM inventario_red), v_com3_id, 'Switch Capa 3', 5, 120, 0, 120, 5000.00, 'Switches core de la red'),
    ((SELECT COALESCE(MAX(inv_red_id), 0) + 2 FROM inventario_red), v_com3_id, 'Switch Capa 2', 20, 480, 5, 485, 8000.00, 'Switches de acceso'),
    ((SELECT COALESCE(MAX(inv_red_id), 0) + 3 FROM inventario_red), v_com3_id, 'Router', 3, 12, 0, 12, 3000.00, 'Routers de borde'),
    ((SELECT COALESCE(MAX(inv_red_id), 0) + 4 FROM inventario_red), v_com3_id, 'Firewall', 2, 8, 0, 8, 6000.00, 'Firewalls perimetrales'),
    ((SELECT COALESCE(MAX(inv_red_id), 0) + 5 FROM inventario_red), v_com3_id, 'Access Point', 30, 30, 2, 32, 2000.00, 'Puntos de acceso WiFi');
    
    RAISE NOTICE 'Inventario Red insertado';
    
    -- 6. Insertar Inventario Servidores (con IDs explícitos)
    INSERT INTO inventario_servidores (inv_srv_id, com_entidad_id, nombre_equipo, tipo_equipo, estado, capa, propiedad, montaje, marca_cpu, modelo_cpu, velocidad_ghz, nucleos, memoria_gb, marca_memoria, modelo_memoria, cantidad_memoria, costo_mantenimiento_anual, observaciones) VALUES
    ((SELECT COALESCE(MAX(inv_srv_id), 0) + 1 FROM inventario_servidores), v_com3_id, 'SRV-DB-01', 'Físico', 'Operativo', 'Base de Datos', 'Propio', 'Rack', 'Intel', 'Xeon Gold 6248', 2.5, 20, 256, 'Kingston', 'DDR4 ECC', 8, 8000.00, 'Servidor de base de datos principal'),
    ((SELECT COALESCE(MAX(inv_srv_id), 0) + 2 FROM inventario_servidores), v_com3_id, 'SRV-APP-01', 'Físico', 'Operativo', 'Aplicación', 'Propio', 'Rack', 'Intel', 'Xeon Silver 4214', 2.2, 12, 128, 'Samsung', 'DDR4 ECC', 4, 6000.00, 'Servidor de aplicaciones'),
    ((SELECT COALESCE(MAX(inv_srv_id), 0) + 3 FROM inventario_servidores), v_com3_id, 'SRV-WEB-01', 'Virtual', 'Operativo', 'Web', 'Propio', 'Virtual', 'Virtual', 'vCPU', 2.0, 8, 32, 'Virtual', 'vRAM', 1, 2000.00, 'Servidor web principal'),
    ((SELECT COALESCE(MAX(inv_srv_id), 0) + 4 FROM inventario_servidores), v_com3_id, 'SRV-FILE-01', 'Físico', 'Operativo', 'Archivos', 'Propio', 'Rack', 'Intel', 'Xeon E-2236', 3.4, 6, 64, 'Crucial', 'DDR4 ECC', 2, 3000.00, 'Servidor de archivos'),
    ((SELECT COALESCE(MAX(inv_srv_id), 0) + 5 FROM inventario_servidores), v_com3_id, 'SRV-BACKUP-01', 'Físico', 'Operativo', 'Backup', 'Propio', 'Rack', 'Intel', 'Xeon E-2124', 3.3, 4, 32, 'Kingston', 'DDR4', 2, 2500.00, 'Servidor de respaldo');
    
    RAISE NOTICE 'Inventario Servidores insertado';
    
    -- 7. Insertar Seguridad Info (con ID explícito)
    INSERT INTO seguridad_info (seginfo_id, com_entidad_id, plan_sgsi, comite_seguridad, oficial_seguridad_en_organigrama, politica_seguridad, inventario_activos, analisis_riesgos, metodologia_riesgos, plan_continuidad, programa_auditorias, informes_direccion, certificacion_iso27001, observaciones)
    VALUES ((SELECT COALESCE(MAX(seginfo_id), 0) + 1 FROM seguridad_info), v_com3_id, true, true, true, true, true, true, true, false, true, true, false, 'En proceso de implementación de ISO 27001')
    RETURNING seginfo_id INTO v_seginfo_id;
    
    RAISE NOTICE 'Seguridad Info insertada con ID: %', v_seginfo_id;
    
    -- 8. Insertar Capacitaciones de Seguridad (con IDs explícitos)
    INSERT INTO capacitaciones_seginfo (capseg_id, com_entidad_id, curso, cantidad_personas) VALUES
    ((SELECT COALESCE(MAX(capseg_id), 0) + 1 FROM capacitaciones_seginfo), v_com3_id, 'Concientización en Seguridad de la Información', 150),
    ((SELECT COALESCE(MAX(capseg_id), 0) + 2 FROM capacitaciones_seginfo), v_com3_id, 'Gestión de Incidentes de Seguridad', 20),
    ((SELECT COALESCE(MAX(capseg_id), 0) + 3 FROM capacitaciones_seginfo), v_com3_id, 'ISO 27001 - Fundamentos', 15),
    ((SELECT COALESCE(MAX(capseg_id), 0) + 4 FROM capacitaciones_seginfo), v_com3_id, 'Protección de Datos Personales', 50);
    
    RAISE NOTICE 'Capacitaciones insertadas';
    
    -- 9. Insertar Objetivos Estratégicos (tipo 'E') - con ID explícito
    INSERT INTO objetivos_entidades (obj_ent_id, com_entidad_id, tipo_obj, numeracion_obj, descripcion_objetivo)
    VALUES ((SELECT COALESCE(MAX(obj_ent_id), 0) + 1 FROM objetivos_entidades), v_com3_id, 'E', 'OE-01', 'Fortalecer la gestión institucional mediante el uso de tecnologías digitales')
    RETURNING obj_ent_id INTO v_obj_est_1;
    
    INSERT INTO objetivos_entidades (obj_ent_id, com_entidad_id, tipo_obj, numeracion_obj, descripcion_objetivo)
    VALUES ((SELECT COALESCE(MAX(obj_ent_id), 0) + 1 FROM objetivos_entidades), v_com3_id, 'E', 'OE-02', 'Mejorar la calidad de los servicios públicos digitales')
    RETURNING obj_ent_id INTO v_obj_est_2;
    
    -- Insertar acciones para OE-01 (con IDs explícitos)
    INSERT INTO acciones_objetivos_entidades (acc_obj_ent_id, obj_ent_id, numeracion_acc, descripcion_accion) VALUES
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 1 FROM acciones_objetivos_entidades), v_obj_est_1, 'A1.1', 'Implementar sistema de gestión documental electrónica'),
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 2 FROM acciones_objetivos_entidades), v_obj_est_1, 'A1.2', 'Digitalizar procesos administrativos internos'),
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 3 FROM acciones_objetivos_entidades), v_obj_est_1, 'A1.3', 'Capacitar al personal en herramientas digitales');
    
    -- Insertar acciones para OE-02 (con IDs explícitos)
    INSERT INTO acciones_objetivos_entidades (acc_obj_ent_id, obj_ent_id, numeracion_acc, descripcion_accion) VALUES
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 1 FROM acciones_objetivos_entidades), v_obj_est_2, 'A2.1', 'Desarrollar aplicación móvil para servicios ciudadanos'),
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 2 FROM acciones_objetivos_entidades), v_obj_est_2, 'A2.2', 'Implementar chatbot de atención 24/7');
    
    RAISE NOTICE 'Objetivos Estratégicos y acciones insertados';
    
    -- 10. Insertar Objetivos de Gobierno Digital (tipo 'G') - con ID explícito
    INSERT INTO objetivos_entidades (obj_ent_id, com_entidad_id, tipo_obj, numeracion_obj, descripcion_objetivo)
    VALUES ((SELECT COALESCE(MAX(obj_ent_id), 0) + 1 FROM objetivos_entidades), v_com3_id, 'G', 'OGD01', 'Garantizar la interoperabilidad de los sistemas de información')
    RETURNING obj_ent_id INTO v_obj_gd_1;
    
    INSERT INTO objetivos_entidades (obj_ent_id, com_entidad_id, tipo_obj, numeracion_obj, descripcion_objetivo)
    VALUES ((SELECT COALESCE(MAX(obj_ent_id), 0) + 1 FROM objetivos_entidades), v_com3_id, 'G', 'OGD02', 'Promover la apertura de datos públicos')
    RETURNING obj_ent_id INTO v_obj_gd_2;
    
    -- Insertar acciones para OGD-01 (con IDs explícitos)
    INSERT INTO acciones_objetivos_entidades (acc_obj_ent_id, obj_ent_id, numeracion_acc, descripcion_accion) VALUES
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 1 FROM acciones_objetivos_entidades), v_obj_gd_1, 'G1.1', 'Integrar sistemas con la PIDE'),
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 2 FROM acciones_objetivos_entidades), v_obj_gd_1, 'G1.2', 'Implementar APIs públicas');
    
    -- Insertar acciones para OGD-02 (con IDs explícitos)
    INSERT INTO acciones_objetivos_entidades (acc_obj_ent_id, obj_ent_id, numeracion_acc, descripcion_accion) VALUES
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 1 FROM acciones_objetivos_entidades), v_obj_gd_2, 'G2.1', 'Publicar datasets en datos abiertos'),
    ((SELECT COALESCE(MAX(acc_obj_ent_id), 0) + 2 FROM acciones_objetivos_entidades), v_obj_gd_2, 'G2.2', 'Crear portal de datos abiertos institucional');
    
    RAISE NOTICE 'Objetivos de Gobierno Digital y acciones insertados';
    
    -- 11. Insertar Proyectos del Portafolio (con IDs explícitos)
    INSERT INTO proyectos_entidades (proy_ent_id, com_entidad_id, numeracion_proy, nombre, alcance, justificacion, tipo_proy, area_proy, area_ejecuta, tipo_beneficiario, etapa_proyecto, ambito_proyecto, fec_ini_prog, fec_fin_prog, fec_ini_real, fec_fin_real, alienado_pgd, obj_tran_dig, obj_est, acc_est, estado_proyecto, porcentaje_avance, informo_avance) VALUES
    ((SELECT COALESCE(MAX(proy_ent_id), 0) + 1 FROM proyectos_entidades), v_com3_id, 'P001', 'Modernización del Sistema de Trámite Documentario', 'Implementación de firma digital', 'Reducir tiempos de atención', 'TransDig', 'Tecnolog', 'OficTI', 'Ciudada', 'Ejecucion', 'Nacional', '2024-01-15', '2024-12-31', '2024-01-20', '2024-12-31', 'OGD01', 'Simplif', 'OE-01', 'A1.1', true, 45, true),
    ((SELECT COALESCE(MAX(proy_ent_id), 0) + 2 FROM proyectos_entidades), v_com3_id, 'P002', 'Mesa de Partes Virtual', 'Sistema de recepción de documentos', 'Facilitar el acceso', 'ServDig', 'Atencion', 'OficTI', 'Ciudada', 'Complet', 'Nacional', '2024-02-01', '2024-06-30', '2024-02-01', '2024-06-30', 'OGD02', 'Servdig', 'OE-02', 'A2.1', true, 100, true),
    ((SELECT COALESCE(MAX(proy_ent_id), 0) + 3 FROM proyectos_entidades), v_com3_id, 'P003', 'Plataforma de Datos Abiertos', 'Portal de publicación', 'Promover transparencia', 'DatosAb', 'Transpar', 'OficTI', 'Ciudada', 'Planif', 'Nacional', '2025-01-01', '2025-06-30', '2025-01-01', '2025-06-30', 'OGD02', 'DatAb', 'OE-02', 'A2.2', false, 0, false),
    ((SELECT COALESCE(MAX(proy_ent_id), 0) + 4 FROM proyectos_entidades), v_com3_id, 'P004', 'Fortalecimiento Ciberseguridad', 'Implementación de SOC', 'Proteger activos', 'Segurid', 'Infraest', 'OficTI', 'Interno', 'Ejecucion', 'Nacional', '2024-03-01', '2024-12-31', '2024-03-15', '2024-12-31', 'OGD01', 'SegDig', 'OE-01', 'A1.2', true, 60, true);
    
    RAISE NOTICE 'Proyectos del Portafolio insertados';
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ DATOS DE PRUEBA INSERTADOS EXITOSAMENTE';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Com3EPGD ID: %', v_com3_id;
    RAISE NOTICE 'Entidad ID: %', v_entidad_id;
    RAISE NOTICE 'Personal TI: 4 registros';
    RAISE NOTICE 'Inventario Software: 5 registros';
    RAISE NOTICE 'Inventario Sistemas: 5 registros';
    RAISE NOTICE 'Inventario Red: 5 registros';
    RAISE NOTICE 'Inventario Servidores: 5 registros';
    RAISE NOTICE 'Objetivos Estratégicos: 2 con 5 acciones';
    RAISE NOTICE 'Objetivos Gobierno Digital: 2 con 4 acciones';
    RAISE NOTICE 'Proyectos: 4 registros';
    RAISE NOTICE '============================================';
    
END $$;

-- Verificar los datos insertados
SELECT 'com3_epgd' as tabla, COUNT(*) as registros FROM com3_epgd
UNION ALL
SELECT 'personal_ti', COUNT(*) FROM personal_ti
UNION ALL
SELECT 'inventario_software', COUNT(*) FROM inventario_software
UNION ALL
SELECT 'inventario_sistemas_info', COUNT(*) FROM inventario_sistemas_info
UNION ALL
SELECT 'inventario_red', COUNT(*) FROM inventario_red
UNION ALL
SELECT 'inventario_servidores', COUNT(*) FROM inventario_servidores
UNION ALL
SELECT 'seguridad_info', COUNT(*) FROM seguridad_info
UNION ALL
SELECT 'capacitaciones_seginfo', COUNT(*) FROM capacitaciones_seginfo
UNION ALL
SELECT 'objetivos_entidades', COUNT(*) FROM objetivos_entidades
UNION ALL
SELECT 'acciones_objetivos_entidades', COUNT(*) FROM acciones_objetivos_entidades
UNION ALL
SELECT 'proyectos_entidades', COUNT(*) FROM proyectos_entidades;
