import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';

const com7ImplementacionMPDService = {
  /**
   * Obtiene el registro de Compromiso 7 (Implementación MPD) por entidad
   * @param {number} compromisoId - ID del compromiso (7)
   * @param {string} entidadId - UUID de la entidad
   * @returns {Promise} - Promesa con los datos del compromiso
   */
  async getByEntidad(compromisoId, entidadId) {
    try {
      console.log(`🔍 com7ImplementacionMPDService.getByEntidad - Compromiso: ${compromisoId}, Entidad: ${entidadId}`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(
        `${API_URL}/Com7ImplementacionMPD/${compromisoId}/entidad/${entidadId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 com7ImplementacionMPDService.getByEntidad - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com7ImplementacionMPDService.getByEntidad - Error:', error);
      
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
   * Crea un nuevo registro de Compromiso 7 (Implementación MPD)
   * @param {Object} data - Datos de la implementación
   * @returns {Promise} - Promesa con la respuesta
   */
  async create(data) {
    try {
      console.log('📝 com7ImplementacionMPDService.create - Data:', data);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.post(
        `${API_URL}/Com7ImplementacionMPD`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ com7ImplementacionMPDService.create - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com7ImplementacionMPDService.create - Error:', error);
      throw error;
    }
  },

  /**
   * Actualiza un registro existente de Compromiso 7 (Implementación MPD)
   * @param {number} id - ID del registro a actualizar
   * @param {Object} data - Datos actualizados
   * @returns {Promise} - Promesa con la respuesta
   */
  async update(id, data) {
    try {
      console.log('📝 com7ImplementacionMPDService.update - ID:', id, 'Data:', data);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.put(
        `${API_URL}/Com7ImplementacionMPD/${id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ com7ImplementacionMPDService.update - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com7ImplementacionMPDService.update - Error:', error);
      throw error;
    }
  }
};

export default com7ImplementacionMPDService;
