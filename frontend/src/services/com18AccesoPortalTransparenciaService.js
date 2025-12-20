import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com18AccesoPortalTransparenciaService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com18AccesoPortalTransparencia para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com18AccesoPortalTransparencia/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com18AccesoPortalTransparencia encontrado:', response.data);
      // La API devuelve { isSuccess, data, message }, extraer data directamente
      return { isSuccess: true, data: response.data?.data || response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com18AccesoPortalTransparencia, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com18AccesoPortalTransparencia:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com18AccesoPortalTransparencia:', data);
      const response = await axios.post(
        `${API_URL}/Com18AccesoPortalTransparencia`,
        data,
        getAuthHeader()
      );
      console.log('Com18AccesoPortalTransparencia creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com18AccesoPortalTransparencia:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com18AccesoPortalTransparencia con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com18AccesoPortalTransparencia/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com18AccesoPortalTransparencia actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com18AccesoPortalTransparencia:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com18AccesoPortalTransparenciaService;
