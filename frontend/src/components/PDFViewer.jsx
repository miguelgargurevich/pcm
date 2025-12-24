import { X, Loader2, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const PDFViewer = ({ pdfUrl, onClose, title = 'Vista Previa del Documento' }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('👁️ PDFViewer recibió URL:', pdfUrl);
  
  if (!pdfUrl) {
    console.log('⚠️ PDFViewer: No hay pdfUrl');
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-white/80">Documento PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Abrir en nueva pestaña"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-gray-600 font-medium">Cargando documento...</p>
              </div>
            </div>
          )}
          <iframe
            src={pdfUrl}
            className="w-full h-full min-h-[600px] border-0 rounded-lg"
            title={title}
            onLoad={() => {
              console.log('✅ PDF cargado correctamente en iframe');
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error('❌ Error al cargar PDF en iframe:', e);
              setIsLoading(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

PDFViewer.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default PDFViewer;
