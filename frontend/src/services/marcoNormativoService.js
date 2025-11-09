import api from './api';

export const marcoNormativoService = {
  // Obtener todas las normas
  async getAll() {
    try {
      const response = await api.get('/marconormativo');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al obtener normas' };
    }
  },

  // Obtener una norma por ID
  async getById(id) {
    try {
      const response = await api.get(`/marconormativo/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al obtener norma' };
    }
  },

  // Crear una nueva norma
  async create(normaData) {
    try {
      const response = await api.post('/marconormativo', normaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al crear norma' };
    }
  },

  // Actualizar una norma
  async update(id, normaData) {
    try {
      const response = await api.put(`/marconormativo/${id}`, normaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al actualizar norma' };
    }
  },

  // Eliminar una norma (desactivar)
  async delete(id) {
    try {
      const response = await api.delete(`/marconormativo/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al eliminar norma' };
    }
  },
};
