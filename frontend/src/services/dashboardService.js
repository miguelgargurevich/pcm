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
      const response = await api.get('/CumplimientoNormativo');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de compromisos:', error);
      throw error;
    }
  }
};
