import api from './api';

export const permisosService = {
  /**
   * Obtener todos los permisos de un perfil
   */
  async getPermisosByPerfil(perfilId) {
    try {
      const response = await api.get(`/permisos/perfil/${perfilId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { isSuccess: false, message: 'Error al obtener permisos' };
    }
  },

  /**
   * Verificar si tiene permiso para un módulo y acción específica
   */
  async verificarPermiso(perfilId, codigoModulo, accion = null) {
    try {
      const params = { perfilId, codigoModulo };
      if (accion) params.accion = accion;
      
      const response = await api.get('/permisos/verificar', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { isSuccess: false, message: 'Error al verificar permiso' };
    }
  }
};
