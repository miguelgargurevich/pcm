import api from './api';

const com1LiderGTDService = {
  /**
   * Obtiene todos los registros de Com1 del usuario actual (por su entidad)
   * Para usar en la lista principal de cumplimientos
   */
  getAllByUser: async () => {
    try {
      // El backend tiene el endpoint GET /Com1LiderGTD que devuelve todos los registros
      // filtrados por la entidad del usuario autenticado (desde JWT)
      console.log('🔵 GET /Com1LiderGTD (all by user)');
      const response = await api.get('/Com1LiderGTD');
      console.log('✅ Respuesta getAllByUser:', response.data);
      return {
        isSuccess: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al obtener Com1LiderGTD (all):', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al cargar los datos'
      };
    }
  },

  /**
   * Obtiene el registro de Compromiso 1 para una entidad
   * @param {number} compromisoId - ID del compromiso (siempre 1)
   * @param {string} entidadId - GUID de la entidad
   */
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log('🔵 GET /Com1LiderGTD/' + compromisoId + '/entidad/' + entidadId);
      const response = await api.get(`/Com1LiderGTD/${compromisoId}/entidad/${entidadId}`);
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
      console.error('❌ Error al obtener Com1LiderGTD:', error);
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
      console.log('🔵 Enviando petición PUT /Com1LiderGTD/' + id + ' con datos:', data);
      const response = await api.put(`/Com1LiderGTD/${id}`, data);
      console.log('✅ Respuesta completa de PUT /Com1LiderGTD:', response.data);
      
      // El backend devuelve Result<Com1LiderGTDResponse>, necesitamos extraer el objeto
      // response.data = { isSuccess: true, data: {...objeto...} }
      const actualData = response.data.data || response.data.Data || response.data;
      console.log('📦 Objeto extraído:', actualData);
      
      return {
        isSuccess: true,
        data: actualData  // Devolver el objeto directo, igual que create
      };
    } catch (error) {
      console.error('❌ Error al actualizar Com1LiderGTD:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al actualizar el registro'
      };
    }
  }
};

export default com1LiderGTDService;
