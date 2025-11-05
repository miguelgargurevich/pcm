import api from './api';

export const ubigeoService = {
  // Obtener todos los departamentos únicos
  getDepartamentos: async () => {
    try {
      const response = await api.get('/ubigeo/departamentos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
      throw error;
    }
  },

  // Obtener provincias por departamento
  getProvincias: async (departamento) => {
    try {
      const response = await api.get(`/ubigeo/provincias/${encodeURIComponent(departamento)}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener provincias:', error);
      throw error;
    }
  },

  // Obtener distritos por departamento y provincia
  getDistritos: async (departamento, provincia) => {
    try {
      const response = await api.get(
        `/ubigeo/distritos/${encodeURIComponent(departamento)}/${encodeURIComponent(provincia)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener distritos:', error);
      throw error;
    }
  },

  // Obtener ubigeo por código
  getByCodigo: async (codigo) => {
    try {
      const response = await api.get(`/ubigeo/codigo/${codigo}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener ubigeo:', error);
      throw error;
    }
  },

  // Buscar ubigeo por departamento, provincia, distrito
  buscar: async (departamento, provincia, distrito) => {
    try {
      const response = await api.get('/ubigeo/buscar', {
        params: { departamento, provincia, distrito }
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar ubigeo:', error);
      throw error;
    }
  },
};
