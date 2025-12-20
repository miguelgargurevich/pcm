import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com14OficialSeguridadDigitalService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com14OficialSeguridadDigital para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com14OficialSeguridadDigital/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com14OficialSeguridadDigital encontrado:', response.data);
      // La API devuelve { isSuccess, data, message }, extraer data directamente
      return { isSuccess: true, data: response.data?.data || response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com14OficialSeguridadDigital, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com14OficialSeguridadDigital:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com14OficialSeguridadDigital:', data);
      const response = await axios.post(
        `${API_URL}/Com14OficialSeguridadDigital`,
        data,
        getAuthHeader()
      );
      console.log('Com14OficialSeguridadDigital creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com14OficialSeguridadDigital:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com14OficialSeguridadDigital con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com14OficialSeguridadDigital/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com14OficialSeguridadDigital actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com14OficialSeguridadDigital:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com14OficialSeguridadDigitalService;
