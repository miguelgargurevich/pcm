import api from './api';

export const usuariosService = {
  // Obtener todos los usuarios
  async getAll() {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al obtener usuarios' };
    }
  },

  // Obtener un usuario por ID
  async getById(id) {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al obtener usuario' };
    }
  },

  // Crear un nuevo usuario
  async create(usuarioData) {
    try {
      const response = await api.post('/usuarios', usuarioData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al crear usuario' };
    }
  },

  // Actualizar un usuario
  async update(id, usuarioData) {
    try {
      const response = await api.put(`/usuarios/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al actualizar usuario' };
    }
  },

  // Eliminar un usuario (desactivar)
  async delete(id) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al eliminar usuario' };
    }
  },
};
