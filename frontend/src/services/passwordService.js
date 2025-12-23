import api from './api';

export const passwordService = {
  requestReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw error;
    }
  },

  validateToken: async (token) => {
    try {
      const response = await api.get(`/auth/validate-reset-token/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error al validar token:', error);
      throw error;
    }
  },
};
