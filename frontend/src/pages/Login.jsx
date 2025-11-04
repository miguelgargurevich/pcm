/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!executeRecaptcha) {
      setError('reCAPTCHA no está disponible. Por favor, recarga la página.');
      return;
    }

    setLoading(true);

    try {
      // Ejecutar reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha('login');
      
      // Aquí puedes enviar el token al backend para verificación
      console.log('reCAPTCHA Token:', recaptchaToken);
      
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Plataforma de Cumplimiento Digital
          </h1>
          <h2 className="text-xl text-gray-600">Iniciar Sesión</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="usuario@pcm.gob.pe"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-primary hover:text-primary-dark">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-4">
            Este sitio está protegido por reCAPTCHA v3 y se aplican las{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
              Políticas de Privacidad
            </a>{' '}
            y{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
              Términos de Servicio
            </a>{' '}
            de Google.
          </p>
          <div className="text-sm text-gray-600 pt-4 border-t border-gray-200">
            <p>Usuario de prueba: admin@pcm.gob.pe</p>
            <p>Contraseña: Admin123!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
