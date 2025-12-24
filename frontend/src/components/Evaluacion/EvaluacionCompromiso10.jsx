import PropTypes from 'prop-types';
import { FileText, Globe, User, Mail, Phone, Calendar, Database, CheckCircle, XCircle, AlertCircle, MinusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';
import com10IndicadoresCEDAService from '../../services/com10IndicadoresCEDAService';

/**
 * Compromiso 10: Publicación de Datos Abiertos en la PNDA
 */
const EvaluacionCompromiso10 = ({ data, activeTab, criterios = [], onVerDocumento }) => {
  const [indicadoresCEDA, setIndicadoresCEDA] = useState([]);
  const [loadingIndicadores, setLoadingIndicadores] = useState(false);
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState(null);
  const [detalleIndicador, setDetalleIndicador] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Cargar indicadores CEDA cuando estamos en la pestaña de indicadores
  useEffect(() => {
    if (activeTab === 'indicadores' && data?.comdaEntId) {
      cargarIndicadoresCEDA();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, data?.comdaEntId]);

  const cargarIndicadoresCEDA = async () => {
    try {
      setLoadingIndicadores(true);
      const response = await com10IndicadoresCEDAService.getList(data.comdaEntId);
      
      if (response.isSuccess && response.data) {
        setIndicadoresCEDA(response.data);
      }
    } catch (error) {
      console.error('Error al cargar indicadores CEDA:', error);
    } finally {
      setLoadingIndicadores(false);
    }
  };

  const handleVerDetalle = async (indicador) => {
    try {
      setIndicadorSeleccionado(indicador);
      setLoadingDetalle(true);
      const response = await com10IndicadoresCEDAService.getDetalle(data.comdaEntId, indicador.indicadorId);
      
      if (response.isSuccess && response.data) {
        setDetalleIndicador(response.data);
      }
    } catch (error) {
      console.error('Error al cargar detalle del indicador:', error);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleCerrarDetalle = () => {
    setIndicadorSeleccionado(null);
    setDetalleIndicador(null);
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Cumple':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Parcial':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'No cumple':
        return <XCircle className="text-red-600" size={20} />;
      case 'No aplica':
        return <MinusCircle className="text-gray-400" size={20} />;
      default:
        return <MinusCircle className="text-gray-300" size={20} />;
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'Cumple':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Parcial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'No cumple':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'No aplica':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
      </div>
    );
  }

  const d = {
    urlDatosAbiertos: data.urlDatosAbiertos || data.UrlDatosAbiertos || '',
    totalDatasets: data.totalDatasets || data.TotalDatasets || 0,
    fechaUltimaActualizacion: data.fechaUltimaActualizacionDa || data.FechaUltimaActualizacionDa || null,
    responsable: data.responsableDa || data.ResponsableDa || '',
    correo: data.correoResponsableDa || data.CorreoResponsableDa || '',
    telefono: data.telefonoResponsableDa || data.TelefonoResponsableDa || '',
    observacion: data.observacionDa || data.ObservacionDa || '',
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
  if (data.rutaPdfPnda) {
    documentos.push({
      id: 2,
      nombre: 'Datos Abiertos',
      url: data.rutaPdfPnda,
      tipo: 'pnda'
    });
  }
  if (data.urlPnda) {
    documentos.push({
      id: 3,
      nombre: 'URL Datos Abiertos',
      url: data.urlPnda,
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
            <label className="block text-sm font-medium text-gray-500 mb-1">URL en Datos Abiertos (PNDA)</label>
            <div className="bg-gray-50 rounded-md p-3 flex items-center gap-2">
              <Globe size={18} className="text-blue-600" />
              {d.urlDatosAbiertos ? (
                <a href={d.urlDatosAbiertos} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {d.urlDatosAbiertos}
                </a>
              ) : <span className="text-gray-500">-</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 items-center gap-1">
                <Database size={14} /> Total de Datasets Publicados
              </label>
              <div className="bg-indigo-50 rounded-md p-3 text-indigo-900 font-bold text-2xl">{d.totalDatasets}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 items-center gap-1">
                <Calendar size={14} /> Última Actualización
              </label>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
                {d.fechaUltimaActualizacion ? new Date(d.fechaUltimaActualizacion).toLocaleDateString('es-PE') : '-'}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} /> Responsable de Datos Abiertos
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

      {activeTab === 'indicadores' && (
        <div className="space-y-4">
          {loadingIndicadores ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : indicadoresCEDA.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No hay indicadores CEDA registrados</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Indicador
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {indicadoresCEDA.map((indicador) => (
                      <tr 
                        key={indicador.indicadorId} 
                        onClick={() => handleVerDetalle(indicador)}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-mono font-semibold bg-blue-100 text-blue-800 rounded">
                            {indicador.numeroOrden || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900 font-medium">
                            {indicador.nombreIndicador}
                          </div>
                          {indicador.descripcionIndicador && (
                            <div className="text-xs text-gray-500 mt-1">
                              {indicador.descripcionIndicador}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getEstadoIcon(indicador.estadoIndicador)}
                            <span className={`px-2 py-1 text-xs font-medium rounded border ${getEstadoBadgeClass(indicador.estadoIndicador)}`}>
                              {indicador.estadoIndicador || 'Sin estado'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600 max-w-md">
                            {indicador.estadoIndicador ? 'Ver detalle →' : '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal de detalle del indicador */}
          {indicadorSeleccionado && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {loadingDetalle ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                ) : detalleIndicador ? (
                  <>
                    {/* Header del modal */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 text-sm font-mono font-semibold bg-blue-100 text-blue-800 rounded">
                            Indicador #{indicadorSeleccionado.numeroOrden}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded border ${getEstadoBadgeClass(detalleIndicador.estado)}`}>
                            {detalleIndicador.estado || 'Sin evaluar'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {indicadorSeleccionado.nombreIndicador}
                        </h3>
                        {indicadorSeleccionado.descripcionIndicador && (
                          <p className="text-sm text-gray-600 mt-1">
                            {indicadorSeleccionado.descripcionIndicador}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleCerrarDetalle}
                        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>

                    {/* Contenido del modal */}
                    <div className="p-6 space-y-4">
                      {/* Estado del indicador */}
                      {detalleIndicador.estadoIndicador && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                          </label>
                          <div className="flex items-center gap-2">
                            {getEstadoIcon(detalleIndicador.estadoIndicador)}
                            <span className={`px-3 py-1 text-sm font-medium rounded border ${getEstadoBadgeClass(detalleIndicador.estadoIndicador)}`}>
                              {detalleIndicador.estadoIndicador}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Número de Resolución */}
                      {detalleIndicador.numeroResolucion && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Resolución
                          </label>
                          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-900 font-mono">
                            {detalleIndicador.numeroResolucion}
                          </div>
                        </div>
                      )}

                      {/* Fecha de Resolución */}
                      {detalleIndicador.fechaResolucion && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha de Resolución
                          </label>
                          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-900">
                            {new Date(detalleIndicador.fechaResolucion).toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      )}

                      {/* URL de evidencia */}
                      {detalleIndicador.urlEvidencia && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL de Evidencia
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={detalleIndicador.urlEvidencia}
                              readOnly
                              className="flex-1 bg-gray-50 rounded-lg p-3 text-sm text-gray-900 border border-gray-200"
                            />
                            <a
                              href={detalleIndicador.urlEvidencia}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                              <FileText size={18} />
                              Ver PDF
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Criterios de evaluación */}
                      {detalleIndicador.criterios && detalleIndicador.criterios.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Criterios de Evaluación
                          </label>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {detalleIndicador.criterios.map((criterio) => (
                              <div key={criterio.criterioId} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex-shrink-0 mt-0.5">
                                  {criterio.cumpleCriterio ? (
                                    <CheckCircle className="text-green-600" size={20} />
                                  ) : (
                                    <XCircle className="text-red-600" size={20} />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900">{criterio.descripcionCriterio}</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${
                                  criterio.cumpleCriterio 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {criterio.cumpleCriterio ? 'Cumple' : 'No cumple'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mensaje si no hay datos */}
                      {!detalleIndicador.estadoIndicador && 
                       !detalleIndicador.numeroResolucion && 
                       !detalleIndicador.fechaResolucion && 
                       !detalleIndicador.urlEvidencia && 
                       (!detalleIndicador.criterios || detalleIndicador.criterios.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No hay información detallada registrada para este indicador</p>
                        </div>
                      )}
                    </div>

                    {/* Footer del modal */}
                    <div className="border-t border-gray-200 p-6 flex justify-end">
                      <button
                        onClick={handleCerrarDetalle}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cerrar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No se pudo cargar el detalle del indicador</p>
                    <button
                      onClick={handleCerrarDetalle}
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

EvaluacionCompromiso10.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  onVerDocumento: PropTypes.func
};
export default EvaluacionCompromiso10;
