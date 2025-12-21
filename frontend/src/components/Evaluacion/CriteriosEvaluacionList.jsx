import PropTypes from 'prop-types';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

/**
 * Componente reutilizable para mostrar la lista de criterios de evaluación
 * y los archivos adjuntos en el tab "Normativa" de los componentes de evaluación
 */
const CriteriosEvaluacionList = ({ criterios = [], documentos = [], onVerDocumento }) => {
  // Función para ver el documento (usa callback o abre en nueva pestaña)
  const handleVerDocumento = (url) => {
    if (url) {
      if (onVerDocumento) {
        onVerDocumento(url);
      } else {
        window.open(url, '_blank');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista de Verificación - Criterios de Evaluación */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Lista de Verificación</h3>
        {criterios && criterios.length > 0 ? (
          <div className="space-y-1.5">
            {criterios.map((criterio) => (
              <div
                key={criterio.criterioEvaluacionId}
                className={`flex items-start gap-3 p-3 rounded-md border ${
                  criterio.cumple 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {criterio.cumple ? (
                  <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${criterio.cumple ? 'text-green-800' : 'text-gray-700'}`}>
                  {criterio.descripcion}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-md">
            <p className="text-sm">No hay criterios de evaluación definidos para este compromiso</p>
          </div>
        )}
      </div>

      {/* Archivos Adjuntos */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Archivos Adjuntos</h3>
        {documentos && documentos.length > 0 ? (
          <div className="space-y-1.5">
            {documentos.map((doc, index) => (
              <div
                key={doc.id || index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleVerDocumento(doc.url)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                    <FileText size={16} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.nombre || 'Documento'}</p>
                    <p className="text-[10px] text-gray-500">Documento PDF</p>
                  </div>
                </div>
                <span className="text-primary text-sm font-medium hover:underline">Ver</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-md">
            <p className="text-sm">No hay documentos adjuntos</p>
          </div>
        )}
      </div>
    </div>
  );
};

CriteriosEvaluacionList.propTypes = {
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  documentos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    nombre: PropTypes.string,
    url: PropTypes.string,
    tipo: PropTypes.string
  })),
  onVerDocumento: PropTypes.func
};

export default CriteriosEvaluacionList;
