import api from './api';

export const marcoNormativoService = {
  // Obtener todas las normas
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.tipoNormaId) params.append('tipoNormaId', filters.tipoNormaId);
      if (filters.activo !== undefined) params.append('activo', filters.activo);
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      
      const response = await api.get(`/marconormativo?${params.toString()}`);
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

  // Eliminar una norma (soft delete)
  async delete(id) {
    try {
      const response = await api.delete(`/marconormativo/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al eliminar norma' };
    }
  },

  // Activar/desactivar norma
  async toggleStatus(id) {
    try {
      const response = await api.patch(`/marconormativo/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al cambiar estado' };
    }
  },
};
