import PropTypes from 'prop-types';
import { FileText, Globe, User, Mail, Phone, Calendar, Hash } from 'lucide-react';

/**
 * Compromiso 8: Publicación del TUPA en el Portal de Servicios al Ciudadano
 */
const EvaluacionCompromiso8 = ({ data, activeTab }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    urlTupa: data.urlTupa || data.UrlTupa || '',
    numeroResolucion: data.numeroResolucionTupa || data.NumeroResolucionTupa || '',
    fechaAprobacion: data.fechaAprobacionTupa || data.FechaAprobacionTupa || null,
    responsable: data.responsableTupa || data.ResponsableTupa || '',
    correo: data.correoResponsableTupa || data.CorreoResponsableTupa || '',
    telefono: data.telefonoResponsableTupa || data.TelefonoResponsableTupa || '',
    observacion: data.observacionTupa || data.ObservacionTupa || '',
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

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">URL del TUPA</label>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
              <Globe size={18} className="text-blue-600" />
              {d.urlTupa ? (
                <a href={d.urlTupa} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {d.urlTupa}
                </a>
              ) : <span className="text-gray-500">-</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} /> Responsable
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

EvaluacionCompromiso8.propTypes = { data: PropTypes.object, activeTab: PropTypes.string.isRequired };
export default EvaluacionCompromiso8;
