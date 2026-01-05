import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5165/api';

const com10IndicadoresCEDAService = {
  /**
   * Obtener lista de indicadores CEDA con su estado
   * @param {number} compndaEntId - ID del registro com10_pnda
   * @returns {Promise}
   */
  getList: async (compndaEntId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/Com10IndicadoresCEDA/list/${compndaEntId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener indicadores CEDA:', error);
      throw error;
    }
  },

  /**
   * Obtener detalle de evaluación de un indicador
   * @param {number} compndaEntId - ID del registro com10_pnda
   * @param {number} indicadorId - ID del indicador
   * @returns {Promise}
   */
  getDetalle: async (compndaEntId, indicadorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/Com10IndicadoresCEDA/detalle/${compndaEntId}/${indicadorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle de indicador CEDA:', error);
      throw error;
    }
  },

  /**
   * Guardar o actualizar evaluación de un indicador
   * @param {Object} data - Datos de la evaluación
   * @returns {Promise}
   */
  save: async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/Com10IndicadoresCEDA/save`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al guardar evaluación CEDA:', error);
      throw error;
    }
  }
};

export default com10IndicadoresCEDAService;
