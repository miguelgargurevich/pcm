-- Script para LOCAL: Actualizar permisos para igualar a PRODUCCIÓN
-- Extraído de PRODUCCION_migration_permisos_perfiles.sql

-- =====================================================
-- 4. INSERTAR MÓDULOS DEL SISTEMA
-- =====================================================
INSERT INTO permisos_modulos (codigo, nombre, descripcion, ruta, icono, orden) VALUES
('usuarios', 'Gestionar Usuarios', 'Administración de usuarios del sistema', '/dashboard/usuarios', 'Users', 1),
('entidades', 'Gestionar Entidades', 'Gestión de entidades públicas', '/dashboard/entidades', 'Building2', 2),
('marco_normativo', 'Gestionar Marco Normativo', 'Catálogo de normas y regulaciones', '/dashboard/marco-normativo', 'FileText', 3),
('compromisos', 'Gestionar Compromisos G.D.', 'Compromisos de Gobierno Digital', '/dashboard/compromisos', 'CheckSquare', 4),
('cumplimiento', 'Cumplimiento Normativo', 'Registro de cumplimiento normativo', '/dashboard/cumplimiento', 'ClipboardCheck', 5),
('seguimiento', 'Seguimiento PGD - PP', 'Seguimiento de planes y programas', '/dashboard/seguimiento', 'TrendingUp', 6),
('evaluacion', 'Evaluación & Cumplimiento', 'Evaluación de cumplimiento', '/dashboard/evaluacion', 'BarChart3', 7),
('reportes', 'Consultas & Reportes', 'Generación de reportes y consultas', '/dashboard/reportes', 'Search', 8)
ON CONFLICT (codigo) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden;

-- =====================================================
-- 5. CONFIGURAR PERMISOS POR PERFIL
-- =====================================================

-- 5.1 PERFIL: ADMINISTRADOR PCM (perfil_id = 1)
-- Acceso Total (T) a todos los módulos EXCEPTO cumplimiento (N)
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    1 as perfil_id,
    pm.permiso_modulo_id,
    CASE 
        WHEN pm.codigo = 'cumplimiento' THEN 'N'
        ELSE 'T'
    END as tipo_acceso,
    CASE WHEN pm.codigo = 'cumplimiento' THEN false ELSE true END as puede_crear,
    CASE WHEN pm.codigo = 'cumplimiento' THEN false ELSE true END as puede_editar,
    CASE WHEN pm.codigo = 'cumplimiento' THEN false ELSE true END as puede_eliminar,
    CASE WHEN pm.codigo = 'cumplimiento' THEN false ELSE true END as puede_consultar
FROM permisos_modulos pm
ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
    tipo_acceso = EXCLUDED.tipo_acceso,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar,
    puede_consultar = EXCLUDED.puede_consultar,
    updated_at = NOW();

-- 5.2 PERFIL: ENTIDAD (perfil_id = 2)
-- Acceso Total (T) solo a cumplimiento
-- Consulta (C) a marco_normativo y compromisos
-- Sin acceso (N) al resto
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    2 as perfil_id,
    pm.permiso_modulo_id,
    CASE 
        WHEN pm.codigo = 'cumplimiento' THEN 'T'
        WHEN pm.codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN pm.codigo = 'cumplimiento' THEN true ELSE false END as puede_crear,
    CASE WHEN pm.codigo = 'cumplimiento' THEN true ELSE false END as puede_editar,
    CASE WHEN pm.codigo = 'cumplimiento' THEN true ELSE false END as puede_eliminar,
    CASE WHEN pm.codigo IN ('cumplimiento', 'marco_normativo', 'compromisos') THEN true ELSE false END as puede_consultar
FROM permisos_modulos pm
ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
    tipo_acceso = EXCLUDED.tipo_acceso,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar,
    puede_consultar = EXCLUDED.puede_consultar,
    updated_at = NOW();

-- 5.3 PERFIL: OPERADOR PCM (perfil_id = 3)
-- Acceso Total (T) a seguimiento, evaluacion, reportes
-- Consulta (C) a marco_normativo y compromisos
-- Sin acceso (N) al resto
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    3 as perfil_id,
    pm.permiso_modulo_id,
    CASE 
        WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN 'T'
        WHEN pm.codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_crear,
    CASE WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_editar,
    CASE WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_eliminar,
    CASE WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes', 'marco_normativo', 'compromisos') THEN true ELSE false END as puede_consultar
FROM permisos_modulos pm
ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
    tipo_acceso = EXCLUDED.tipo_acceso,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar,
    puede_consultar = EXCLUDED.puede_consultar,
    updated_at = NOW();

-- 5.4 PERFIL: INVITADO/CONSULTA (perfil_id = 4)
-- Acceso Total (T) solo a reportes
-- Consulta (C) a marco_normativo y compromisos
-- Sin acceso (N) al resto
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    4 as perfil_id,
    pm.permiso_modulo_id,
    CASE 
        WHEN pm.codigo = 'reportes' THEN 'T'
        WHEN pm.codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN pm.codigo = 'reportes' THEN true ELSE false END as puede_crear,
    CASE WHEN pm.codigo = 'reportes' THEN true ELSE false END as puede_editar,
    CASE WHEN pm.codigo = 'reportes' THEN true ELSE false END as puede_eliminar,
    CASE WHEN pm.codigo IN ('reportes', 'marco_normativo', 'compromisos') THEN true ELSE false END as puede_consultar
FROM permisos_modulos pm
ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
    tipo_acceso = EXCLUDED.tipo_acceso,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar,
    puede_consultar = EXCLUDED.puede_consultar,
    updated_at = NOW();
