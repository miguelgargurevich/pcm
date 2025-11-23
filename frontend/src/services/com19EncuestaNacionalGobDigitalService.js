import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5158/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com19EncuestaNacionalGobDigitalService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com19EncuestaNacionalGobDigital para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com19EncuestaNacionalGobDigital/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com19EncuestaNacionalGobDigital encontrado:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com19EncuestaNacionalGobDigital, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com19EncuestaNacionalGobDigital:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com19EncuestaNacionalGobDigital:', data);
      const response = await axios.post(
        `${API_URL}/Com19EncuestaNacionalGobDigital`,
        data,
        getAuthHeader()
      );
      console.log('Com19EncuestaNacionalGobDigital creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com19EncuestaNacionalGobDigital:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com19EncuestaNacionalGobDigital con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com19EncuestaNacionalGobDigital/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com19EncuestaNacionalGobDigital actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com19EncuestaNacionalGobDigital:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com19EncuestaNacionalGobDigitalService;
