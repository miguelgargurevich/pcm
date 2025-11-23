import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5190/api';

const com8PublicacionTUPAService = {
  /**
   * Obtiene el registro de Compromiso 8 (Publicación TUPA) por entidad
   * @param {number} compromisoId - ID del compromiso (8)
   * @param {string} entidadId - UUID de la entidad
   * @returns {Promise} - Promesa con los datos del compromiso
   */
  async getByEntidad(compromisoId, entidadId) {
    try {
      console.log(`🔍 com8PublicacionTUPAService.getByEntidad - Compromiso: ${compromisoId}, Entidad: ${entidadId}`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(
        `${API_URL}/Com8PublicacionTUPA/${compromisoId}/entidad/${entidadId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 com8PublicacionTUPAService.getByEntidad - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com8PublicacionTUPAService.getByEntidad - Error:', error);
      
      if (error.response?.status === 404) {
        return {
          success: true,
          isSuccess: true,
          data: null
        };
      }

      throw error;
    }
  },

  /**
   * Crea un nuevo registro de Compromiso 8 (Publicación TUPA)
   * @param {Object} data - Datos del TUPA
   * @returns {Promise} - Promesa con la respuesta
   */
  async create(data) {
    try {
      console.log('📝 com8PublicacionTUPAService.create - Data:', data);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.post(
        `${API_URL}/Com8PublicacionTUPA`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ com8PublicacionTUPAService.create - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com8PublicacionTUPAService.create - Error:', error);
      throw error;
    }
  },

  /**
   * Actualiza un registro existente de Compromiso 8 (Publicación TUPA)
   * @param {number} id - ID del registro a actualizar
   * @param {Object} data - Datos actualizados
   * @returns {Promise} - Promesa con la respuesta
   */
  async update(id, data) {
    try {
      console.log('📝 com8PublicacionTUPAService.update - ID:', id, 'Data:', data);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.put(
        `${API_URL}/Com8PublicacionTUPA/${id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ com8PublicacionTUPAService.update - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com8PublicacionTUPAService.update - Error:', error);
      throw error;
    }
  }
};

export default com8PublicacionTUPAService;
