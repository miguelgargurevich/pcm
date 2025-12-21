import PropTypes from 'prop-types';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';

/**
 * Compromiso 5: Formulación de Estrategia de Gobierno Digital
 */
const EvaluacionCompromiso5 = ({ data, activeTab, criterios = [], onVerDocumento }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    nombreEstrategia: data.nombreEstrategia || data.NombreEstrategia || '',
    periodoInicio: data.periodoInicioEstrategia || data.PeriodoInicioEstrategia || null,
    periodoFin: data.periodoFinEstrategia || data.PeriodoFinEstrategia || null,
    objetivos: data.objetivosEstrategicos || data.ObjetivosEstrategicos || '',
    lineasAccion: data.lineasAccion || data.LineasAccion || '',
    fechaAprobacion: data.fechaAprobacionEstrategia || data.FechaAprobacionEstrategia || null,
    alineadoPgd: data.alineadoPgdEstrategia ?? data.AlineadoPgdEstrategia ?? false,
    estado: data.estado || data.Estado || '',
    etapaFormulario: data.etapaFormulario || data.EtapaFormulario || '',
    checkPrivacidad: data.checkPrivacidad ?? false,
    checkDdjj: data.checkDdjj ?? false,
    rutaPdfNormativa: data.rutaPdfNormativa || data.RutaPdfNormativa || null
  };

  const periodo = d.periodoInicio && d.periodoFin ? `${d.periodoInicio} - ${d.periodoFin}` : '-';

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nombre de la Estrategia</label>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">{d.nombreEstrategia || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Período de Vigencia</label>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">{periodo}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Aprobación</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {d.fechaAprobacion ? new Date(d.fechaAprobacion).toLocaleDateString('es-PE') : '-'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Objetivos Estratégicos</label>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">{d.objetivos || 'No especificado'}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Líneas de Acción</label>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">{d.lineasAccion || 'No especificado'}</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              {d.alineadoPgd ? <CheckCircle size={24} className="text-green-600" /> : <XCircle size={24} className="text-red-500" />}
              <div>
                <p className="font-medium text-gray-900">Alineación con Plan de Gobierno Digital</p>
                <p className="text-sm text-gray-600">
                  {d.alineadoPgd ? 'La estrategia está alineada con el PGD' : 'No confirmado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'normativa' && (
        <CriteriosEvaluacionList 
          criterios={criterios} 
          documentos={d.rutaPdfNormativa ? [{ id: 1, nombre: 'Documento de Estrategia Digital', url: d.rutaPdfNormativa }] : []}
          onVerDocumento={onVerDocumento}
        />
      )}

      {activeTab === 'veracidad' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Política de Privacidad</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${d.checkPrivacidad ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {d.checkPrivacidad ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-1">
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

EvaluacionCompromiso5.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  onVerDocumento: PropTypes.func
};
export default EvaluacionCompromiso5;
