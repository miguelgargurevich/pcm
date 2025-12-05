import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';

const com10DatosAbiertosService = {
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log('📞 com10DatosAbiertosService.getByEntidad llamado con:', { compromisoId, entidadId });
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/Com10DatosAbiertos/${compromisoId}/entidad/${entidadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('✅ Respuesta getByEntidad Com10:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en getByEntidad Com10:', error);
      if (error.response?.status === 404) {
        return { isSuccess: true, data: null };
      }
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al obtener datos de Com10',
      };
    }
  },

  create: async (data) => {
    try {
      console.log('📞 com10DatosAbiertosService.create llamado con:', data);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/Com10DatosAbiertos`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Respuesta create Com10:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en create Com10:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al crear registro de Com10',
      };
    }
  },

  update: async (id, data) => {
    try {
      console.log('📞 com10DatosAbiertosService.update llamado con:', { id, data });
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/Com10DatosAbiertos/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Respuesta update Com10:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en update Com10:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al actualizar registro de Com10',
      };
    }
  },
};

export default com10DatosAbiertosService;
