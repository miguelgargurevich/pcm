import PropTypes from 'prop-types';
import { FileText, User, Mail, Phone, Shield, Target, Activity } from 'lucide-react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';

/**
 * Compromiso 16: Sistema de Gestión de Seguridad de la Información (SGSI)
 */
const EvaluacionCompromiso16 = ({ data, activeTab, criterios = [], onVerDocumento }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    responsable: data.responsableSgsi || data.ResponsableSgsi || '',
    correo: data.correoResponsableSgsi || data.CorreoResponsableSgsi || '',
    telefono: data.telefonoResponsableSgsi || data.TelefonoResponsableSgsi || '',
    estadoImplementacion: data.estadoImplementacionSgsi || data.EstadoImplementacionSgsi || '',
    alcance: data.alcanceSgsi || data.AlcanceSgsi || '',
    observacion: data.observacionSgsi || data.ObservacionSgsi || '',
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
  if (data.rutaPdfSgsi) {
    documentos.push({
      id: 2,
      nombre: 'Sistema de Gestión de Seguridad',
      url: data.rutaPdfSgsi,
      tipo: 'sgsi'
    });
  }
  if (data.rutaPdfPoliticasSgsi) {
    documentos.push({
      id: 3,
      nombre: 'Políticas SGSI',
      url: data.rutaPdfPoliticasSgsi,
      tipo: 'politicas_sgsi'
    });
  }
  if (data.rutaPdfCertificadoSgsi) {
    documentos.push({
      id: 4,
      nombre: 'Certificado SGSI',
      url: data.rutaPdfCertificadoSgsi,
      tipo: 'certificado_sgsi'
    });
  }

  const getEstadoColor = (estado) => {
    const lower = (estado || '').toLowerCase();
    if (lower.includes('implementado') || lower.includes('completo')) return 'bg-green-100 text-green-800';
    if (lower.includes('proceso') || lower.includes('parcial')) return 'bg-yellow-100 text-yellow-800';
    if (lower.includes('planificado')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

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

          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <h4 className="text-sm font-semibold text-teal-900 mb-4 flex items-center gap-2">
              <Shield size={18} /> Sistema de Gestión de Seguridad de la Información
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><Activity size={12} /> Estado de Implementación</label>
                <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(d.estadoImplementacion)}`}>
                  {d.estadoImplementacion || '-'}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><Target size={12} /> Alcance del SGSI</label>
                <p className="text-gray-900">{d.alcance || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} /> Responsable del SGSI
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-gray-500">Nombre</label>
                <p className="text-gray-900">{d.responsable || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><Mail size={12} /> Correo</label>
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

EvaluacionCompromiso16.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  onVerDocumento: PropTypes.func
};
export default EvaluacionCompromiso16;
