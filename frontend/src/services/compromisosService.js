import api from './api';

export const compromisosService = {
  // Obtener todos los compromisos
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.nombre) params.append('nombre', filters.nombre);
    if (filters.alcance) params.append('alcance', filters.alcance);
    if (filters.estado) params.append('estado', filters.estado);
    
    const response = await api.get(`/CompromisoGobiernoDigital?${params.toString()}`);
    return response.data;
  },

  // Obtener un compromiso por ID
  async getById(id) {
    const response = await api.get(`/CompromisoGobiernoDigital/${id}`);
    return response.data;
  },

  // Crear un nuevo compromiso
  async create(compromisoData) {
    const response = await api.post('/CompromisoGobiernoDigital', compromisoData);
    return response.data;
  },

  // Actualizar un compromiso
  async update(id, compromisoData) {
    const response = await api.put(`/CompromisoGobiernoDigital/${id}`, compromisoData);
    return response.data;
  },

  // Eliminar un compromiso
  async delete(id) {
    const response = await api.delete(`/CompromisoGobiernoDigital/${id}`);
    return response.data;
  },
};
