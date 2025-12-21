import PropTypes from 'prop-types';
import { FileText, Globe, User, Mail, Phone } from 'lucide-react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';

/**
 * Compromiso 6: Migración a Plataforma GOB.PE
 */
const EvaluacionCompromiso6 = ({ data, activeTab, criterios = [], onVerDocumento }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    urlGobPe: data.urlGobPe || data.UrlGobPe || '',
    fechaMigracion: data.fechaMigracionGobPe || data.FechaMigracionGobPe || null,
    fechaActualizacion: data.fechaActualizacionGobPe || data.FechaActualizacionGobPe || null,
    responsable: data.responsableGobPe || data.ResponsableGobPe || '',
    correo: data.correoResponsableGobPe || data.CorreoResponsableGobPe || '',
    telefono: data.telefonoResponsableGobPe || data.TelefonoResponsableGobPe || '',
    tipoMigracion: data.tipoMigracionGobPe || data.TipoMigracionGobPe || '',
    observacion: data.observacionGobPe || data.ObservacionGobPe || '',
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
  if (data.rutaPdfGobpe) {
    documentos.push({
      id: 2,
      nombre: 'Documento GOB.PE',
      url: data.rutaPdfGobpe,
      tipo: 'gobpe'
    });
  }
  if (data.urlGobpe) {
    documentos.push({
      id: 3,
      nombre: 'URL GOB.PE',
      url: data.urlGobpe,
      tipo: 'url'
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

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">URL en GOB.PE</label>
            <div className="bg-gray-50 rounded-md p-3 flex items-center gap-2">
              <Globe size={18} className="text-blue-600" />
              {d.urlGobPe ? (
                <a href={d.urlGobPe} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {d.urlGobPe}
                </a>
              ) : <span className="text-gray-500">-</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Migración</label>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">{d.tipoMigracion || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Migración</label>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
                {d.fechaMigracion ? new Date(d.fechaMigracion).toLocaleDateString('es-PE') : '-'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Última Actualización</label>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
                {d.fechaActualizacion ? new Date(d.fechaActualizacion).toLocaleDateString('es-PE') : '-'}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} /> Responsable
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

EvaluacionCompromiso6.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  onVerDocumento: PropTypes.func
};
export default EvaluacionCompromiso6;
