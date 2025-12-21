import PropTypes from 'prop-types';
import { FileText, User, Mail, Phone, Calendar, Globe, Eye } from 'lucide-react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';

/**
 * Compromiso 18: Portal de Transparencia Estándar (PTE)
 */
const EvaluacionCompromiso18 = ({ data, activeTab, criterios = [] }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    responsable: data.responsablePte || data.ResponsablePte || '',
    correo: data.correoResponsablePte || data.CorreoResponsablePte || '',
    telefono: data.telefonoResponsablePte || data.TelefonoResponsablePte || '',
    fechaSolicitud: data.fechaSolicitudPte || data.FechaSolicitudPte || null,
    fechaAcceso: data.fechaAccesoPte || data.FechaAccesoPte || null,
    urlPte: data.urlPte || data.UrlPte || '',
    observacion: data.observacionPte || data.ObservacionPte || '',
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

          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h4 className="text-sm font-semibold text-emerald-900 mb-4 flex items-center gap-2">
              <Eye size={18} /> Portal de Transparencia Estándar
            </h4>
            
            {d.urlPte && (
              <div className="mb-4">
                <label className="text-xs text-gray-500">URL del Portal</label>
                <div className="flex items-center gap-2 mt-1">
                  <Globe size={16} className="text-blue-600" />
                  <a href={d.urlPte} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {d.urlPte}
                  </a>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> Fecha de Solicitud</label>
                <p className="text-gray-900">
                  {d.fechaSolicitud ? new Date(d.fechaSolicitud).toLocaleDateString('es-PE') : '-'}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> Fecha de Acceso</label>
                <p className="text-gray-900">
                  {d.fechaAcceso ? new Date(d.fechaAcceso).toLocaleDateString('es-PE') : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} /> Responsable del PTE
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500">Nombre</label>
                <p className="text-gray-900">{d.responsable || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12} /> Correo</label>
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
        <CriteriosEvaluacionList 
          criterios={criterios} 
          documentos={[]} 
        />
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

EvaluacionCompromiso18.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  }))
};
export default EvaluacionCompromiso18;
