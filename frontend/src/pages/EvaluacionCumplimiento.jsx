import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Search, FilterX, ChevronLeft, ChevronRight, Loader2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { showSuccessToast, showErrorToast, showConfirmToast } from '../utils/toast.jsx';
import EvaluacionDetallePanel from '../components/Evaluacion/EvaluacionDetallePanel';
import evaluacionService from '../services/evaluacionService';
import emailService from '../services/emailService';
import com1LiderGTDService from '../services/com1LiderGTDService';
import { useAuth } from '../hooks/useAuth';

// Opciones para los estados
const estadosOptions = [
  'aceptado',
  'enviado',
  'en revisión',
  'en proceso',
  'pendiente',
  'observado',
  'sin reportar',
  'no exigible'
];

const compromisosOptions = Array.from({ length: 21 }, (_, i) => i + 1);

// Colores para los estados (semaforización)
const getEstadoStyles = (estado) => {
  const styles = {
    'aceptado': 'bg-green-500 text-white',
    'enviado': 'bg-blue-500 text-white',
    'en revisión': 'bg-purple-500 text-white',
    'en proceso': 'bg-yellow-500 text-white',
    'pendiente': 'bg-orange-500 text-white',
    'observado': 'bg-red-500 text-white',
    'sin reportar': 'bg-red-700 text-white',
    'no exigible': 'bg-gray-400 text-white'
  };
  return styles[estado] || 'bg-gray-300 text-gray-700';
};

// Abreviaturas para los estados
const getEstadoAbreviado = (estado) => {
  const abreviaturas = {
    'aceptado': 'ACE',
    'enviado': 'ENV',
    'en revisión': 'REV',
    'en proceso': 'PRO',
    'pendiente': 'PEN',
    'observado': 'OBS',
    'sin reportar': 'S/R',
    'no exigible': 'N/E'
  };
  return abreviaturas[estado] || estado.substring(0, 3).toUpperCase();
};

const ITEMS_PER_PAGE = 10;

// Nombres de los compromisos para el correo
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

