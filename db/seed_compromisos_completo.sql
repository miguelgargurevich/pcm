-- Script para insertar los 21 compromisos en la tabla compromiso_gobierno_digital
-- Esta es la tabla correcta que usa el sistema

-- Eliminar compromisos existentes si los hay (opcional)
-- DELETE FROM alcance_compromisos WHERE compromiso_id BETWEEN 1 AND 21;
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
    created_at
) VALUES
-- Compromiso 1
(1, 'Designar al Líder de Gobierno y Transformación Digital', 
 'Designación oficial del responsable de liderar la transformación digital en la entidad',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 2
(2, 'Constituir el Comité de Gobierno y TD (CGTD)',
 'Conformación del comité que supervisará la implementación de gobierno digital',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 3
(3, 'Elaborar el Plan de Gobierno Digital (PGD)',
 'Desarrollo del plan estratégico de gobierno digital institucional',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 4
(4, 'Incorporar TD en el PEI',
 'Integración de la transformación digital en el Plan Estratégico Institucional',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 5
(5, 'Desplegar la Estrategia Digital',
 'Implementación de la estrategia de transformación digital',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 6
(6, 'Migrar a la Plataforma GOB.PE',
 'Migración del portal institucional a la plataforma GOB.PE',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 7
(7, 'Implementar Mesa de Partes Digital',
 'Implementación del sistema de mesa de partes digital',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 8
(8, 'Publicar el TUPA en GOB.PE',
 'Publicación del Texto Único de Procedimientos Administrativos en GOB.PE',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 9
(9, 'Implementar el Modelo de Gestión Documental (MGD)',
 'Implementación del modelo de gestión documental institucional',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 10
(10, 'Publicar Datos Abiertos (PNDA)',
 'Publicación de datos abiertos en la Plataforma Nacional de Datos Abiertos',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 11
(11, 'Aportar a GEO PERÚ',
 'Contribución con información geoespacial a la plataforma GEO PERÚ',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 12
(12, 'Designar Responsable de Software Público',
 'Designación del responsable de gestionar software público',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 13
(13, 'Publicar/Consumir servicios de la PIDE',
 'Integración con la Plataforma de Interoperabilidad del Estado',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 14
(14, 'Designar al Oficial de Seguridad y Confianza Digital (OSCD/CISO)',
 'Designación del oficial responsable de seguridad digital',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 15
(15, 'Conformar el CSIRT institucional',
 'Conformación del Equipo de Respuesta ante Incidentes de Seguridad',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 16
(16, 'Implementar el SGSI (ISO 27001)',
 'Implementación del Sistema de Gestión de Seguridad de la Información',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 17
(17, 'Formular Plan de Transición a IPv6',
 'Elaboración del plan de migración al protocolo IPv6',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 18
(18, 'Solicitar acceso al Portal de Transparencia Estándar (PTE)',
 'Solicitud de acceso al portal de transparencia estándar',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 19
(19, 'Responder la ENAD',
 'Respuesta a la Encuesta Nacional de Activos Digitales',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 20
(20, 'Digitalizar servicios con Facilita Perú',
 'Digitalización de servicios a través de la plataforma Facilita Perú',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),

-- Compromiso 21
(21, 'Designar al Oficial de Gobierno de Datos (OGD)',
 'Designación del oficial responsable de gobierno de datos',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP)

ON CONFLICT (compromiso_id) DO UPDATE SET
    nombre_compromiso = EXCLUDED.nombre_compromiso,
    descripcion = EXCLUDED.descripcion,
    alcances = EXCLUDED.alcances,
    fecha_inicio = EXCLUDED.fecha_inicio,
    fecha_fin = EXCLUDED.fecha_fin,
    updated_at = CURRENT_TIMESTAMP;

-- Insertar alcances para todos los compromisos (todos tienen alcance nacional, regional y local)
INSERT INTO alcance_compromisos (compromiso_id, clasificacion_id, activo, created_at)
SELECT c.compromiso_id, cl.clasificacion_id, true, CURRENT_TIMESTAMP
FROM compromiso_gobierno_digital c
CROSS JOIN clasificacion cl
WHERE c.compromiso_id BETWEEN 1 AND 21
  AND cl.nombre IN ('Gobierno Nacional', 'Gobierno Regional', 'Gobierno Local')
ON CONFLICT (compromiso_id, clasificacion_id) DO NOTHING;

-- Verificar la inserción
SELECT 
    c.compromiso_id,
    c.nombre_compromiso,
    c.alcances,
    STRING_AGG(cl.nombre, ', ' ORDER BY cl.clasificacion_id) as alcances_tabla,
    c.activo
FROM compromiso_gobierno_digital c
LEFT JOIN alcance_compromisos ac ON c.compromiso_id = ac.compromiso_id AND ac.activo = true
LEFT JOIN clasificacion cl ON ac.clasificacion_id = cl.clasificacion_id
WHERE c.compromiso_id BETWEEN 1 AND 21
GROUP BY c.compromiso_id, c.nombre_compromiso, c.alcances, c.activo
ORDER BY c.compromiso_id;
