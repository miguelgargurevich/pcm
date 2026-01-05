import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5165/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com15CSIRTInstitucionalService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com15CSIRTInstitucional para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com15CSIRTInstitucional/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com15CSIRTInstitucional encontrado:', response.data);
      // La API devuelve { isSuccess, data, message }, extraer data directamente
      return { isSuccess: true, data: response.data?.data || response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com15CSIRTInstitucional, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com15CSIRTInstitucional:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com15CSIRTInstitucional:', data);
      const response = await axios.post(
        `${API_URL}/Com15CSIRTInstitucional`,
        data,
        getAuthHeader()
      );
      console.log('Com15CSIRTInstitucional creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com15CSIRTInstitucional:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com15CSIRTInstitucional con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com15CSIRTInstitucional/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com15CSIRTInstitucional actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com15CSIRTInstitucional:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com15CSIRTInstitucionalService;
