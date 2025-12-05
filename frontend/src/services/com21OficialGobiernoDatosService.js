import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com21OficialGobiernoDatosService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com21OficialGobiernoDatos para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com21OficialGobiernoDatos/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com21OficialGobiernoDatos encontrado:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com21OficialGobiernoDatos, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com21OficialGobiernoDatos:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com21OficialGobiernoDatos:', data);
      const response = await axios.post(
        `${API_URL}/Com21OficialGobiernoDatos`,
        data,
        getAuthHeader()
      );
      console.log('Com21OficialGobiernoDatos creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com21OficialGobiernoDatos:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com21OficialGobiernoDatos con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com21OficialGobiernoDatos/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com21OficialGobiernoDatos actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com21OficialGobiernoDatos:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com21OficialGobiernoDatosService;
