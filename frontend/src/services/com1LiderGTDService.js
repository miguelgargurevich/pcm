import api from './api';

const com1LiderGTDService = {
  /**
   * Obtiene el registro de Compromiso 1 para una entidad
   * @param {number} compromisoId - ID del compromiso (siempre 1)
   * @param {string} entidadId - GUID de la entidad
   */
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      const response = await api.get(`/Com1LiderGTD/${compromisoId}/entidad/${entidadId}`);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          isSuccess: true,
          data: null // No existe registro aún
        };
      }
      console.error('Error al obtener Com1LiderGTD:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al cargar los datos'
      };
    }
  },

  /**
   * Crea un nuevo registro de Compromiso 1
   * @param {object} data - Datos del Compromiso 1
   */
  create: async (data) => {
    try {
      console.log('🔵 Enviando petición POST /Com1LiderGTD con datos:', data);
      const response = await api.post('/Com1LiderGTD', data);
      console.log('✅ Respuesta exitosa de POST /Com1LiderGTD:', response.data);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al crear Com1LiderGTD:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al crear el registro'
      };
    }
  },

  /**
   * Actualiza un registro de Compromiso 1
   * @param {number} id - ID del registro
   * @param {object} data - Datos a actualizar
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`/Com1LiderGTD/${id}`, data);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al actualizar Com1LiderGTD:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al actualizar el registro'
      };
    }
  }
};

export default com1LiderGTDService;
