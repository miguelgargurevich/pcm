import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com16SistemaGestionSeguridadService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com16SistemaGestionSeguridad para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com16SistemaGestionSeguridad/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com16SistemaGestionSeguridad encontrado:', response.data);
      // La API devuelve { isSuccess, data, message }, extraer data directamente
      return { isSuccess: true, data: response.data?.data || response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com16SistemaGestionSeguridad, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com16SistemaGestionSeguridad:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com16SistemaGestionSeguridad:', data);
      const response = await axios.post(
        `${API_URL}/Com16SistemaGestionSeguridad`,
        data,
        getAuthHeader()
      );
      console.log('Com16SistemaGestionSeguridad creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com16SistemaGestionSeguridad:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com16SistemaGestionSeguridad con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com16SistemaGestionSeguridad/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com16SistemaGestionSeguridad actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com16SistemaGestionSeguridad:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com16SistemaGestionSeguridadService;
