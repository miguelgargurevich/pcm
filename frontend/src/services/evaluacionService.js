import api from './api';

const BASE_URL = '/Evaluacion';

export const evaluacionService = {
  /**
   * Obtiene la matriz de evaluación de todas las entidades
   */
  getMatriz: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.entidad) params.append('entidad', filters.entidad);
    if (filters.sectorId) params.append('sectorId', filters.sectorId);
    if (filters.clasificacionId) params.append('clasificacionId', filters.clasificacionId);
    if (filters.compromisoId) params.append('compromisoId', filters.compromisoId);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);

    const queryString = params.toString();
    const url = `${BASE_URL}/matriz${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Obtiene los sectores para filtros
   */
  getSectores: async () => {
    const response = await api.get(`${BASE_URL}/sectores`);
    return response.data;
  },

  /**
   * Obtiene las clasificaciones para filtros
   */
  getClasificaciones: async () => {
    const response = await api.get(`${BASE_URL}/clasificaciones`);
    return response.data;
  },

  /**
   * Obtiene el detalle de un compromiso para una entidad
   */
  getDetalleCompromiso: async (compromisoId, entidadId) => {
    const response = await api.get(`${BASE_URL}/compromiso/${compromisoId}/entidad/${entidadId}`);
    return response.data;
  },

  /**
   * Actualiza el estado PCM de un compromiso
   */
  updateEstadoPCM: async (compromisoId, entidadId, estadoPCM, observaciones = null) => {
    const response = await api.put(
      `${BASE_URL}/compromiso/${compromisoId}/entidad/${entidadId}/estado`,
      { estadoPCM, observaciones }
    );
    return response.data;
  }
};

export default evaluacionService;
