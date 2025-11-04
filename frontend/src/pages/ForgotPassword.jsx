import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { passwordService } from '../services/passwordService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await passwordService.requestReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al enviar el correo. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="card w-full max-w-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-600" size={64} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Correo Enviado
            </h1>
            <p className="text-gray-600 mb-6">
              Si existe una cuenta asociada a <strong>{email}</strong>, recibirás un correo con las instrucciones para restablecer tu contraseña.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Por favor, revisa tu bandeja de entrada y también la carpeta de spam.
            </p>
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Volver al Login
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
            <Mail className="text-primary" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="usuario@pcm.gob.pe"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
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

export default ForgotPassword;
