import PropTypes from 'prop-types';
import { FileText, User, Mail, Phone, Calendar, Hash, CheckCircle } from 'lucide-react';

/**
 * Compromiso 9: Modelo de Gestión Documental (MGD)
 */
const EvaluacionCompromiso9 = ({ data, activeTab }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    fechaAprobacion: data.fechaAprobacionMgd || data.FechaAprobacionMgd || null,
    numeroResolucion: data.numeroResolucionMgd || data.NumeroResolucionMgd || '',
    responsable: data.responsableMgd || data.ResponsableMgd || '',
    correo: data.correoResponsableMgd || data.CorreoResponsableMgd || '',
    telefono: data.telefonoResponsableMgd || data.TelefonoResponsableMgd || '',
    tieneDocumentoNormativo: data.tieneDocumentoNormativoMgd ?? false,
    observacion: data.observacionMgd || data.ObservacionMgd || '',
    estado: data.estado || data.Estado || '',
    estadoPcm: data.estadoPCM || data.estadoPcm || '',
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
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado PCM</label>
              <div className="bg-green-50 rounded-lg p-3 text-green-900 font-medium">{d.estadoPcm || 'Sin evaluar'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 items-center gap-1">
                <Hash size={14} /> Número de Resolución
              </label>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{d.numeroResolucion || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 items-center gap-1">
                <Calendar size={14} /> Fecha de Aprobación
              </label>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
                {d.fechaAprobacion ? new Date(d.fechaAprobacion).toLocaleDateString('es-PE') : '-'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 items-center gap-1">
                <CheckCircle size={14} /> Documento Normativo
              </label>
              <div className={`rounded-lg p-3 font-medium ${d.tieneDocumentoNormativo ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                {d.tieneDocumentoNormativo ? 'Sí tiene' : 'No tiene'}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} /> Responsable del MGD
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
        <div className="text-center py-8 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No hay documentos normativos cargados</p>
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

EvaluacionCompromiso9.propTypes = { data: PropTypes.object, activeTab: PropTypes.string.isRequired };
export default EvaluacionCompromiso9;
