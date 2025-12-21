import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Entidades from './pages/Entidades';
import MarcoNormativo from './pages/MarcoNormativo';
import CompromisoGobiernoDigital from './pages/CompromisoGobiernoDigital';
import CumplimientoNormativo from './pages/CumplimientoNormativo';
import CumplimientoNormativoDetalle from './pages/CumplimientoNormativoDetalle';
import SeguimientoPGDPP from './pages/SeguimientoPGDPP';
import EvaluacionCumplimiento from './pages/EvaluacionCumplimiento';
import Reportes from './pages/Reportes';
import HistorialCumplimiento from './pages/HistorialCumplimiento';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const appContent = (
    <Router>
      <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

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
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="entidades" element={<Entidades />} />
            <Route path="marco-normativo" element={<MarcoNormativo />} />
            <Route path="compromisos" element={<CompromisoGobiernoDigital />} />
            <Route path="cumplimiento" element={<CumplimientoNormativo />} />
            <Route path="cumplimiento/nuevo" element={<CumplimientoNormativoDetalle />} />
            <Route path="cumplimiento/:id" element={<CumplimientoNormativoDetalle />} />
            <Route path="seguimiento" element={<SeguimientoPGDPP />} />
            <Route path="evaluacion" element={<EvaluacionCumplimiento />} />
            <Route path="historial" element={<HistorialCumplimiento />} />
            <Route path="reportes" element={<Reportes />} />
          </Route>

          {/* Redirigir a login por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );

  // Si hay una clave de reCAPTCHA válida, envolver con el provider
  // Si no, renderizar sin reCAPTCHA (útil para desarrollo)
  return recaptchaSiteKey ? (
    <GoogleReCaptchaProvider 
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
      container={{
        parameters: {
          badge: 'bottomright',
          theme: 'light',
        },
      }}
    >
      {appContent}
    </GoogleReCaptchaProvider>
  ) : (
    appContent
  );
}

export default App;
