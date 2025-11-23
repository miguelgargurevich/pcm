import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5158/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com13InteroperabilidadPIDEService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com13InteroperabilidadPIDE para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com13InteroperabilidadPIDE/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com13InteroperabilidadPIDE encontrado:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com13InteroperabilidadPIDE, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com13InteroperabilidadPIDE:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com13InteroperabilidadPIDE:', data);
      const response = await axios.post(
        `${API_URL}/Com13InteroperabilidadPIDE`,
        data,
        getAuthHeader()
      );
      console.log('Com13InteroperabilidadPIDE creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com13InteroperabilidadPIDE:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com13InteroperabilidadPIDE con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com13InteroperabilidadPIDE/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com13InteroperabilidadPIDE actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com13InteroperabilidadPIDE:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com13InteroperabilidadPIDEService;