const EvaluacionCumplimiento = () => {
  const { user } = useAuth();
  const [filtros, setFiltros] = useState({
    entidad: '',
    sectorId: '',
    clasificacionId: '',
    compromisoId: '',
    estado: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para vista de detalle
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);
  const [compromisoSeleccionado, setCompromisoSeleccionado] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  
  // Estados de datos
  const [entidades, setEntidades] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0
  });

  // Cargar datos iniciales (sectores y clasificaciones)
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [sectoresRes, clasificacionesRes] = await Promise.all([
          evaluacionService.getSectores(),
          evaluacionService.getClasificaciones()
        ]);
        
        if (sectoresRes.isSuccess) {
          setSectores(sectoresRes.data);
        }
        if (clasificacionesRes.isSuccess) {
          setClasificaciones(clasificacionesRes.data);
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    
    cargarDatosIniciales();
  }, []);

  // Cargar matriz de evaluación
  const cargarMatriz = useCallback(async () => {
    setLoading(true);
    try {
      const response = await evaluacionService.getMatriz({
        entidad: filtros.entidad || undefined,
        sectorId: filtros.sectorId || undefined,
        clasificacionId: filtros.clasificacionId || undefined,
        compromisoId: filtros.compromisoId || undefined,
        estado: filtros.estado || undefined,
        page: currentPage,
        pageSize: ITEMS_PER_PAGE
      });
      
      if (response.isSuccess) {
        setEntidades(response.data);
        setPagination(response.pagination);
      } else {
        showErrorToast('Error al cargar la matriz de evaluación');
      }
    } catch (error) {
      console.error('Error al cargar matriz:', error);
      showErrorToast('Error al cargar los datos. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [filtros, currentPage]);

  // Cargar matriz cuando cambian filtros o página
  useEffect(() => {
    cargarMatriz();
  }, [cargarMatriz]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const limpiarFiltros = () => {
    setFiltros({
      entidad: '',
      sectorId: '',
      clasificacionId: '',
      compromisoId: '',
      estado: ''
    });
    setCurrentPage(1);
  };

  const handleBuscar = () => {
    setCurrentPage(1);
    cargarMatriz();
  };

  // Handler para click en chip de compromiso
  const handleChipClick = (entidad, compromisoIndex, estado) => {
    setEntidadSeleccionada(entidad);
    setCompromisoSeleccionado(compromisoIndex + 1);
    setEstadoSeleccionado(estado);
    setVistaDetalle(true);
  };

  // Handler para volver a la matriz
  const handleVolver = () => {
    setVistaDetalle(false);
    setEntidadSeleccionada(null);
    setCompromisoSeleccionado(null);
    setEstadoSeleccionado(null);
    // Recargar la matriz para ver los cambios
    cargarMatriz();
  };

  // Handler interno que ejecuta la evaluación
  const ejecutarEvaluacion = async (nuevoEstado, observaciones) => {
    if (entidadSeleccionada && compromisoSeleccionado) {
      try {
        const response = await evaluacionService.updateEstado(
          compromisoSeleccionado,
          entidadSeleccionada.id,
          nuevoEstado,
          observaciones
        );
        
        if (response.isSuccess) {
          // Actualizar el estado local de las entidades
          const nuevasEntidades = entidades.map(e => {
            if (e.id === entidadSeleccionada.id) {
              const nuevosCompromisos = [...e.compromisos];
              nuevosCompromisos[compromisoSeleccionado - 1] = nuevoEstado;
              return { ...e, compromisos: nuevosCompromisos };
            }
            return e;
          });
          
          setEntidades(nuevasEntidades);
          
          // Actualizar también la entidad seleccionada para que el panel refleje el cambio
          setEntidadSeleccionada(prev => {
            if (prev) {
              const nuevosCompromisos = [...(prev.compromisos || [])];
              nuevosCompromisos[compromisoSeleccionado - 1] = nuevoEstado;
              return { ...prev, compromisos: nuevosCompromisos };
            }
            return prev;
          });
          
          // Actualizar el estado seleccionado para el panel de detalle
          setEstadoSeleccionado(nuevoEstado);
          
          // Enviar correo de notificación
          await enviarCorreoEvaluacion(nuevoEstado, observaciones);
          
          // Volver al panel de matriz después de evaluar
          setVistaDetalle(false);
          setEntidadSeleccionada(null);
          setCompromisoSeleccionado(null);
          setEstadoSeleccionado(null);
        } else {
          showErrorToast('Error al actualizar el estado');
        }
      } catch (error) {
        console.error('Error al evaluar:', error);
        showErrorToast('Error al actualizar el estado. Por favor intente nuevamente.');
      }
    }
  };

  // Función para enviar correo de evaluación
  const enviarCorreoEvaluacion = async (nuevoEstado, observaciones) => {
    try {
      console.log('📧 ===== INICIANDO ENVÍO DE CORREO DE EVALUACIÓN =====');
      console.log('🔍 Entidad completa:', entidadSeleccionada);
      console.log('🔍 Entidad ID:', entidadSeleccionada?.id);
      console.log('🔍 Entidad nombre:', entidadSeleccionada?.nombre);
      console.log('🔍 Compromiso:', compromisoSeleccionado);
      console.log('🔍 Estado:', nuevoEstado);
      console.log('🔍 Observaciones:', observaciones);
      
      if (!entidadSeleccionada || !entidadSeleccionada.id) {
        console.error('❌ No hay entidad seleccionada o no tiene ID');
        return;
      }
      
      // Obtener email del Líder GTD (siempre desde C1)
      console.log('🔍 Llamando com1LiderGTDService.getByEntidad(1, ' + entidadSeleccionada.id + ')');
      const response = await com1LiderGTDService.getByEntidad(1, entidadSeleccionada.id);
      console.log('🔍 Respuesta getByEntidad:', response);
      
      if (!response.isSuccess || !response.data) {
        console.warn('⚠️ No se encontró registro del Líder GTD');
        showErrorToast('No se puede enviar el correo: la entidad no ha completado el Compromiso 1');
        return;
      }
      
      const email = response.data.emailLider || response.data.email_lider || response.data.correoElectronico;
      console.log('📧 Email destinatario:', email);
      
      if (!email) {
        console.warn('⚠️ No se encontró email del Líder GTD');
        showErrorToast('No se puede enviar el correo: no hay email registrado en el Compromiso 1');
        return;
      }
      
      // Construir HTML del correo
      const esAprobado = nuevoEstado === 'aceptado';
      const estadoTexto = esAprobado ? 'APROBADO' : 'OBSERVADO';
      const colorEstado = esAprobado ? '#10b981' : '#ef4444';
      const iconoEstado = esAprobado ? '✅' : '⚠️';
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-box { background: ${colorEstado}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 12px; }
            .obs-box { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">${iconoEstado} Evaluación de Cumplimiento Normativo</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Plataforma de Cumplimiento Digital - PCM</p>
            </div>
            
            <div class="content">
              <p>Estimado(a) Líder de Gobierno y Transformación Digital,</p>
              
              <p>Le informamos que su cumplimiento ha sido evaluado:</p>
              
              <div class="status-box">
                <h2 style="margin: 0; font-size: 28px;">${estadoTexto}</h2>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <strong style="color: #667eea;">Compromiso</strong>
                  <p style="margin: 5px 0 0 0;">C${compromisoSeleccionado}</p>
                </div>
                <div class="info-item">
                  <strong style="color: #667eea;">Entidad</strong>
                  <p style="margin: 5px 0 0 0;">${entidadSeleccionada.nombre}</p>
                </div>
                <div class="info-item">
                  <strong style="color: #667eea;">Evaluado por</strong>
                  <p style="margin: 5px 0 0 0;">${user?.nombreCompleto || 'Operador PCM'}</p>
                </div>
                <div class="info-item">
                  <strong style="color: #667eea;">Fecha</strong>
                  <p style="margin: 5px 0 0 0;">${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>
              </div>
              
              ${observaciones ? `
                <div class="obs-box">
                  <strong style="color: #856404;">📝 Observaciones:</strong>
                  <p style="margin: 10px 0 0 0;">${observaciones}</p>
                </div>
              ` : ''}
              
              <p style="margin-top: 30px;">
                ${esAprobado 
                  ? 'Felicitaciones, su cumplimiento ha sido aprobado satisfactoriamente.' 
                  : 'Por favor, revise las observaciones y realice las correcciones necesarias para volver a enviar su cumplimiento.'}
              </p>
              
              <p>Para más detalles, ingrese a la Plataforma de Cumplimiento Digital.</p>
            </div>
            
            <div class="footer">
              <p><strong>Plataforma de Cumplimiento Digital</strong></p>
              <p>Presidencia del Consejo de Ministros - PCM</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const compromisoNombre = COMPROMISOS_NOMBRES[compromisoSeleccionado] || `Compromiso ${compromisoSeleccionado}`;
      
      console.log('📧 Enviando correo con:', { email, compromisoId: compromisoSeleccionado, compromisoNombre, entidadNombre: entidadSeleccionada.nombre });
      
      const success = await emailService.sendEvaluacionNotification(
        email,
        compromisoSeleccionado,
        compromisoNombre,
        entidadSeleccionada.nombre,
        htmlContent
      );
      
      if (success) {
        console.log('✅ Correo de evaluación enviado exitosamente a:', email);
        const accionTexto = nuevoEstado === 'aceptado' ? 'aceptado' : 'observado';
        showSuccessToast(`Compromiso ${compromisoSeleccionado} ${accionTexto} exitosamente. Correo de notificación enviado a ${email}`);
      } else {
        console.warn('⚠️ No se pudo enviar el correo de evaluación');
        const accionTexto = nuevoEstado === 'aceptado' ? 'aprobado' : 'observado';
        showSuccessToast(`Compromiso ${compromisoSeleccionado} ${accionTexto} exitosamente, pero no se pudo enviar el correo de notificación`);
      }
      
      console.log('📧 ===== FIN DEL PROCESO DE ENVÍO DE CORREO =====');
    } catch (error) {
      console.error('❌ Error al enviar correo de evaluación:', error);
      showErrorToast('Error al enviar el correo: ' + error.message);
    }
  };

  // Handler para evaluar un compromiso con confirmación
  const handleEvaluar = async (nuevoEstado, observaciones) => {
    if (!entidadSeleccionada || !compromisoSeleccionado) return;

    const esAprobacion = nuevoEstado === 'aceptado';
    const titulo = esAprobacion 
      ? `¿Confirmar aprobación del Compromiso ${compromisoSeleccionado}?`
      : `¿Confirmar observación del Compromiso ${compromisoSeleccionado}?`;
    const mensaje = esAprobacion
      ? `Se aprobará el cumplimiento para la entidad "${entidadSeleccionada.nombre}".`
      : `Se marcará como observado y se notificará a la entidad "${entidadSeleccionada.nombre}".`;

    showConfirmToast({
      title: titulo,
      message: mensaje,
      confirmText: esAprobacion ? 'Aprobar' : 'Observar',
      cancelText: 'Cancelar',
      loadingText: esAprobacion ? 'Aprobando...' : 'Registrando observación...',
      confirmButtonClass: esAprobacion 
        ? 'px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
        : 'px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors',
      onConfirm: async () => {
        await ejecutarEvaluacion(nuevoEstado, observaciones);
      }
    });
  };

  // Si está en vista de detalle, mostrar el panel
  if (vistaDetalle && entidadSeleccionada) {
    return (
      <div className="h-[calc(100vh-64px)]">
        <EvaluacionDetallePanel
          entidad={entidadSeleccionada}
          compromisoId={compromisoSeleccionado}
          estadoActual={estadoSeleccionado}
          onVolver={handleVolver}
          onEvaluar={handleEvaluar}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-xl">
            <BarChart3 className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Evaluación & Cumplimiento</h1>
            <p className="text-gray-600 mt-1">Matriz de evaluación de compromisos por entidad</p>
          </div>
        </div>
      </div>

      {/* Panel de Búsqueda Avanzada */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        {/* Header del panel */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                <Filter size={20} />
                Filtros
              </button>
              
              {/* Badge de filtros activos */}
              {(filtros.entidad || filtros.sectorId || filtros.clasificacionId || 
                filtros.compromisoId || filtros.estado) && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  Activos
                </span>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entidad
                </label>
                <input
                  type="text"
                  name="entidad"
                  value={filtros.entidad}
                  onChange={handleFiltroChange}
                  placeholder="Buscar entidad..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <select
                  name="sectorId"
                  value={filtros.sectorId}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos los sectores</option>
                  {sectores.map((sector) => (
                    <option key={sector.sectorId} value={sector.sectorId}>
                      {sector.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clasificación
                </label>
                <select
                  name="clasificacionId"
                  value={filtros.clasificacionId}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todas las clasificaciones</option>
                  {clasificaciones.map((clasificacion) => (
                    <option key={clasificacion.clasificacionId} value={clasificacion.clasificacionId}>
                      {clasificacion.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compromiso
                </label>
                <select
                  name="compromisoId"
                  value={filtros.compromisoId}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos los compromisos</option>
                  {compromisosOptions.map((num) => (
                    <option key={num} value={num}>Compromiso {num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  value={filtros.estado}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos los estados</option>
                  {estadosOptions.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={handleBuscar}
                  className="btn-primary flex items-center gap-2 px-4 py-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  Buscar
                </button>
                <button
                  onClick={limpiarFiltros}
                  className="btn-secondary flex items-center gap-2 px-4 py-2"
                  title="Limpiar filtros"
                >
                  <FilterX size={18} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {entidades.length} de {pagination.totalItems} registros
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leyenda de estados - Siempre visible */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Leyenda de estados:</p>
        <div className="flex flex-wrap gap-2">
          {estadosOptions.map((estado) => (
            <span
              key={estado}
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoStyles(estado)}`}
            >
              {getEstadoAbreviado(estado)} - {estado}
            </span>
          ))}
        </div>
      </div>

      {/* Matriz de Evaluación */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-primary" />
            <span className="ml-4 text-gray-600">Cargando matriz de evaluación...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  {/* Columna fija de Entidad */}
                  <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300 min-w-[300px]">
                    Entidad
                  </th>
                  {/* Columnas de compromisos */}
                  {Array.from({ length: 21 }, (_, i) => (
                    <th
                      key={i + 1}
                      className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[60px]"
                    >
                      C{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entidades.map((entidad, index) => (
                  <tr key={entidad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    {/* Columna fija de Entidad */}
                    <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-900 border-r-2 border-gray-300 min-w-[300px] hover:bg-gray-50">
                      <div className="truncate max-w-[280px]" title={entidad.nombre}>
                        {entidad.nombre}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {entidad.sector} • {entidad.clasificacion}
                      </div>
                    </td>
                    {/* Celdas de compromisos - chips clickeables */}
                    {entidad.compromisos.map((estado, index) => (
                      <td key={index} className="px-1 py-2 text-center">
                        <button
                          onClick={() => handleChipClick(entidad, index, estado)}
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-all hover:scale-110 hover:shadow-md ${getEstadoStyles(estado)}`}
                          title={`Clic para evaluar Compromiso ${index + 1}: ${estado}`}
                        >
                          {getEstadoAbreviado(estado)}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {entidades.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No se encontraron entidades con los filtros aplicados</p>
              </div>
            )}
          </div>
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalItems)} de {pagination.totalItems} registros
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg">
                {currentPage}
              </span>
              <span className="text-sm text-gray-600">de {pagination.totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-1 text-sm text-gray-600 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluacionCumplimiento;
