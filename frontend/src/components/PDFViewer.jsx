import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const PDFViewer = ({ pdfUrl, onClose, title = 'Vista Previa del Documento' }) => {
  if (!pdfUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Cerrar"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <iframe
            src={pdfUrl}
            className="w-full h-full min-h-[600px] border-0"
            title={title}
          />
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Abrir en nueva pestaña
          </a>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Cerrar
          </button>
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
