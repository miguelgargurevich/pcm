import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5165/api';

const com9ModeloGestionDocumentalService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log('📞 com9ModeloGestionDocumentalService.getByEntidad llamado con:', { compromisoId, entidadId });
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/Com9ModeloGestionDocumental/${compromisoId}/entidad/${entidadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('✅ Respuesta getByEntidad Com9:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en getByEntidad Com9:', error);
      if (error.response?.status === 404) {
        return { isSuccess: true, data: null };
      }
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al obtener datos de Com9',
      };
    }
  },

  create: async (data) => {
    try {
      console.log('📞 com9ModeloGestionDocumentalService.create llamado con:', data);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/Com9ModeloGestionDocumental`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Respuesta create Com9:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en create Com9:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al crear registro de Com9',
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log('📞 com9ModeloGestionDocumentalService.update llamado con:', { id, data });
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/Com9ModeloGestionDocumental/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Respuesta update Com9:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en update Com9:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al actualizar registro de Com9',
      };
    }
  },
};

export default com9ModeloGestionDocumentalService;
