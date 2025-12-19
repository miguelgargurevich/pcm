-- ============================================================================
-- SEED: Datos completos para Entidad de Ate (todos los compromisos)
-- Fecha: 2025-12-18
-- Descripción: Inserta datos de prueba realistas para todos los compromisos
-- Entidad: Municipalidad Distrital de Ate (019a99c9-7bd1-7525-b01d-a5a7379ba9fa)
-- ============================================================================

-- Variables
DO $$
DECLARE
    v_entidad_id UUID := '019a99c9-7bd1-7525-b01d-a5a7379ba9fa';
    v_usuario_id UUID := '6a4780a7-f419-4fbe-a305-750e9ff048b4';
    v_fecha_actual DATE := CURRENT_DATE;
BEGIN
    
    -- ========================================================================
    -- COM1: Liderazgo GD y TI - YA TIENE DATOS COMPLETOS
    -- ========================================================================
    RAISE NOTICE 'COM1 ya tiene datos completos';
    
    -- ========================================================================
    -- COM2: Comité de Gobierno y Transformación Digital
    -- ========================================================================
    UPDATE com2_cgtd SET
        nombre_comite = 'Comité de Transformación Digital - Ate',
        fecha_constitucion = '2024-06-15',
        norma_creacion = 'Ordenanza Municipal N° 524-2024-MDA',
        tiene_norma_creacion = true,
        estado_comite = 'Activo',
        frecuencia_reuniones = 'Mensual',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Comité constituido y funcionando regularmente'
    WHERE entidad_id = v_entidad_id;
    
    -- Insertar miembros del comité
    DELETE FROM comite_miembros WHERE com_ent_id = (
        SELECT comcgtd_ent_id FROM com2_cgtd WHERE entidad_id = v_entidad_id
    );
    
    INSERT INTO comite_miembros (com_ent_id, tipo_miembro, nombres, apellidos, cargo, email, telefono, activo)
    SELECT 
        comcgtd_ent_id,
        'Presidente',
        'Juan Carlos',
        'Pérez López',
        'Gerente Municipal',
        'jperez@muniate.gob.pe',
        '987654321',
        true
    FROM com2_cgtd WHERE entidad_id = v_entidad_id
    UNION ALL
    SELECT 
        comcgtd_ent_id,
        'Secretario',
        'María Elena',
        'García Flores',
        'Jefe de Informática',
        'mgarcia@muniate.gob.pe',
        '987654322',
        true
    FROM com2_cgtd WHERE entidad_id = v_entidad_id
    UNION ALL
    SELECT 
        comcgtd_ent_id,
        'Miembro',
        'Roberto',
        'Sánchez Díaz',
        'Gerente de Planificación',
        'rsanchez@muniate.gob.pe',
        '987654323',
        true
    FROM com2_cgtd WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM2: Comité actualizado con 3 miembros';
    
    -- ========================================================================
    -- COM3: EPGD - YA TIENE DATOS (se agregó proyecto de prueba)
    -- ========================================================================
    RAISE NOTICE 'COM3 ya tiene datos con proyectos';
    
    -- ========================================================================
    -- COM4: Transferencia Digital de Procedimientos y Servicios
    -- ========================================================================
    UPDATE com4_tdpei SET
        total_procedimientos = 45,
        procedimientos_digitalizados = 32,
        porcentaje_digitalizacion = ROUND((32.0 / 45.0) * 100, 2),
        servicios_linea = 18,
        servicios_planificados = 12,
        meta_2024 = 40,
        meta_2025 = 50,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Avance significativo en digitalización de trámites'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM4: Transferencia Digital actualizada';
    
    -- ========================================================================
    -- COM5: Documento Estratégico de Arquitectura Digital
    -- ========================================================================
    UPDATE com5_destrategiad SET
        tiene_documento = true,
        fecha_aprobacion = '2024-08-20',
        norma_aprobacion = 'Resolución de Alcaldía N° 432-2024-MDA',
        periodo_vigencia_inicio = '2024-01-01',
        periodo_vigencia_fin = '2026-12-31',
        estado_documento = 'Vigente',
        url_documento = 'https://muniate.gob.pe/doc/arquitectura-digital-2024.pdf',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Documento alineado con PNAGD 2024-2030'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM5: Documento Estratégico actualizado';
    
    -- ========================================================================
    -- COM6: Marco de Políticas de Gobierno y Privacidad Digital
    -- ========================================================================
    UPDATE com6_mpgobpe SET
        tiene_marco_politicas = true,
        fecha_aprobacion = '2024-09-10',
        norma_aprobacion = 'Ordenanza Municipal N° 567-2024-MDA',
        incluye_proteccion_datos = true,
        incluye_ciberseguridad = true,
        incluye_interoperabilidad = true,
        fecha_revision = '2024-09-01',
        proxima_revision = '2025-09-01',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Marco integral de políticas digitales'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM6: Marco de Políticas actualizado';
    
    -- ========================================================================
    -- COM7: Implementación de Plataformas de Desarrollo
    -- ========================================================================
    UPDATE com7_impd SET
        tiene_plataforma_desarrollo = true,
        tipo_plataforma = 'Cloud híbrida',
        proveedor = 'AWS + On-premise',
        fecha_implementacion = '2024-05-15',
        nivel_madurez = 'Intermedio',
        equipos_desarrollo = 3,
        proyectos_activos = 8,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Infraestructura híbrida operativa'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM7: Implementación Plataformas actualizada';
    
    -- ========================================================================
    -- COM8: Portal de Transparencia y TUPA Digital
    -- ========================================================================
    UPDATE com8_ptupa SET
        tiene_portal_transparencia = true,
        url_portal = 'https://transparencia.muniate.gob.pe',
        fecha_actualizacion = v_fecha_actual,
        tiene_tupa_digital = true,
        url_tupa = 'https://tupa.muniate.gob.pe',
        procedimientos_tupa = 45,
        servicios_digitales = 32,
        cumple_ley_transparencia = true,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Portales actualizados y funcionales'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM8: Portal TUPA actualizado';
    
    -- ========================================================================
    -- COM9: Indicadores de Medición de Gobierno Digital
    -- ========================================================================
    UPDATE com9_imgd SET
        tiene_indicadores = true,
        total_indicadores = 15,
        indicadores_activos = 12,
        frecuencia_medicion = 'Trimestral',
        herramienta_medicion = 'Power BI + Excel',
        ultimo_reporte_fecha = v_fecha_actual - 30,
        proximo_reporte_fecha = v_fecha_actual + 60,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Sistema de indicadores implementado'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM9: Indicadores actualizado';
    
    -- ========================================================================
    -- COM10: Plataforma Nacional de Datos Abiertos
    -- ========================================================================
    UPDATE com10_pnda SET
        participa_pnda = true,
        fecha_adhesion = '2024-07-20',
        datasets_publicados = 24,
        datasets_actualizados = 20,
        frecuencia_actualizacion = 'Mensual',
        url_datos_abiertos = 'https://datos.gob.pe/organization/municipalidad-ate',
        calidad_datos = 'Alta',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Participación activa en PNDA'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM10: PNDA actualizado';
    
    -- ========================================================================
    -- COM11: Acciones de Gobierno Electrónico y Operatividad
    -- ========================================================================
    UPDATE com11_ageop SET
        tiene_plan_ge = true,
        fecha_aprobacion_plan = '2024-04-10',
        servicios_electronicos = 28,
        tramites_electronicos = 32,
        porcentaje_digitalizacion = 71.1,
        sistemas_integrados = 5,
        nivel_interoperabilidad = 'Medio',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Plan de gobierno electrónico en ejecución'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM11: Acciones GE actualizado';
    
    -- ========================================================================
    -- COM12: Diagnóstico de Recursos y Servicios de TI
    -- ========================================================================
    UPDATE com12_drsp SET
        tiene_diagnostico = true,
        fecha_diagnostico = '2024-10-15',
        total_servidores = 12,
        servidores_virtuales = 8,
        total_equipos = 145,
        total_aplicaciones = 32,
        licencias_software = 200,
        personal_ti = 8,
        presupuesto_ti_anual = 450000,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Diagnóstico completo de infraestructura TI'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM12: Diagnóstico Recursos actualizado';
    
    -- ========================================================================
    -- COM13: Plan de Continuidad de Operaciones
    -- ========================================================================
    UPDATE com13_pcpide SET
        tiene_plan_continuidad = true,
        fecha_aprobacion = '2024-11-05',
        norma_aprobacion = 'Resolución de Gerencia N° 234-2024',
        fecha_ultima_prueba = '2024-11-20',
        resultado_prueba = 'Satisfactorio',
        proxima_prueba = '2025-05-20',
        tiene_backup = true,
        frecuencia_backup = 'Diario',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Plan probado y operativo'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM13: Plan Continuidad actualizado';
    
    -- ========================================================================
    -- COM14: Declaratoria de Obsolescencia y Servicios en Desuso
    -- ========================================================================
    UPDATE com14_doscd SET
        tiene_declaratoria = true,
        fecha_declaratoria = '2024-08-30',
        norma_declaratoria = 'Resolución de Gerencia N° 189-2024',
        sistemas_obsoletos = 5,
        sistemas_migrados = 3,
        sistemas_pendientes = 2,
        plan_migracion = true,
        fecha_plan_migracion = '2024-09-15',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Proceso de modernización en curso'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM14: Declaratoria Obsolescencia actualizado';
    
    -- ========================================================================
    -- COM15: CSIRT - Equipo de Respuesta a Incidentes
    -- ========================================================================
    UPDATE com15_csirt SET
        tiene_csirt = true,
        fecha_constitucion = '2024-06-01',
        miembros_csirt = 4,
        tiene_procedimientos = true,
        incidentes_2024 = 12,
        incidentes_resueltos = 10,
        tiempo_respuesta_promedio = 4.5,
        capacitaciones_realizadas = 3,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'CSIRT operativo con protocolos definidos'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM15: CSIRT actualizado';
    
    -- ========================================================================
    -- COM16: Sistema de Gestión de Seguridad de la Información
    -- ========================================================================
    UPDATE com16_sgsi SET
        tiene_sgsi = true,
        norma_implementada = 'ISO 27001:2013',
        fecha_implementacion = '2024-07-15',
        estado_certificacion = 'En proceso',
        fecha_auditoria = '2024-11-10',
        resultado_auditoria = 'Conforme con observaciones',
        proxima_auditoria = '2025-05-10',
        tiene_politica_seguridad = true,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'SGSI implementado, certificación en trámite'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM16: SGSI actualizado';
    
    -- ========================================================================
    -- COM17: Plan de Transición a IPv6
    -- ========================================================================
    UPDATE com17_ptipv6 SET
        tiene_plan_ipv6 = true,
        fecha_aprobacion = '2024-09-25',
        porcentaje_implementacion = 45.0,
        equipos_compatibles = 32,
        equipos_total = 78,
        servicios_ipv6 = 8,
        fecha_inicio_implementacion = '2024-10-01',
        fecha_fin_estimada = '2025-12-31',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Transición a IPv6 en progreso'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM17: Plan IPv6 actualizado';
    
    -- ========================================================================
    -- COM18: Sistemas de Administración de Puestos de Trabajo
    -- ========================================================================
    UPDATE com18_sapte SET
        tiene_sistema_gestion = true,
        herramienta = 'Active Directory + WSUS',
        equipos_gestionados = 140,
        equipos_total = 145,
        porcentaje_gestion = 96.6,
        tiene_actualizaciones_auto = true,
        tiene_antivirus = true,
        antivirus_actualizado = true,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Gestión centralizada de puestos'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM18: Gestión Puestos actualizado';
    
    -- ========================================================================
    -- COM19: Registro Nacional de Arquitectura Digital
    -- ========================================================================
    UPDATE com19_renad SET
        registrado_renad = true,
        fecha_registro = '2024-10-20',
        codigo_registro = 'RENAD-ATE-2024-001',
        estado_registro = 'Activo',
        fecha_actualizacion = v_fecha_actual - 15,
        proxima_actualizacion = v_fecha_actual + 350,
        documento_arquitectura = true,
        url_documento = 'https://muniate.gob.pe/doc/renad-arquitectura.pdf',
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Registrado en RENAD con arquitectura actualizada'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM19: RENAD actualizado';
    
    -- ========================================================================
    -- COM20: Documento de Servicios y Facturación Electrónica
    -- ========================================================================
    UPDATE com20_dsfpe SET
        tiene_facturacion_electronica = true,
        fecha_implementacion = '2023-08-10',
        proveedor_sistema = 'SUNAT - OSE',
        comprobantes_emitidos_2024 = 45890,
        porcentaje_electronico = 98.5,
        tiene_recepcion_electronica = true,
        proveedores_electronicos = 67,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Facturación electrónica implementada completamente'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM20: Facturación Electrónica actualizada';
    
    -- ========================================================================
    -- COM21: Declaración de Observancia de Gobierno Digital
    -- ========================================================================
    UPDATE com21_dogd SET
        declara_observancia = true,
        fecha_declaracion = '2024-12-01',
        norma_declaracion = 'Resolución de Alcaldía N° 689-2024-MDA',
        periodo_declaracion = '2024',
        cumple_lineamientos = true,
        porcentaje_cumplimiento = 85.5,
        compromisos_cumplidos = 18,
        compromisos_totales = 21,
        etapa_formulario = 'completado',
        estado = 'aprobado',
        observaciones = 'Declaración de observancia presentada - 85.5% cumplimiento'
    WHERE entidad_id = v_entidad_id;
    
    RAISE NOTICE 'COM21: Declaración Observancia actualizada';
    
    RAISE NOTICE '✅ Todos los compromisos actualizados para Municipalidad de Ate';
    
END $$;

-- Verificación final
SELECT 
    'Resumen de Compromisos' as titulo,
    COUNT(*) as total_compromisos,
    SUM(CASE WHEN estado = 'aprobado' THEN 1 ELSE 0 END) as aprobados,
    SUM(CASE WHEN estado = 'bandeja' THEN 1 ELSE 0 END) as en_bandeja
FROM (
    SELECT estado FROM com1_liderg_td WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com2_cgtd WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com4_tdpei WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com5_destrategiad WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com6_mpgobpe WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com7_impd WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com8_ptupa WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com9_imgd WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com10_pnda WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com11_ageop WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com12_drsp WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com13_pcpide WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com14_doscd WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com15_csirt WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com16_sgsi WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com17_ptipv6 WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com18_sapte WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com19_renad WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com20_dsfpe WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
    UNION ALL SELECT estado FROM com21_dogd WHERE entidad_id = '019a99c9-7bd1-7525-b01d-a5a7379ba9fa'
) sub;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
