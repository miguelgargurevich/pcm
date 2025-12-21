import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, FileText, Eye, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import EvaluacionCompromiso1 from './EvaluacionCompromiso1';
import EvaluacionCompromiso2 from './EvaluacionCompromiso2';
import EvaluacionCompromiso3 from './EvaluacionCompromiso3';
import EvaluacionCompromiso4 from './EvaluacionCompromiso4';
import EvaluacionCompromiso5 from './EvaluacionCompromiso5';
import EvaluacionCompromiso6 from './EvaluacionCompromiso6';
import EvaluacionCompromiso7 from './EvaluacionCompromiso7';
import EvaluacionCompromiso8 from './EvaluacionCompromiso8';
import EvaluacionCompromiso9 from './EvaluacionCompromiso9';
import EvaluacionCompromiso10 from './EvaluacionCompromiso10';
import EvaluacionCompromiso11 from './EvaluacionCompromiso11';
import EvaluacionCompromiso12 from './EvaluacionCompromiso12';
import EvaluacionCompromiso13 from './EvaluacionCompromiso13';
import EvaluacionCompromiso14 from './EvaluacionCompromiso14';
import EvaluacionCompromiso15 from './EvaluacionCompromiso15';
import EvaluacionCompromiso16 from './EvaluacionCompromiso16';
import EvaluacionCompromiso17 from './EvaluacionCompromiso17';
import EvaluacionCompromiso18 from './EvaluacionCompromiso18';
import EvaluacionCompromiso19 from './EvaluacionCompromiso19';
import EvaluacionCompromiso20 from './EvaluacionCompromiso20';
import EvaluacionCompromiso21 from './EvaluacionCompromiso21';
import evaluacionService from '../../services/evaluacionService';

// Nombres de los compromisos
const COMPROMISOS_NOMBRES = {
  1: 'Designación del Líder Digital',
  2: 'Conformar el Comité de GTD',
  3: 'Elaborar Plan de Gobierno Digital',
  4: 'Incorporar TD en el PEI',
  5: 'Formular Estrategia Digital',
  6: 'Migración a GOB.PE',
  7: 'Implementar Mesa de Partes Digital',
  8: 'Implementar TUPA Digital',
  9: 'Modelo de Gestión Documental',
  10: 'Plataforma Nacional de Datos Abiertos',
  11: 'Implementar GeoPERU',
  12: 'Mecanismos de Participación',
  13: 'Interoperabilidad',
  14: 'Seguridad Digital',
  15: 'Arquitectura Digital',
  16: 'Servicios Digitales',
  17: 'Identidad Digital',
  18: 'Datos como Activo Estratégico',
  19: 'Talento Digital',
  20: 'Innovación Digital',
  21: 'Oficina de Gobierno Digital'
};

