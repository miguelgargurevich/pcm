import api from './api';

export const catalogosService = {
  getNivelesGobierno: async () => {
    try {
      const response = await api.get('/catalogos/niveles-gobierno');
      return response.data;
    } catch (error) {
      console.error('Error al obtener niveles de gobierno:', error);
      throw error;
    }
  },

  getSectores: async () => {
    try {
      const response = await api.get('/catalogos/sectores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sectores:', error);
      throw error;
    }
  },

  getClasificaciones: async () => {
    try {
      const response = await api.get('/catalogos/clasificaciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clasificaciones:', error);
      throw error;
    }
  },

  getPerfiles: async () => {
    try {
      const response = await api.get('/catalogos/perfiles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
      throw error;
    }
  },
};
