import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './authContextConfig';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, recaptchaToken) => {
    console.log('🔄 AuthContext: Llamando a authService.login...');
    const response = await authService.login(email, password, recaptchaToken);
    console.log('📦 AuthContext: Respuesta recibida:', response);
    
    if (response.success) {
      console.log('👤 AuthContext: Usuario:', response.data.usuario);
      setUser(response.data.usuario);
      setIsAuthenticated(true);
      console.log('✅ AuthContext: Estado actualizado - isAuthenticated: true');
      return { success: true };
    }
    console.log('⚠️ AuthContext: Login no exitoso');
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
