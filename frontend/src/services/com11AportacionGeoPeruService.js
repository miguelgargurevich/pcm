import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5165/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com11AportacionGeoPeruService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com11AportacionGeoPeru para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com11AportacionGeoPeru/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com11AportacionGeoPeru respuesta completa:', response.data);
      // El backend devuelve { isSuccess, data }, así que retornamos response.data directamente
      // o extraemos response.data.data si viene anidado
      const backendResponse = response.data;
      if (backendResponse && backendResponse.isSuccess !== undefined) {
        // El backend ya devuelve { isSuccess, data }
        return backendResponse;
      }
      return { isSuccess: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com11AportacionGeoPeru, retornando null');
        return { isSuccess: true, data: null };
      }
      // Si es un error del backend con mensaje
      if (error.response?.data) {
        console.log('Error del backend:', error.response.data);
        return error.response.data;
      }
      console.error('Error al obtener Com11AportacionGeoPeru:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com11AportacionGeoPeru:', data);
      const response = await axios.post(
        `${API_URL}/Com11AportacionGeoPeru`,
        data,
        getAuthHeader()
      );
      console.log('Com11AportacionGeoPeru creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com11AportacionGeoPeru:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com11AportacionGeoPeru con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com11AportacionGeoPeru/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com11AportacionGeoPeru actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com11AportacionGeoPeru:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com11AportacionGeoPeruService;
