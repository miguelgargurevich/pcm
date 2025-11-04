import api from './api';

export const entidadesService = {
  // Obtener todas las entidades
  async getAll() {
    try {
      const response = await api.get('/entidades');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al obtener entidades' };
    }
  },

  // Obtener una entidad por ID
  async getById(id) {
    try {
      const response = await api.get(`/entidades/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al obtener entidad' };
    }
  },

  // Crear una nueva entidad
  async create(entidadData) {
    try {
      const response = await api.post('/entidades', entidadData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al crear entidad' };
    }
  },

  // Actualizar una entidad
  async update(id, entidadData) {
    try {
      const response = await api.put(`/entidades/${id}`, entidadData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al actualizar entidad' };
    }
  },

  // Eliminar una entidad (desactivar)
  async delete(id) {
    try {
      const response = await api.delete(`/entidades/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al eliminar entidad' };
    }
  },
};
