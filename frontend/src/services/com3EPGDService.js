import api from './api';

const com3EPGDService = {
  /**
   * Obtiene el registro de Compromiso 3 para una entidad
   * @param {string} entidadId - GUID de la entidad
   * @param {number} compromisoId - ID del compromiso (opcional, por defecto 3)
   */
  getByEntidad: async (entidadId, compromisoId = 3) => {
    try {
      console.log('🔵 GET /Com3EPGD/' + compromisoId + '/entidad/' + entidadId);
      const response = await api.get(`/Com3EPGD/${compromisoId}/entidad/${entidadId}`);
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
      console.error('❌ Error al obtener Com3EPGD:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al cargar los datos'
      };
    }
  },

  /**
   * Crea un nuevo registro de Compromiso 3
   * @param {object} data - Datos del Compromiso 3
   */
  create: async (data) => {
    try {
      console.log('🔵 Enviando petición POST /Com3EPGD con datos:', data);
      const response = await api.post('/Com3EPGD', data);
      console.log('✅ Respuesta exitosa de POST /Com3EPGD:', response.data);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al crear Com3EPGD:', error);
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
   * Actualiza un registro de Compromiso 3
   * @param {number} id - ID del registro
   * @param {object} data - Datos a actualizar
   */
  update: async (id, data) => {
    try {
      console.log('🔵 Enviando petición PUT /Com3EPGD/' + id + ' con datos:', data);
      const response = await api.put(`/Com3EPGD/${id}`, data);
      console.log('✅ Respuesta completa de PUT /Com3EPGD:', response.data);
      
      // El backend devuelve Result<Com3EPGDResponse>, necesitamos extraer el objeto
      const actualData = response.data.data || response.data.Data || response.data;
      console.log('📦 Objeto extraído:', actualData);
      
      return {
        isSuccess: true,
        data: actualData
      };
    } catch (error) {
      console.error('❌ Error al actualizar Com3EPGD:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al actualizar el registro'
      };
    }
  }
};

export default com3EPGDService;
