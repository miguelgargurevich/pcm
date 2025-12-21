-- Script para agregar el módulo de Historial de Cumplimiento
-- Ejecutar en Supabase o base de datos local

-- 1. Insertar el nuevo módulo en permisos_modulos
INSERT INTO permisos_modulos (codigo, nombre, descripcion, ruta, icono, orden, activo)
VALUES (
    'historial_cumplimiento',
    'Historial de Cambios',
    'Visor de historial de cambios de estado y snapshots de cumplimiento',
    '/dashboard/historial',
    'History',
    9,
    true
)
ON CONFLICT (codigo) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    activo = EXCLUDED.activo;

-- 2. Obtener el ID del módulo recién insertado
DO $$
DECLARE
    v_modulo_id bigint;
BEGIN
    SELECT permiso_modulo_id INTO v_modulo_id 
    FROM permisos_modulos 
    WHERE codigo = 'historial_cumplimiento';

    -- 3. Asignar acceso TOTAL a todos los perfiles existentes
    INSERT INTO permisos_perfiles (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_ver, activo)
    SELECT 
        p.perfil_id,
        v_modulo_id,
        'T', -- Acceso Total
        true,
        true,
        true,
        true,
        true
    FROM perfiles p
    WHERE p.activo = true
    ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
        tipo_acceso = 'T',
        puede_ver = true,
        activo = true;

    RAISE NOTICE 'Módulo historial_cumplimiento agregado con ID: % y asignado a todos los perfiles', v_modulo_id;
END $$;

-- Verificar
SELECT 
    pm.codigo,
    pm.nombre,
    pm.ruta,
    COUNT(pp.perfil_id) as perfiles_con_acceso
FROM permisos_modulos pm
LEFT JOIN permisos_perfiles pp ON pm.permiso_modulo_id = pp.permiso_modulo_id AND pp.activo = true
WHERE pm.codigo = 'historial_cumplimiento'
GROUP BY pm.codigo, pm.nombre, pm.ruta;
