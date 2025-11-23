import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5190/api';

const com6MigracionGobPeService = {
  /**
   * Obtiene el registro de Compromiso 6 (Migración GOB.PE) por entidad
   * @param {number} compromisoId - ID del compromiso (6)
   * @param {string} entidadId - UUID de la entidad
   * @returns {Promise} - Promesa con los datos del compromiso
   */
  async getByEntidad(compromisoId, entidadId) {
    try {
      console.log(`🔍 com6MigracionGobPeService.getByEntidad - Compromiso: ${compromisoId}, Entidad: ${entidadId}`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(
        `${API_URL}/Com6MigracionGobPe/${compromisoId}/entidad/${entidadId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 com6MigracionGobPeService.getByEntidad - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com6MigracionGobPeService.getByEntidad - Error:', error);
      
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
   * Crea un nuevo registro de Compromiso 6 (Migración GOB.PE)
   * @param {Object} data - Datos de la migración
   * @returns {Promise} - Promesa con la respuesta
   */
  async create(data) {
    try {
      console.log('📝 com6MigracionGobPeService.create - Data:', data);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.post(
        `${API_URL}/Com6MigracionGobPe`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ com6MigracionGobPeService.create - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com6MigracionGobPeService.create - Error:', error);
      throw error;
    }
  },

  /**
   * Actualiza un registro existente de Compromiso 6 (Migración GOB.PE)
   * @param {number} id - ID del registro a actualizar
   * @param {Object} data - Datos actualizados
   * @returns {Promise} - Promesa con la respuesta
   */
  async update(id, data) {
    try {
      console.log('📝 com6MigracionGobPeService.update - ID:', id, 'Data:', data);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.put(
        `${API_URL}/Com6MigracionGobPe/${id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ com6MigracionGobPeService.update - Response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          isSuccess: true,
          data: response.data.data
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ com6MigracionGobPeService.update - Error:', error);
      throw error;
    }
  }
};

export default com6MigracionGobPeService;
