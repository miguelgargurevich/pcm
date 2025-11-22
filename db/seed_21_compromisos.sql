-- Script para insertar los 21 compromisos de Gobierno Digital
-- Ejecutar después de crear las tablas principales

-- Eliminar compromisos existentes si los hay (opcional, comentar si no se desea)
-- DELETE FROM compromiso_gobierno_digital WHERE compromiso_id BETWEEN 1 AND 21;

-- Insertar los 21 compromisos
INSERT INTO compromiso_gobierno_digital (
    compromiso_id,
    nombre_compromiso,
    descripcion,
    alcances,
    fecha_inicio,
    fecha_fin,
    estado,
    activo,
    created_at,
    updated_at
) VALUES
-- Compromiso 1
(1, 'Designar al Líder de Gobierno y Transformación Digital', 
 'Designación oficial del responsable de liderar la transformación digital en la entidad',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 2
(2, 'Constituir el Comité de Gobierno y TD (CGTD)',
 'Conformación del comité que supervisará la implementación de gobierno digital',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 3
(3, 'Elaborar el Plan de Gobierno Digital (PGD)',
 'Desarrollo del plan estratégico de gobierno digital institucional',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 4
(4, 'Incorporar TD en el PEI',
 'Integración de la transformación digital en el Plan Estratégico Institucional',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 5
(5, 'Desplegar la Estrategia Digital',
 'Implementación de la estrategia de transformación digital',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 6
(6, 'Migrar a la Plataforma GOB.PE',
 'Migración del portal institucional a la plataforma GOB.PE',
 'nacional,regional,local',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 7
(7, 'Implementar Mesa de Partes Digital',
 'Implementación del sistema de mesa de partes digital',
 'nacional,regional,local',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 8
(8, 'Publicar el TUPA en GOB.PE',
 'Publicación del Texto Único de Procedimientos Administrativos en GOB.PE',
 'nacional,regional,local',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 9
(9, 'Implementar el Modelo de Gestión Documental (MGD)',
 'Implementación del modelo de gestión documental institucional',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 10
(10, 'Publicar Datos Abiertos (PNDA)',
 'Publicación de datos abiertos en la Plataforma Nacional de Datos Abiertos',
 'nacional,regional,local',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 11
(11, 'Aportar a GEO PERÚ',
 'Contribución con información geoespacial a la plataforma GEO PERÚ',
 'nacional,regional,local',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 12
(12, 'Designar Responsable de Software Público',
 'Designación del responsable de gestionar software público',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 13
(13, 'Publicar/Consumir servicios de la PIDE',
 'Integración con la Plataforma de Interoperabilidad del Estado',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 14
(14, 'Designar al Oficial de Seguridad y Confianza Digital (OSCD/CISO)',
 'Designación del oficial responsable de seguridad digital',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 15
(15, 'Conformar el CSIRT institucional',
 'Conformación del Equipo de Respuesta ante Incidentes de Seguridad',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 16
(16, 'Implementar el SGSI (ISO 27001)',
 'Implementación del Sistema de Gestión de Seguridad de la Información',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 17
(17, 'Formular Plan de Transición a IPv6',
 'Elaboración del plan de migración al protocolo IPv6',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 18
(18, 'Solicitar acceso al Portal de Transparencia Estándar (PTE)',
 'Solicitud de acceso al portal de transparencia estándar',
 'nacional,regional,local',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 19
(19, 'Responder la ENAD',
 'Respuesta a la Encuesta Nacional de Activos Digitales',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 20
(20, 'Digitalizar servicios con Facilita Perú',
 'Digitalización de servicios a través de la plataforma Facilita Perú',
 'nacional,regional,local',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL),

-- Compromiso 21
(21, 'Designar al Oficial de Gobierno de Datos (OGD)',
 'Designación del oficial responsable de gobierno de datos',
 'nacional,regional,local,sectorial',
 '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP, NULL)

ON CONFLICT (compromiso_id) DO UPDATE SET
    nombre_compromiso = EXCLUDED.nombre_compromiso,
    descripcion = EXCLUDED.descripcion,
    alcances = EXCLUDED.alcances,
    fecha_inicio = EXCLUDED.fecha_inicio,
    fecha_fin = EXCLUDED.fecha_fin,
    updated_at = CURRENT_TIMESTAMP;

-- Verificar la inserción
SELECT compromiso_id, nombre_compromiso, activo 
FROM compromiso_gobierno_digital 
WHERE compromiso_id BETWEEN 1 AND 21
ORDER BY compromiso_id;