// Estilos para estados
const getEstadoStyles = (estado) => {
  const styles = {
    'aceptado': 'bg-green-100 text-green-800 border-green-200',
    'enviado': 'bg-blue-100 text-blue-800 border-blue-200',
    'en revisión': 'bg-purple-100 text-purple-800 border-purple-200',
    'en proceso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'pendiente': 'bg-orange-100 text-orange-800 border-orange-200',
    'observado': 'bg-red-100 text-red-800 border-red-200',
    'sin reportar': 'bg-red-200 text-red-900 border-red-300',
    'no exigible': 'bg-gray-100 text-gray-600 border-gray-200'
  };
  return styles[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Panel de detalle de evaluación de un compromiso
 * Se muestra cuando el usuario hace clic en un chip de la matriz
 */
const EvaluacionDetallePanel = ({ 
  entidad, 
  compromisoId, 
  estadoActual, 
  onVolver,
  onEvaluar 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [observaciones, setObservaciones] = useState('');
  const [pdfUrl, _setPdfUrl] = useState(null);
  const [compromisoData, setCompromisoData] = useState(null);
  const [entidadData, setEntidadData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del compromiso
  useEffect(() => {
    const cargarDetalleCompromiso = async () => {
      setLoading(true);
      try {
        const response = await evaluacionService.getDetalleCompromiso(compromisoId, entidad.id);
        if (response.isSuccess) {
          setCompromisoData(response.data);
          setEntidadData(response.entidad);
          // Si hay observaciones previas, cargarlas
          if (response.data?.observacionesPCM || response.data?.observacionesPcm) {
            setObservaciones(response.data.observacionesPCM || response.data.observacionesPcm || '');
          }
        }
      } catch (error) {
        console.error('Error al cargar detalle del compromiso:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalleCompromiso();
  }, [compromisoId, entidad.id]);

  const tabs = [
    { id: 'general', label: 'Datos Generales' },
    { id: 'normativa', label: 'Normativa' },
    { id: 'veracidad', label: 'Veracidad' }
  ];

  // Renderizar el componente específico según el compromiso
  const renderCompromisoContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="ml-3 text-gray-600">Cargando datos del compromiso...</span>
        </div>
      );
    }

    switch (compromisoId) {
      case 1:
        return <EvaluacionCompromiso1 data={compromisoData} activeTab={activeTab} />;
      case 2:
        return <EvaluacionCompromiso2 data={compromisoData} activeTab={activeTab} />;
      case 3:
        return <EvaluacionCompromiso3 data={compromisoData} activeTab={activeTab} />;
      case 4:
        return <EvaluacionCompromiso4 data={compromisoData} activeTab={activeTab} />;
      case 5:
        return <EvaluacionCompromiso5 data={compromisoData} activeTab={activeTab} />;
      case 6:
        return <EvaluacionCompromiso6 data={compromisoData} activeTab={activeTab} />;
      case 7:
        return <EvaluacionCompromiso7 data={compromisoData} activeTab={activeTab} />;
      case 8:
        return <EvaluacionCompromiso8 data={compromisoData} activeTab={activeTab} />;
      case 9:
        return <EvaluacionCompromiso9 data={compromisoData} activeTab={activeTab} />;
      case 10:
        return <EvaluacionCompromiso10 data={compromisoData} activeTab={activeTab} />;
      case 11:
        return <EvaluacionCompromiso11 data={compromisoData} activeTab={activeTab} />;
      case 12:
        return <EvaluacionCompromiso12 data={compromisoData} activeTab={activeTab} />;
      case 13:
        return <EvaluacionCompromiso13 data={compromisoData} activeTab={activeTab} />;
      case 14:
        return <EvaluacionCompromiso14 data={compromisoData} activeTab={activeTab} />;
      case 15:
        return <EvaluacionCompromiso15 data={compromisoData} activeTab={activeTab} />;
      case 16:
        return <EvaluacionCompromiso16 data={compromisoData} activeTab={activeTab} />;
      case 17:
        return <EvaluacionCompromiso17 data={compromisoData} activeTab={activeTab} />;
      case 18:
        return <EvaluacionCompromiso18 data={compromisoData} activeTab={activeTab} />;
      case 19:
        return <EvaluacionCompromiso19 data={compromisoData} activeTab={activeTab} />;
      case 20:
        return <EvaluacionCompromiso20 data={compromisoData} activeTab={activeTab} />;
      case 21:
        return <EvaluacionCompromiso21 data={compromisoData} activeTab={activeTab} />;
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Componente de evaluación para Compromiso {compromisoId} no encontrado</p>
          </div>
        );
    }
  };

  const handleObservar = () => {
    if (onEvaluar) {
      onEvaluar('observado', observaciones);
    }
  };

  const handleAprobar = () => {
    if (onEvaluar) {
      onEvaluar('aceptado', observaciones);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Volver a Evaluación</span>
          </button>
        </div>
        <div className="mt-3">
          <h1 className="text-xl font-bold text-gray-800">
            Compromiso {compromisoId}: {COMPROMISOS_NOMBRES[compromisoId]}
          </h1>
          <p className="text-gray-600 mt-1">
            {entidadData?.nombre || entidad.nombre}
            {entidadData?.sector && ` • ${entidadData.sector}`}
            {entidadData?.clasificacion && ` • ${entidadData.clasificacion}`}
          </p>
        </div>
      </div>

      {/* Contenido principal - 2 columnas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel izquierdo - Datos con tabs */}
        <div className="flex-1 flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido del tab */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {renderCompromisoContent()}
            </div>
          </div>
        </div>

        {/* Panel derecho - Preview PDF y Evaluación */}
        <div className="w-96 flex flex-col bg-white overflow-hidden">
          {/* Preview PDF */}
          <div className="flex-1 border-b border-gray-200 p-4 overflow-hidden">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Eye size={16} />
              Previsualizador de Documento
            </h3>
            
            <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full rounded-lg"
                  title="Vista previa del documento"
                />
              ) : (
                <div className="text-center text-gray-500 p-4">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Vista previa del PDF</p>
                  <p className="text-xs mt-1">Selecciona un documento en la pestaña Normativa</p>
                </div>
              )}
            </div>
          </div>

          {/* Panel de Evaluación */}
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Evaluación del Compromiso
            </h3>

            {/* Estado Actual */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Estado Actual</label>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getEstadoStyles(estadoActual)}`}>
                {estadoActual}
              </span>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Observaciones de la PCM
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ingrese las observaciones de la evaluación..."
                className="input-field resize-none"
                rows={4}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <button
                onClick={handleObservar}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <XCircle size={16} />
                OBSERVAR
              </button>
              <button
                onClick={handleAprobar}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <CheckCircle size={16} />
                APROBAR
              </button>
            </div>

            {/* Alerta informativa */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  Recuerde revisar todos los documentos y validar la información antes de emitir una evaluación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EvaluacionDetallePanel.propTypes = {
  entidad: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    nombre: PropTypes.string.isRequired,
    sector: PropTypes.string,
    clasificacion: PropTypes.string
  }).isRequired,
  compromisoId: PropTypes.number.isRequired,
  estadoActual: PropTypes.string.isRequired,
  onVolver: PropTypes.func.isRequired,
  onEvaluar: PropTypes.func
};

export default EvaluacionDetallePanel;
