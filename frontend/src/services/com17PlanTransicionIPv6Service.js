import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5158/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com17PlanTransicionIPv6Service = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com17PlanTransicionIPv6 para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com17PlanTransicionIPv6/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com17PlanTransicionIPv6 encontrado:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com17PlanTransicionIPv6, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com17PlanTransicionIPv6:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com17PlanTransicionIPv6:', data);
      const response = await axios.post(
        `${API_URL}/Com17PlanTransicionIPv6`,
        data,
        getAuthHeader()
      );
      console.log('Com17PlanTransicionIPv6 creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com17PlanTransicionIPv6:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com17PlanTransicionIPv6 con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com17PlanTransicionIPv6/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com17PlanTransicionIPv6 actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com17PlanTransicionIPv6:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com17PlanTransicionIPv6Service;
