import PropTypes from 'prop-types';
import { User, Mail, Phone, CreditCard, Briefcase, Database } from 'lucide-react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';

/**
 * Compromiso 21: Oficial de Gobierno de Datos
 */
const EvaluacionCompromiso21 = ({ data, activeTab, criterios = [], onVerDocumento }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  // Construir nombre completo
  const nombre = data.nombreOgd || data.NombreOgd || '';
  const apePat = data.apePatOgd || data.ApePatOgd || '';
  const apeMat = data.apeMatOgd || data.ApeMatOgd || '';
  const nombreCompleto = [nombre, apePat, apeMat].filter(Boolean).join(' ');

  const d = {
    dni: data.dniOgd || data.DniOgd || '',
    nombre: nombreCompleto || '-',
    cargo: data.cargoOgd || data.CargoOgd || '',
    correo: data.correoOgd || data.CorreoOgd || '',
    telefono: data.telefonoOgd || data.TelefonoOgd || '',
    observacion: data.observacionOgd || data.ObservacionOgd || '',
    fechaDesignacion: data.fechaDesignacionOgd || data.FechaDesignacionOgd || '',
    numeroResolucion: data.numeroResolucionOgd || data.NumeroResolucionOgd || '',
    comunicadoPcm: data.comunicadoPcmOgd ?? false,
    estado: data.estado || data.Estado || '',
    etapaFormulario: data.etapaFormulario || data.EtapaFormulario || '',
    checkPrivacidad: data.checkPrivacidad ?? false,
    checkDdjj: data.checkDdjj ?? false
  };

  // Documentos normativos
  const documentos = [];
  if (data.rutaPdfNormativa) {
    documentos.push({
      id: 1,
      nombre: 'Documento Normativo',
      url: data.rutaPdfNormativa,
      tipo: 'normativa'
    });
  }
  if (data.rutaPdfOgd) {
    documentos.push({
      id: 2,
      nombre: 'Oficial de Gobierno de Datos',
      url: data.rutaPdfOgd,
      tipo: 'ogd'
    });
  }

  return (
    <div className="space-y-3">
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
              <div className="bg-blue-50 rounded-md p-3 text-sm text-blue-900 font-medium">{d.estado || 'Sin estado'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Etapa</label>
              <div className="bg-purple-50 rounded-md p-3 text-sm text-purple-900 font-medium">{d.etapaFormulario || 'Sin etapa'}</div>
            </div>
          </div>

          <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
            <h4 className="text-sm font-semibold text-sky-900 mb-4 flex items-center gap-2">
              <Database size={18} /> Datos del Oficial de Gobierno de Datos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><CreditCard size={12} /> DNI</label>
                <p className="text-gray-900 font-medium text-lg">{d.dni || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><User size={12} /> Nombre Completo</label>
                <p className="text-gray-900 font-medium text-lg">{d.nombre || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><Briefcase size={12} /> Cargo</label>
                <p className="text-gray-900">{d.cargo || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><Mail size={12} /> Correo Electrónico</label>
                <p className="text-gray-900">{d.correo || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><Phone size={12} /> Teléfono</label>
                <p className="text-gray-900">{d.telefono || '-'}</p>
              </div>
            </div>
          </div>

          {d.observacion && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Observaciones</label>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">{d.observacion}</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'normativa' && (
        <CriteriosEvaluacionList 
          criterios={criterios} 
          documentos={documentos}
          onVerDocumento={onVerDocumento}
        />
      )}

      {activeTab === 'veracidad' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Política de Privacidad</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${d.checkPrivacidad ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {d.checkPrivacidad ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Declaración Jurada</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${d.checkDdjj ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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

EvaluacionCompromiso21.propTypes = { 
  data: PropTypes.object, 
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  onVerDocumento: PropTypes.func
};
export default EvaluacionCompromiso21;
