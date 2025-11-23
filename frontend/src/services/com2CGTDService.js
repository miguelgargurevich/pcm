import api from './api';

const com2CGTDService = {
  /**
   * Obtiene el registro de Compromiso 2 para una entidad
   * @param {number} compromisoId - ID del compromiso (siempre 2)
   * @param {string} entidadId - GUID de la entidad
   */
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log('🔵 GET /Com2CGTD/' + compromisoId + '/entidad/' + entidadId);
      const response = await api.get(`/Com2CGTD/${compromisoId}/entidad/${entidadId}`);
      console.log('✅ Respuesta getByEntidad:', response.data);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('⚠️ 404 - No existe registro para esta entidad');
        return {
          isSuccess: true,
          data: null // No existe registro aún
        };
      }
      console.error('❌ Error al obtener Com2CGTD:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al cargar los datos'
      };
    }
  },

  /**
   * Crea un nuevo registro de Compromiso 2
   * @param {object} data - Datos del Compromiso 2 incluyendo miembros
   */
  create: async (data) => {
    try {
      console.log('🔵 Enviando petición POST /Com2CGTD con datos:', data);
      const response = await api.post('/Com2CGTD', data);
      console.log('✅ Respuesta exitosa de POST /Com2CGTD:', response.data);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al crear Com2CGTD:', error);
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
   * Actualiza un registro de Compromiso 2
   * @param {number} id - ID del registro
   * @param {object} data - Datos a actualizar incluyendo miembros
   */
  update: async (id, data) => {
    try {
      console.log('🔵 Enviando petición PUT /Com2CGTD/' + id + ' con datos:', data);
      const response = await api.put(`/Com2CGTD/${id}`, data);
      console.log('✅ Respuesta completa de PUT /Com2CGTD:', response.data);
      
      // El backend devuelve Result<Com2CGTDResponse>, necesitamos extraer el objeto
      const actualData = response.data.data || response.data.Data || response.data;
      console.log('📦 Objeto extraído:', actualData);
      
      return {
        isSuccess: true,
        data: actualData
      };
    } catch (error) {
      console.error('❌ Error al actualizar Com2CGTD:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al actualizar el registro'
      };
    }
  }
};

export default com2CGTDService;
