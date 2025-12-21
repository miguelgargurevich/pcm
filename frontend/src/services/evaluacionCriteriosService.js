import api from './api';

/**
 * Servicio para gestionar las evaluaciones de criterios por entidad y compromiso.
 * Los criterios se guardan en la tabla evaluacion_respuestas_entidad.
 */
const evaluacionCriteriosService = {
  /**
   * Obtiene los criterios evaluados de una entidad para un compromiso específico.
   * @param {string} entidadId - UUID de la entidad
   * @param {number} compromisoId - ID del compromiso (1-21)
   * @returns {Promise} Response con los criterios y sus respuestas
   */
  async getCriterios(entidadId, compromisoId) {
    try {
      console.log(`📥 GET /evaluacioncriterios/${entidadId}/${compromisoId}`);
      const response = await api.get(`/evaluacioncriterios/${entidadId}/${compromisoId}`);
      console.log('✅ Criterios obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener criterios:', error);
      throw error;
    }
  },

  /**
   * Guarda o actualiza los criterios evaluados de una entidad para un compromiso.
   * @param {string} entidadId - UUID de la entidad
   * @param {number} compromisoId - ID del compromiso (1-21)
   * @param {Array} criterios - Array de { criterioId, cumple }
   * @returns {Promise} Response con el resultado de la operación
   */
  async saveCriterios(entidadId, compromisoId, criterios) {
    try {
      console.log(`📤 POST /evaluacioncriterios - EntidadId: ${entidadId}, CompromisoId: ${compromisoId}`);
      console.log('📋 Criterios a guardar:', criterios);
      
      const payload = {
        entidadId,
        compromisoId,
        criterios: criterios.map(c => ({
          criterioId: parseInt(c.criterioId || c.criterioEvaluacionId),
          cumple: Boolean(c.cumple)
        }))
      };
      
      const response = await api.post('/evaluacioncriterios', payload);
      console.log('✅ Criterios guardados:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al guardar criterios:', error);
      throw error;
    }
  },

  /**
   * Convierte los criterios del formato de la API al formato del formData del frontend.
   * @param {Object} apiResponse - Response de getCriterios
   * @returns {Array} Array de { criterioId, cumple } para el formData
   */
  convertToFormDataFormat(apiResponse) {
    if (!apiResponse?.data?.criterios) return [];
    
    return apiResponse.data.criterios
      .filter(c => c.cumple) // Solo los que cumplen
      .map(c => ({
        criterioId: c.criterioEvaluacionId,
        cumple: c.cumple
      }));
  },

  /**
   * Convierte los criterios del formato del formData al formato esperado por la API.
   * @param {Array} formDataCriterios - Array de { criterioId, cumple } del formData
   * @param {Array} allCriterios - Todos los criterios disponibles del catálogo
   * @returns {Array} Array completo con todos los criterios y su estado
   */
  convertFromFormDataFormat(formDataCriterios, allCriterios) {
    const criteriosMap = new Map(
      (formDataCriterios || []).map(c => [parseInt(c.criterioId), c.cumple])
    );
    
    return allCriterios.map(criterio => ({
      criterioId: criterio.criterioEvaluacionId,
      cumple: criteriosMap.get(criterio.criterioEvaluacionId) ?? false
    }));
  }
};

export default evaluacionCriteriosService;
