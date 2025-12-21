import PropTypes from 'prop-types';
import { FileText, User, Mail, Phone, Calendar, Activity, Network } from 'lucide-react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';

/**
 * Compromiso 17: Plan de Transición a IPv6
 */
const EvaluacionCompromiso17 = ({ data, activeTab, criterios = [] }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    responsable: data.responsableIpv6 || data.ResponsableIpv6 || '',
    correo: data.correoResponsableIpv6 || data.CorreoResponsableIpv6 || '',
    telefono: data.telefonoResponsableIpv6 || data.TelefonoResponsableIpv6 || '',
    estadoPlan: data.estadoPlanIpv6 || data.EstadoPlanIpv6 || '',
    fechaFormulacion: data.fechaFormulacionIpv6 || data.FechaFormulacionIpv6 || null,
    observacion: data.observacionIpv6 || data.ObservacionIpv6 || '',
    estado: data.estado || data.Estado || '',
    etapaFormulario: data.etapaFormulario || data.EtapaFormulario || '',
    checkPrivacidad: data.checkPrivacidad ?? false,
    checkDdjj: data.checkDdjj ?? false
  };

  const getEstadoColor = (estado) => {
    const lower = (estado || '').toLowerCase();
    if (lower.includes('implementado') || lower.includes('completo') || lower.includes('aprobado')) return 'bg-green-100 text-green-800';
    if (lower.includes('proceso') || lower.includes('formulación')) return 'bg-yellow-100 text-yellow-800';
    if (lower.includes('planificado')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
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

          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
            <h4 className="text-sm font-semibold text-cyan-900 mb-4 flex items-center gap-2">
              <Network size={18} /> Plan de Transición a IPv6
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><Activity size={12} /> Estado del Plan</label>
                <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(d.estadoPlan)}`}>
                  {d.estadoPlan || '-'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> Fecha de Formulación</label>
                <p className="text-gray-900">
                  {d.fechaFormulacion ? new Date(d.fechaFormulacion).toLocaleDateString('es-PE') : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} /> Responsable del Plan IPv6
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

EvaluacionCompromiso17.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  }))
};
export default EvaluacionCompromiso17;
