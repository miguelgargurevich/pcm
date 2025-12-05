import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';

const com5EstrategiaDigitalService = {
  /**
   * Obtiene el registro Com5 Estrategia Digital por compromisoId y entidadId
   */
  getByEntidad: async (compromisoId, entidadId) => {
    try {
      console.log('🔍 com5EstrategiaDigitalService.getByEntidad:', { compromisoId, entidadId });
      
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/com5-estrategia-digital/${compromisoId}/entidad/${entidadId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 Respuesta raw de getByEntidad:', response);

      // Si es 404, retornar success con data null
      if (response.status === 404) {
        return { isSuccess: true, data: null };
      }

      // Normalizar respuesta Result<T>
      const result = response.data;
      
      // Si ya viene en formato Result<T>
      if (result.isSuccess !== undefined) {
        console.log('✅ Respuesta en formato Result<T>:', result);
        return {
          isSuccess: result.isSuccess,
          data: result.data
        };
      }

      // Si viene directo el objeto
      console.log('✅ Respuesta directa (no Result<T>):', result);
      return {
        isSuccess: true,
        data: result
      };
    } catch (error) {
      // Si es 404, no es un error
      if (error.response?.status === 404) {
        console.log('ℹ️ No se encontró registro Com5 (404), retornando null');
        return { isSuccess: true, data: null };
      }

      console.error('❌ Error en getByEntidad:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al obtener registro',
        data: null
      };
    }
  },

  /**
   * Crea un nuevo registro Com5 Estrategia Digital
   */
  create: async (data) => {
    try {
      console.log('🚀 com5EstrategiaDigitalService.create:', data);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/com5-estrategia-digital`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 Respuesta de create:', response.data);

      // Normalizar respuesta Result<T>
      const result = response.data;
      if (result.isSuccess !== undefined) {
        return {
          isSuccess: result.isSuccess,
          data: result.data
        };
      }

      return {
        isSuccess: true,
        data: result
      };
    } catch (error) {
      console.error('❌ Error en create:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al crear registro',
        data: null
      };
    }
  },

  /**
   * Actualiza un registro Com5 Estrategia Digital existente
   */
  update: async (id, data) => {
    try {
      console.log('📝 com5EstrategiaDigitalService.update:', { id, data });
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/com5-estrategia-digital/${id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 Respuesta de update:', response.data);

      // Normalizar respuesta Result<T>
      const result = response.data;
      if (result.isSuccess !== undefined) {
        return {
          isSuccess: result.isSuccess,
          data: result.data
        };
      }

      return {
        isSuccess: true,
        data: result
      };
    } catch (error) {
      console.error('❌ Error en update:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Error al actualizar registro',
        data: null
      };
    }
  }
};

export default com5EstrategiaDigitalService;
