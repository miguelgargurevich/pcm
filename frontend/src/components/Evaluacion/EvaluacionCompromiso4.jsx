import PropTypes from 'prop-types';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

/**
 * Componente para mostrar los datos del Compromiso 4: Incorporación de TD en el PEI
 * Se usa en la vista de evaluación para mostrar los datos en el panel izquierdo
 */
const EvaluacionCompromiso4 = ({ data, activeTab }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
        <p className="text-sm mt-2">La entidad aún no ha enviado información del PEI.</p>
      </div>
    );
  }

  // Mapear datos - manejar tanto camelCase como PascalCase
  const datosGenerales = {
    anioInicioPei: data.anioInicioPei || data.AnioInicioPei || null,
    anioFinPei: data.anioFinPei || data.AnioFinPei || null,
    fechaAprobacionPei: data.fechaAprobacionPei || data.FechaAprobacionPei || null,
    objetivoPei: data.objetivoPei || data.ObjetivoPei || '',
    descripcionPei: data.descripcionPei || data.DescripcionPei || '',
    alineadoPgd: data.alineadoPgd ?? data.AlineadoPgd ?? false,
    rutaPdfPei: data.rutaPdfPei || data.RutaPdfPei || null,
    rutaPdfNormativa: data.rutaPdfNormativa || data.RutaPdfNormativa || null,
    estado: data.estado || data.Estado || '',
    etapaFormulario: data.etapaFormulario || data.EtapaFormulario || '',
    checkPrivacidad: data.checkPrivacidad ?? data.CheckPrivacidad ?? false,
    checkDdjj: data.checkDdjj ?? data.CheckDdjj ?? false
  };

  // Formatear período de vigencia
  const periodoVigencia = datosGenerales.anioInicioPei && datosGenerales.anioFinPei
    ? `${datosGenerales.anioInicioPei} - ${datosGenerales.anioFinPei}`
    : datosGenerales.anioInicioPei 
      ? `Desde ${datosGenerales.anioInicioPei}`
      : '-';

  // Documentos normativos
  const documentos = [];
  if (datosGenerales.rutaPdfPei) {
    documentos.push({
      id: 1,
      nombre: 'Plan Estratégico Institucional (PEI)',
      url: datosGenerales.rutaPdfPei,
      tipo: 'PEI'
    });
  }
  if (datosGenerales.rutaPdfNormativa) {
    documentos.push({
      id: 2,
      nombre: 'Resolución de Aprobación',
      url: datosGenerales.rutaPdfNormativa,
      tipo: 'Resolución'
    });
  }

  return (
    <div className="space-y-4">
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Estado del Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado del Formulario</label>
              <div className="bg-blue-50 rounded-lg p-3 text-blue-900 font-medium">
                {datosGenerales.estado || 'Sin estado'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Etapa</label>
              <div className="bg-purple-50 rounded-lg p-3 text-purple-900 font-medium">
                {datosGenerales.etapaFormulario || 'Sin etapa'}
              </div>
            </div>
          </div>

          {/* Datos del PEI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Período de Vigencia</label>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-900 font-medium">
                {periodoVigencia}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Aprobación</label>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
                {datosGenerales.fechaAprobacionPei 
                  ? new Date(datosGenerales.fechaAprobacionPei).toLocaleDateString('es-PE')
                  : '-'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Número de Resolución</label>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
                {/* El número de resolución podría estar en el nombre del PDF o en otro campo */}
                {datosGenerales.rutaPdfNormativa ? 'Ver documento' : '-'}
              </div>
            </div>
          </div>

          {/* Objetivo Estratégico */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Objetivo Estratégico relacionado con TD
            </label>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-900">
              {datosGenerales.objetivoPei || 'No especificado'}
            </div>
          </div>

          {/* Descripción del PEI */}
          {datosGenerales.descripcionPei && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Descripción
              </label>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-900 text-sm">
                {datosGenerales.descripcionPei}
              </div>
            </div>
          )}

          {/* Alineación al PGD */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              {datosGenerales.alineadoPgd ? (
                <CheckCircle size={24} className="text-green-600" />
              ) : (
                <XCircle size={24} className="text-red-500" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  El PEI está alineado al Plan de Gobierno Digital
                </p>
                <p className="text-sm text-gray-600">
                  {datosGenerales.alineadoPgd 
                    ? 'La entidad ha confirmado que su PEI incluye objetivos alineados con el Plan de Gobierno Digital.'
                    : 'La entidad no ha confirmado la alineación del PEI con el Plan de Gobierno Digital.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'normativa' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Documentos normativos relacionados con el Plan Estratégico Institucional.
            Haga clic en un documento para previsualizarlo.
          </p>
          
          {documentos.length > 0 ? (
            <div className="space-y-2">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.nombre}</p>
                      <p className="text-xs text-gray-500">PDF - {doc.tipo}</p>
                    </div>
                  </div>
                  <span className="text-primary text-sm font-medium">Ver PDF</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay documentos normativos cargados</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'veracidad' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Validación de la información proporcionada por la entidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Política de Privacidad */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Política de Privacidad</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  datosGenerales.checkPrivacidad ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {datosGenerales.checkPrivacidad ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {datosGenerales.checkPrivacidad 
                  ? 'La entidad aceptó la política de privacidad' 
                  : 'Pendiente de aceptación'}
              </p>
            </div>

            {/* Declaración Jurada */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Declaración Jurada</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  datosGenerales.checkDdjj ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {datosGenerales.checkDdjj ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {datosGenerales.checkDdjj 
                  ? 'La entidad firmó la declaración jurada' 
                  : 'Pendiente de firma'}
              </p>
            </div>
          </div>

          {/* Resumen de verificación */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 mb-3">Resumen de información del PEI</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {datosGenerales.anioInicioPei && datosGenerales.anioFinPei ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
                <span className="text-gray-700">Período de vigencia definido</span>
              </div>
              <div className="flex items-center gap-2">
                {datosGenerales.fechaAprobacionPei ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
                <span className="text-gray-700">Fecha de aprobación registrada</span>
              </div>
              <div className="flex items-center gap-2">
                {datosGenerales.objetivoPei ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
                <span className="text-gray-700">Objetivo estratégico definido</span>
              </div>
              <div className="flex items-center gap-2">
                {datosGenerales.alineadoPgd ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
                <span className="text-gray-700">Alineación con Plan de Gobierno Digital</span>
              </div>
              <div className="flex items-center gap-2">
                {datosGenerales.rutaPdfPei ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
                <span className="text-gray-700">Documento PEI adjunto</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EvaluacionCompromiso4.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired
};

export default EvaluacionCompromiso4;
