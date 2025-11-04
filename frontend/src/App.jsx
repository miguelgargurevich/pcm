import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <Router>
        <AuthProvider>
          <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="usuarios" element={<div className="card">Módulo de Usuarios</div>} />
            <Route path="entidades" element={<div className="card">Módulo de Entidades</div>} />
            <Route path="marco-normativo" element={<div className="card">Módulo de Marco Normativo</div>} />
            <Route path="compromisos" element={<div className="card">Módulo de Compromisos</div>} />
            <Route path="cumplimiento" element={<div className="card">Módulo de Cumplimiento</div>} />
            <Route path="seguimiento" element={<div className="card">Módulo de Seguimiento</div>} />
            <Route path="evaluacion" element={<div className="card">Módulo de Evaluación</div>} />
            <Route path="reportes" element={<div className="card">Módulo de Reportes</div>} />
          </Route>

          {/* Redirigir a login por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
    </GoogleReCaptchaProvider>
  );
}

export default App;
