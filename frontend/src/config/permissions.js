// Configuración de permisos por perfil
export const PERFILES = {
  ADMINISTRADOR_PCM: 1,
  ENTIDAD: 2,
  OPERADOR_PCM: 3,
  INVITADO: 4
};

export const MODULOS = {
  USUARIOS: 'usuarios',
  ENTIDADES: 'entidades',
  MARCO_NORMATIVO: 'marco_normativo',
  COMPROMISOS: 'compromisos',
  CUMPLIMIENTO: 'cumplimiento',
  SEGUIMIENTO: 'seguimiento',
  EVALUACION: 'evaluacion',
  REPORTES: 'reportes'
};

export const TIPOS_ACCESO = {
  TOTAL: 'T',
  CONSULTA: 'C',
  SIN_ACCESO: 'N'
};

/**
 * Verifica si un usuario tiene acceso a un módulo
 * @param {object} permisos - Objeto con los permisos del usuario
 * @param {string} codigoModulo - Código del módulo
 * @returns {boolean}
 */
export const tieneAcceso = (permisos, codigoModulo) => {
  if (!permisos || !permisos.length) return false;
  const permiso = permisos.find(p => p.codigoModulo === codigoModulo);
  return permiso && permiso.tipoAcceso !== TIPOS_ACCESO.SIN_ACCESO;
};

/**
 * Verifica si un usuario tiene acceso total (puede editar)
 * @param {object} permisos - Objeto con los permisos del usuario
 * @param {string} codigoModulo - Código del módulo
 * @returns {boolean}
 */
export const tienePermisoTotal = (permisos, codigoModulo) => {
  if (!permisos || !permisos.length) return false;
  const permiso = permisos.find(p => p.codigoModulo === codigoModulo);
  return permiso && permiso.tipoAcceso === TIPOS_ACCESO.TOTAL;
};

/**
 * Verifica si un usuario solo tiene acceso de consulta
 * @param {object} permisos - Objeto con los permisos del usuario
 * @param {string} codigoModulo - Código del módulo
 * @returns {boolean}
 */
export const soloConsulta = (permisos, codigoModulo) => {
  if (!permisos || !permisos.length) return false;
  const permiso = permisos.find(p => p.codigoModulo === codigoModulo);
  return permiso && permiso.tipoAcceso === TIPOS_ACCESO.CONSULTA;
};

/**
 * Verifica si puede realizar una acción específica
 * @param {object} permisos - Objeto con los permisos del usuario
 * @param {string} codigoModulo - Código del módulo
 * @param {string} accion - 'crear', 'editar', 'eliminar', 'consultar'
 * @returns {boolean}
 */
export const puedeRealizarAccion = (permisos, codigoModulo, accion) => {
  if (!permisos || !permisos.length) return false;
  const permiso = permisos.find(p => p.codigoModulo === codigoModulo);
  if (!permiso) return false;

  switch (accion.toLowerCase()) {
    case 'crear':
      return permiso.puedeCrear;
    case 'editar':
      return permiso.puedeEditar;
    case 'eliminar':
      return permiso.puedeEliminar;
    case 'consultar':
      return permiso.puedeConsultar;
    default:
      return false;
  }
};

/**
 * Obtiene el permiso completo de un módulo
 * @param {object} permisos - Objeto con los permisos del usuario
 * @param {string} codigoModulo - Código del módulo
 * @returns {object|null}
 */
export const getPermiso = (permisos, codigoModulo) => {
  if (!permisos || !permisos.length) return null;
  return permisos.find(p => p.codigoModulo === codigoModulo) || null;
};

/**
 * Filtra los módulos del menú según los permisos del usuario
 * @param {array} menuItems - Items del menú
 * @param {object} permisos - Permisos del usuario
 * @returns {array}
 */
export const filtrarMenuPorPermisos = (menuItems, permisos) => {
  if (!permisos || !permisos.length) return [];
  
  return menuItems.filter(item => {
    const permiso = permisos.find(p => p.rutaModulo === item.path);
    return permiso && permiso.tipoAcceso !== TIPOS_ACCESO.SIN_ACCESO;
  });
};
