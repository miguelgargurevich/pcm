import PropTypes from 'prop-types';
import { FileText, User, Mail, Phone, Calendar, Hash, ShieldAlert } from 'lucide-react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';

/**
 * Compromiso 15: Conformación del Equipo de Respuesta ante Incidentes (CSIRT)
 */
const EvaluacionCompromiso15 = ({ data, activeTab, criterios = [], onVerDocumento }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    nombreCsirt: data.nombreCsirt || data.NombreCsirt || '',
    fechaConformacion: data.fechaConformacionCsirt || data.FechaConformacionCsirt || null,
    numeroResolucion: data.numeroResolucionCsirt || data.NumeroResolucionCsirt || '',
    responsable: data.responsableCsirt || data.ResponsableCsirt || '',
    correo: data.correoResponsableCsirt || data.CorreoResponsableCsirt || '',
    telefono: data.telefonoResponsableCsirt || data.TelefonoResponsableCsirt || '',
    observacion: data.observacionCsirt || data.ObservacionCsirt || '',
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
  if (data.rutaPdfCsirt) {
    documentos.push({
      id: 2,
      nombre: 'CSIRT Institucional',
      url: data.rutaPdfCsirt,
      tipo: 'csirt'
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

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <ShieldAlert size={18} /> Información del CSIRT Institucional
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <label className="text-[10px] text-gray-500">Nombre del CSIRT</label>
                <p className="text-gray-900 font-medium text-lg">{d.nombreCsirt || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><Hash size={12} /> Número de Resolución</label>
                <p className="text-gray-900">{d.numeroResolucion || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={12} /> Fecha de Conformación</label>
                <p className="text-gray-900">
                  {d.fechaConformacion ? new Date(d.fechaConformacion).toLocaleDateString('es-PE') : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} /> Responsable del CSIRT
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

EvaluacionCompromiso15.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  onVerDocumento: PropTypes.func
};
export default EvaluacionCompromiso15;
