import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, Save, FileText, Calendar, Link as LinkIcon } from 'lucide-react';
import com10IndicadoresCEDAService from '../../services/com10IndicadoresCEDAService';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import PDFViewer from '../PDFViewer';

/**
 * Componente para formulario de evaluación de un indicador CEDA
 */
const IndicadoresCEDADetalle = ({ compndaEntId, indicador, onBack, onSaved }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  
  const [formData, setFormData] = useState({
    evalCabId: null,
    nombreIndicador: '',
    descripcionIndicador: '',
    estadoIndicador: '',
    urlEvidencia: '',
    numeroResolucion: '',
    fechaResolucion: '',
    criterios: []
  });

  useEffect(() => {
    if (indicador && compndaEntId) {
      cargarDetalle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicador, compndaEntId]);

  const cargarDetalle = async () => {
    try {
      setLoading(true);
      const response = await com10IndicadoresCEDAService.getDetalle(
        compndaEntId,
        indicador.indicadorId
      );

      if (response.isSuccess && response.data) {
        const data = response.data;
        setFormData({
          evalCabId: data.evalCabId,
          nombreIndicador: data.nombreIndicador || '',
          descripcionIndicador: data.descripcionIndicador || '',
          estadoIndicador: data.estadoIndicador || '',
          urlEvidencia: data.urlEvidencia || '',
          numeroResolucion: data.numeroResolucion || '',
          fechaResolucion: data.fechaResolucion ? data.fechaResolucion.split('T')[0] : '',
          criterios: data.criterios || []
        });
      }
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      showErrorToast('Error al cargar el detalle del indicador');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCriterioChange = (criterioId, cumple) => {
    setFormData(prev => ({
      ...prev,
      criterios: prev.criterios.map(c =>
        c.criterioId === criterioId ? { ...c, cumpleCriterio: cumple } : c
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        evalCabId: formData.evalCabId || null,
        compndaEntId: compndaEntId,
        indicadorId: indicador.indicadorId,
        estadoIndicador: formData.estadoIndicador || null,
        urlEvidencia: formData.urlEvidencia || null,
        numeroResolucion: formData.numeroResolucion || null,
        fechaResolucion: formData.fechaResolucion || null,
        criterios: formData.criterios.map(c => ({
          criterioId: c.criterioId,
          cumpleCriterio: c.cumpleCriterio
        }))
      };

      const response = await com10IndicadoresCEDAService.save(payload);

      if (response.isSuccess) {
        showSuccessToast(response.data.message || 'Evaluación guardada exitosamente');
        if (onSaved) onSaved();
        onBack();
      } else {
        showErrorToast(response.message || 'Error al guardar la evaluación');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      showErrorToast('Error al guardar la evaluación');
    } finally {
      setSaving(false);
    }
  };

  const handleVerEvidencia = () => {
    if (formData.urlEvidencia) {
      if (formData.urlEvidencia.toLowerCase().endsWith('.pdf')) {
        setShowPdfViewer(true);
      } else {
        window.open(formData.urlEvidencia, '_blank');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {indicador.numeroOrden}. {formData.nombreIndicador}
                </h3>
                {formData.descripcionIndicador && (
                  <p className="text-sm text-gray-600 mt-1">{formData.descripcionIndicador}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-6">
            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                name="estadoIndicador"
                value={formData.estadoIndicador}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="">Seleccione estado</option>
                <option value="Cumple">Cumple</option>
                <option value="Parcial">Parcial</option>
                <option value="No cumple">No cumple</option>
                <option value="No aplica">No aplica</option>
              </select>
            </div>

            {/* Evidencia */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={16} />
                Evidencia
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nro Resolución
                </label>
                <input
                  type="text"
                  name="numeroResolucion"
                  value={formData.numeroResolucion}
                  onChange={handleInputChange}
                  placeholder="Ej: RES-001-2025"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Resolución
                </label>
                <input
                  type="date"
                  name="fechaResolucion"
                  value={formData.fechaResolucion}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                  <LinkIcon size={16} />
                  URL Evidencia
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="urlEvidencia"
                    value={formData.urlEvidencia}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="input-field flex-1"
                  />
                  {formData.urlEvidencia && (
                    <button
                      type="button"
                      onClick={handleVerEvidencia}
                      className="btn-secondary flex items-center gap-2"
                    >
                      Ver PDF
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Criterios de Medición */}
            {formData.criterios.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Criterios de Medición
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Cumple
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.criterios.map((criterio) => (
                        <tr key={criterio.criterioId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {criterio.descripcionCriterio}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={criterio.cumpleCriterio}
                              onChange={(e) => handleCriterioChange(criterio.criterioId, e.target.checked)}
                              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <PDFViewer
          pdfUrl={formData.urlEvidencia}
          onClose={() => setShowPdfViewer(false)}
        />
      )}
    </>
  );
};

IndicadoresCEDADetalle.propTypes = {
  compndaEntId: PropTypes.number.isRequired,
  indicador: PropTypes.shape({
    indicadorId: PropTypes.number.isRequired,
    numeroOrden: PropTypes.number.isRequired,
    nombreIndicador: PropTypes.string.isRequired
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func
};

export default IndicadoresCEDADetalle;
