import PropTypes from 'prop-types';
import { FileText, User, Mail, Phone, CreditCard, Briefcase, Shield } from 'lucide-react';

/**
 * Compromiso 14: Oficial de Seguridad Digital
 */
const EvaluacionCompromiso14 = ({ data, activeTab }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  // Construir nombre completo
  const nombre = data.nombreOscd || data.NombreOscd || '';
  const apePat = data.apePatOscd || data.ApePatOscd || '';
  const apeMat = data.apeMatOscd || data.ApeMatOscd || '';
  const nombreCompleto = [nombre, apePat, apeMat].filter(Boolean).join(' ');

  const d = {
    dni: data.dniOscd || data.DniOscd || '',
    nombre: nombreCompleto || '-',
    cargo: data.cargoOscd || data.CargoOscd || '',
    correo: data.correoOscd || data.CorreoOscd || '',
    telefono: data.telefonoOscd || data.TelefonoOscd || '',
    observacion: data.observacionOscd || data.ObservacionOscd || '',
    fechaDesignacion: data.fechaDesignacionOscd || data.FechaDesignacionOscd || '',
    numeroResolucion: data.numeroResolucionOscd || data.NumeroResolucionOscd || '',
    comunicadoPcm: data.comunicadoPcmOscd ?? false,
    estado: data.estado || data.Estado || '',
    etapaFormulario: data.etapaFormulario || data.EtapaFormulario || '',
    checkPrivacidad: data.checkPrivacidad ?? false,
    checkDdjj: data.checkDdjj ?? false
  };

  return (
    <div className="space-y-4">
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
              <div className="bg-blue-50 rounded-lg p-3 text-blue-900 font-medium">{d.estado || 'Sin estado'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Etapa</label>
              <div className="bg-purple-50 rounded-lg p-3 text-purple-900 font-medium">{d.etapaFormulario || 'Sin etapa'}</div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <h4 className="text-sm font-semibold text-red-900 mb-4 flex items-center gap-2">
              <Shield size={18} /> Datos del Oficial de Seguridad Digital
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><CreditCard size={12} /> DNI</label>
                <p className="text-gray-900 font-medium text-lg">{d.dni || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><User size={12} /> Nombre Completo</label>
                <p className="text-gray-900 font-medium text-lg">{d.nombre || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><Briefcase size={12} /> Cargo</label>
                <p className="text-gray-900">{d.cargo || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12} /> Correo Electrónico</label>
                <p className="text-gray-900">{d.correo || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12} /> Teléfono</label>
                <p className="text-gray-900">{d.telefono || '-'}</p>
              </div>
            </div>
          </div>

          {d.observacion && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Observaciones</label>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{d.observacion}</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'normativa' && (
        <div className="text-center py-8 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No hay documentos normativos para este compromiso</p>
        </div>
      )}

      {activeTab === 'veracidad' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Política de Privacidad</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${d.checkPrivacidad ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {d.checkPrivacidad ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Declaración Jurada</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${d.checkDdjj ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {d.checkDdjj ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EvaluacionCompromiso14.propTypes = { data: PropTypes.object, activeTab: PropTypes.string.isRequired };
export default EvaluacionCompromiso14;
