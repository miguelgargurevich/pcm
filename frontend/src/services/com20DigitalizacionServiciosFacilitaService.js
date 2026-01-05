import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5165/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com20DigitalizacionServiciosFacilitaService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com20DigitalizacionServiciosFacilita para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com20DigitalizacionServiciosFacilita/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com20DigitalizacionServiciosFacilita encontrado:', response.data);
      // La API devuelve { isSuccess, data, message }, extraer data directamente
      return { isSuccess: true, data: response.data?.data || response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com20DigitalizacionServiciosFacilita, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com20DigitalizacionServiciosFacilita:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com20DigitalizacionServiciosFacilita:', data);
      const response = await axios.post(
        `${API_URL}/Com20DigitalizacionServiciosFacilita`,
        data,
        getAuthHeader()
      );
      console.log('Com20DigitalizacionServiciosFacilita creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com20DigitalizacionServiciosFacilita:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com20DigitalizacionServiciosFacilita con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com20DigitalizacionServiciosFacilita/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com20DigitalizacionServiciosFacilita actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com20DigitalizacionServiciosFacilita:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com20DigitalizacionServiciosFacilitaService;
