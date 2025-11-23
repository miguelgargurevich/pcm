import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5158/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const com12ResponsableSoftwarePublicoService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log(`Buscando Com12ResponsableSoftwarePublico para compromiso ${compromisoId} y entidad ${entidadId}`);
      const response = await axios.get(
        `${API_URL}/Com12ResponsableSoftwarePublico/${compromisoId}/entidad/${entidadId}`,
        getAuthHeader()
      );
      console.log('Com12ResponsableSoftwarePublico encontrado:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No se encontró Com12ResponsableSoftwarePublico, retornando null');
        return { isSuccess: true, data: null };
      }
      console.error('Error al obtener Com12ResponsableSoftwarePublico:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      };
    }
  },

  create: async (data) => {
    try {
      console.log('Creando Com12ResponsableSoftwarePublico:', data);
      const response = await axios.post(
        `${API_URL}/Com12ResponsableSoftwarePublico`,
        data,
        getAuthHeader()
      );
      console.log('Com12ResponsableSoftwarePublico creado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al crear Com12ResponsableSoftwarePublico:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Actualizando Com12ResponsableSoftwarePublico con ID ${id}:`, data);
      const response = await axios.put(
        `${API_URL}/Com12ResponsableSoftwarePublico/${id}`,
        data,
        getAuthHeader()
      );
      console.log('Com12ResponsableSoftwarePublico actualizado exitosamente:', response.data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar Com12ResponsableSoftwarePublico:', error);
      return { 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      };
    }
  }
};

export default com12ResponsableSoftwarePublicoService;
