import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5190/api';

const com4PEIService = {
  /**
   * Obtiene el registro de Compromiso 4 (PEI) por entidad
   * @param {number} compromisoId - ID del compromiso (4)
   * @param {string} entidadId - UUID de la entidad
   * @returns {Promise} - Promesa con los datos del compromiso
   */
  async getByEntidad(compromisoId, entidadId) {
    try {
      console.log(`🔍 com4PEIService.getByEntidad - Compromiso: ${compromisoId}, Entidad: ${entidadId}`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(
        `${API_URL}/Com4PEI/${compromisoId}/entidad/${entidadId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 com4PEIService.getByEntidad - Response:', response.data);

      // Normalizar respuesta según estructura Result<T>
      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com4PEIService.getByEntidad - Error:', error);
      
      if (error.response?.status === 404) {
        return {
          success: true,
          data: null
        };
      }

      throw error;
    }
  },

  /**
   * Crea un nuevo registro de Compromiso 4 (PEI)
   * @param {Object} data - Datos del PEI
   * @returns {Promise} - Promesa con la respuesta
   */
  async create(data) {
    try {
      console.log('📝 com4PEIService.create - Data:', data);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.post(
        `${API_URL}/Com4PEI`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ com4PEIService.create - Response:', response.data);

      // Normalizar respuesta
      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com4PEIService.create - Error:', error);
      throw error;
    }
  },

  /**
   * Actualiza un registro existente de Compromiso 4 (PEI)
   * @param {number} id - ID del registro a actualizar
   * @param {Object} data - Datos actualizados
   * @returns {Promise} - Promesa con la respuesta
   */
  async update(id, data) {
    try {
      console.log(`🔄 com4PEIService.update - ID: ${id}, Data:`, data);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.put(
        `${API_URL}/Com4PEI/${id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ com4PEIService.update - Response:', response.data);

      // Normalizar respuesta
      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com4PEIService.update - Error:', error);
      throw error;
    }
  }
};

export default com4PEIService;
