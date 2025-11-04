/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { passwordService } from '../services/passwordService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const validateToken = useCallback(async () => {
    try {
      await passwordService.validateToken(token);
      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
      setError('El enlace de recuperación es inválido o ha expirado.');
    } finally {
      setValidatingToken(false);
    }
  }, [token]);

  useEffect(() => {
    // Validar token al cargar la página
    validateToken();
  }, [validateToken]);

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

    // Validaciones
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await passwordService.resetPassword(token, formData.password);
      
      setSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="card w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Validando enlace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="card w-full max-w-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="text-red-600" size={64} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Enlace Inválido
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'El enlace de recuperación es inválido o ha expirado.'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Por favor, solicita un nuevo enlace de recuperación.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/forgot-password"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Solicitar nuevo enlace
              </Link>
              <Link
                to="/"
                className="text-sm text-primary hover:text-primary-dark inline-flex items-center justify-center gap-1"
              >
                <ArrowLeft size={16} />
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="card w-full max-w-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-600" size={64} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Contraseña Actualizada!
            </h1>
            <p className="text-gray-600 mb-6">
              Tu contraseña ha sido restablecida exitosamente.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Serás redirigido al login en unos segundos...
            </p>
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Ir al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Lock className="text-primary" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Restablecer Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña para tu cuenta.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 8 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-primary hover:text-primary-dark inline-flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
