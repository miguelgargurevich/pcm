import api from './api';

export const dashboardService = {
  async getStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  },
  
  async getRecentActivity() {
    try {
      const response = await api.get('/CumplimientoHistorial', {
        params: {
          page: 1,
          pageSize: 10,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividad reciente:', error);
      throw error;
    }
  },
  
  async getCompromisosStats() {
    try {
      // Obtener el usuario del localStorage para extraer entidadId
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const entidadId = user.entidadId;
      
      console.log('📡 getCompromisosStats - Usuario:', user);
      console.log('📡 getCompromisosStats - EntidadId:', entidadId);
      
      // Si el usuario tiene entidadId, filtramos por ese campo
      const params = entidadId ? { entidadId } : {};
      
      console.log('📡 getCompromisosStats - Params:', params);
      
      const response = await api.get('/CumplimientoNormativo', { params });
      console.log('📡 getCompromisosStats - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de compromisos:', error);
      throw error;
    }
  },
  
  async getEntidadesStats() {
    try {
      const response = await api.get('/dashboard/entidades-stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de entidades:', error);
      throw error;
    }
  },

  async getAllCompromisos() {
    try {
      const response = await api.get('/CompromisoGobiernoDigital');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los compromisos:', error);
      throw error;
    }
  }
};
