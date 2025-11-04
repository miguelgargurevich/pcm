import api from './api';

export const authService = {
  // Login
  async login(email, password, recaptchaToken) {
    try {
      console.log('🌐 authService: Enviando petición POST /auth/login');
      const response = await api.post('/auth/login', {
        email,
        password,
        recaptchaToken,
      });

      console.log('📡 authService: Respuesta del servidor:', response.data);

      // El backend retorna IsSuccess, no success
      const isSuccess = response.data.isSuccess || response.data.IsSuccess;
      
      if (isSuccess) {
        // El backend retorna AccessToken, no token
        const token = response.data.data?.accessToken || response.data.data?.AccessToken;
        const refreshToken = response.data.data?.refreshToken || response.data.data?.RefreshToken;
        const usuario = response.data.data?.usuario || response.data.data?.Usuario;
        
        console.log('💾 authService: Guardando en localStorage...');
        console.log('  - Token:', token ? 'OK' : 'Falta');
        console.log('  - RefreshToken:', refreshToken ? 'OK' : 'Falta');
        console.log('  - Usuario:', usuario ? usuario.email : 'Falta');
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(usuario));
        
        console.log('✅ authService: Datos guardados exitosamente');
        
        // Retornar en formato que espera el frontend
        return {
          success: true,
          data: {
            token,
            refreshToken,
            usuario
          }
        };
      }
      console.log('⚠️ authService: success=false en respuesta');
      return {
        success: false,
        message: response.data.message || response.data.Message || 'Error desconocido'
      };
    } catch (error) {
      console.error('❌ authService: Error en petición:', error);
      const errorData = error.response?.data;
      throw {
        success: false,
        message: errorData?.message || errorData?.Message || error.message || 'Error al iniciar sesión'
      };
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error al cambiar contraseña' };
    }
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario del localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
