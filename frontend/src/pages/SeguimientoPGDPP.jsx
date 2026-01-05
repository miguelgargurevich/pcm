import { useState, useEffect, useMemo } from 'react';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toast.jsx';
import { FilterX, X, Save, FolderKanban, TrendingUp, Edit2, Filter, ChevronDown, ChevronUp, Plus, Upload, Download, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import com3EPGDService from '../services/com3EPGDService';
import * as XLSX from 'xlsx';

// Función auxiliar para formatear fecha a YYYY-MM-DD para inputs de tipo date
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  // Si es un objeto Date o string ISO, convertir
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

// Datos de ejemplo eliminados - ahora se cargan desde la API

// Opciones para los selects
const etapasOptions = [
  'SIN INICIAR',
  'PLANIFICACIÓN',
  'EJECUCIÓN',
  'CERRADO'
];

const tiposProyectoOptions = [
  'SOFTWARE O APLICACIONES',
  'RENOVACIÓN TECNOLÓGICA y/o INFRAESTRUCTURA',
  'IMPLEMENTACIÓN DE METODOLOGÍA',
  'CAPACITACIÓN',
  'OTRO'
];

const tiposBeneficiarioOptions = ['INTERNO', 'EXTERNO'];
const ambitosOptions = ['LOCAL', 'REGIONAL', 'NACIONAL'];

const SeguimientoPGDPP = () => {
  const { user } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    codigo: '',
    nombre: '',
    etapa: '',
    tipoProyecto: '',
    ambito: ''
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Función para descargar plantilla Excel
  const downloadPlantillaExcel = () => {
    try {
      const encabezados = [
        'Código', 'Nombre', 'Alcance', 'Justificación', 'Tipo', 'Obj. Estratégico',
        'Obj. Transformación Digital', 'Área Proyecto', 'Área Ejecutora', 'Tipo Beneficiario',
        'Etapa', 'Ámbito', 'Fecha Inicio Programada', 'Fecha Fin Programada',
        'Fecha Inicio Real', 'Fecha Fin Real', 'Estado', 'Alineado PGD', 'Acción Estratégica',
        'Porcentaje Avance', 'Informó Avance'
      ];

      const datosEjemplo = [
        'PGD-2026-001', 'Sistema de Gestión Documental', 'Nacional', 'Modernizar la gestión documentaria', 
        'SOFTWARE O APLICACIONES', 'Modernización del Estado', 'Digitalización de procesos', 'TI', 'OGTI',
        'INTERNO', 'PLANIFICACIÓN', 'NACIONAL', '2026-01-15', '2026-12-15',
        '', '', 'Activo', 'Sí', 'Transformación Digital', '25', 'true'
      ];

      // Intentar usar XLSX primero
      if (XLSX) {
        const ws = XLSX.utils.aoa_to_sheet([encabezados, datosEjemplo]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Plantilla PGD-PP');

        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 },
          { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
          { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 15 }, 
          { wch: 20 }, { wch: 15 }, { wch: 15 }
        ];
        ws['!cols'] = colWidths;

        XLSX.writeFile(wb, 'Plantilla_PGD_PP.xlsx');
        showSuccessToast('📊 Plantilla Excel descargada', 'Complete los datos y luego importe el archivo');
        return;
      }

      // Respaldo con CSV
      const BOM = '\uFEFF';
      const csvContent = BOM + [
        encabezados.join(','),
        datosEjemplo.map(field => `"${field}"`).join(',')
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'Plantilla_PGD_PP.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccessToast('📊 Plantilla CSV descargada', 'Puede abrirse en Excel. Complete los datos y luego importe el archivo.');
    } catch (error) {
      console.error('Error al generar plantilla:', error);
      showErrorToast('Error al generar la plantilla');
    }
  };

  // Form data para el modal
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    alcance: '',
    justificacion: '',
    tipoProyecto: '',
    objEstrategico: '',
    objTransformacionDigital: '',
    areaProyecto: '',
    areaEjecutora: '',
    tipoBeneficiario: '',
    etapa: '',
    ambito: '',
    fechaInicioProg: '',
    fechaFinProg: '',
    fechaInicioReal: '',
    fechaFinReal: '',
    estado: '',
    alineadoPgd: '',
    accionEstrategica: '',
    porcentajeAvance: 0,
    informoAvance: false
  });

  // Cargar proyectos desde la API
  useEffect(() => {
    const loadProyectos = async () => {
      if (!user?.entidadId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await com3EPGDService.getByEntidad(user.entidadId);
        
        if (response.isSuccess && response.data) {
          const data = response.data;
          
          console.log('📦 Proyectos recibidos del backend:', data.proyectos);
          
          // Mapear proyectos desde la BD al formato de la vista
          const proyectosMapeados = (data.proyectos || []).map((p, index) => {
            const proyecto = {
              id: p.proyectoId || p.proyEntId || index, // Usar proyEntId como ID principal
              codigo: p.numeracionProy,
              nombre: p.nombre,
              alcance: p.alcance || '',
              justificacion: p.justificacion || '',
              tipoProyecto: p.tipoProy,
              objEstrategico: p.objEstrategico || '',
              objTransformacionDigital: p.objTransformacionDigital || '',
              areaProyecto: p.areaProyecto || '',
              areaEjecutora: p.areaEjecutora || '',
              tipoBeneficiario: p.tipoBeneficiario,
              etapa: p.etapaProyecto,
              ambito: p.ambitoProyecto,
              fechaInicioProg: p.fecIniProg,
              fechaFinProg: p.fecFinProg,
              fechaInicioReal: p.fecIniReal,
              fechaFinReal: p.fecFinReal,
              estado: p.estadoProyecto ? 'Activo' : 'Inactivo',
              alineadoPgd: p.alineadoPgd || '',
              accionEstrategica: p.accEst || '',
              porcentajeAvance: p.porcentajeAvance || 0,
              informoAvance: p.informoAvance || false
            };
            
            console.log(`Proyecto ${index}:`, proyecto);
            return proyecto;
          });

          setProyectos(proyectosMapeados);
        }
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        showErrorToast('Error al cargar los proyectos del portafolio');
      } finally {
        setLoading(false);
      }
    };

    loadProyectos();
  }, [user]);

  // Función para importar Excel/CSV
  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      setIsImporting(true);
      
      // Determinar si es un archivo Excel o CSV
      const isExcelFile = file.name.toLowerCase().includes('.xlsx') || file.name.toLowerCase().includes('.xls');
      
      if (isExcelFile && XLSX) {
        // Procesar archivo Excel
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length < 2) {
              showErrorToast('El archivo debe contener al menos 2 líneas (encabezado y datos)');
              setIsImporting(false);
              return;
            }
            
            procesarDatosImportados(jsonData);
          } catch (error) {
            console.error('Error al procesar Excel:', error);
            showErrorToast('Error al procesar el archivo Excel');
            setIsImporting(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // Procesar archivo CSV
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target.result;
            const lines = text.split('\n');
            
            if (lines.length < 2) {
              showErrorToast('El archivo debe contener al menos 2 líneas (encabezado y datos)');
              setIsImporting(false);
              return;
            }
            
            // Convertir CSV a formato array
            const parseCSVLine = (line) => {
              const result = [];
              let current = '';
              let inQuotes = false;
              
              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                  result.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              result.push(current.trim());
              return result;
            };
            
            const csvData = lines
              .filter(line => line.trim())
              .map(line => parseCSVLine(line));
              
            procesarDatosImportados(csvData);
          } catch (error) {
            console.error('Error al procesar CSV:', error);
            showErrorToast('Error al procesar el archivo CSV');
            setIsImporting(false);
          }
        };
        reader.readAsText(file, 'UTF-8');
      }
    };
    
    input.click();
  };

  const procesarDatosImportados = (data) => {
    try {
      const proyectosImportados = [];
      
      // Procesar desde la fila 1 (saltando encabezados)
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length < 3) continue;
        
        const nuevoProyecto = {
          id: Date.now() + i,
          codigo: row[0] || `PGD-${Date.now()}-${i}`,
          nombre: row[1] || '',
          alcance: row[2] || '',
          justificacion: row[3] || '',
          tipoProyecto: row[4] || '',
          objEstrategico: row[5] || '',
          objTransformacionDigital: row[6] || '',
          areaProyecto: row[7] || '',
          areaEjecutora: row[8] || '',
          tipoBeneficiario: row[9] || '',
          etapa: row[10] || 'SIN INICIAR',
          ambito: row[11] || '',
          fechaInicioProg: row[12] || '',
          fechaFinProg: row[13] || '',
          fechaInicioReal: row[14] || '',
          fechaFinReal: row[15] || '',
          estado: row[16] || 'Activo',
          alineadoPgd: row[17] || '',
          accionEstrategica: row[18] || '',
          porcentajeAvance: parseInt(row[19]) || 0,
          informoAvance: row[20] === 'true' || false
        };
        
        // Validar datos mínimos
        if (nuevoProyecto.nombre.trim()) {
          proyectosImportados.push(nuevoProyecto);
        }
      }

      if (proyectosImportados.length === 0) {
        showErrorToast('No se encontraron datos válidos en el archivo');
      } else {
        setProyectos(prevProyectos => [...prevProyectos, ...proyectosImportados]);
        showSuccessToast('📥 Importación exitosa', `Se importaron ${proyectosImportados.length} proyecto(s) exitosamente`);
      }
      
    } catch (error) {
      console.error('Error al procesar datos:', error);
      showErrorToast('Error al procesar los datos importados');
    } finally {
      setIsImporting(false);
    }
  };

  // Función para exportar Excel
  const handleExportExcel = () => {
    if (proyectos.length === 0) {
      showInfoToast('No hay proyectos para exportar');
      return;
    }
    
    try {
      const encabezados = [
        'Código', 'Nombre', 'Alcance', 'Justificación', 'Tipo', 'Obj. Estratégico',
        'Obj. Transformación Digital', 'Área Proyecto', 'Área Ejecutora', 'Tipo Beneficiario',
        'Etapa', 'Ámbito', 'Fecha Inicio Programada', 'Fecha Fin Programada',
        'Fecha Inicio Real', 'Fecha Fin Real', 'Estado', 'Alineado PGD', 'Acción Estratégica',
        'Porcentaje Avance', 'Informó Avance'
      ];
      
      // Helper para formatear fechas en exportación
      const formatDateForExport = (dateStr) => {
        if (!dateStr) return '';
        try {
          if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('es-PE');
          }
          const date = new Date(dateStr);
          return date.toLocaleDateString('es-PE');
        } catch {
          return '';
        }
      };
      
      const datosExport = proyectos.map(proyecto => [
        proyecto.codigo || '',
        proyecto.nombre || '',
        proyecto.alcance || '',
        proyecto.justificacion || '',
        proyecto.tipoProyecto || '',
        proyecto.objEstrategico || '',
        proyecto.objTransformacionDigital || '',
        proyecto.areaProyecto || '',
        proyecto.areaEjecutora || '',
        proyecto.tipoBeneficiario || '',
        proyecto.etapa || '',
        proyecto.ambito || '',
        formatDateForExport(proyecto.fechaInicioProg),
        formatDateForExport(proyecto.fechaFinProg),
        formatDateForExport(proyecto.fechaInicioReal),
        formatDateForExport(proyecto.fechaFinReal),
        proyecto.estado || 'Activo',
        proyecto.alineadoPgd || '',
        proyecto.accionEstrategica || '',
        proyecto.porcentajeAvance || 0,
        proyecto.informoAvance ? 'Sí' : 'No'
      ]);

      const fecha = new Date().toISOString().split('T')[0];

      // Intentar usar XLSX primero
      if (XLSX) {
        const ws = XLSX.utils.aoa_to_sheet([encabezados, ...datosExport]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PGD Portafolio Proyectos');
        
        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 },
          { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
          { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 15 }, 
          { wch: 20 }, { wch: 15 }, { wch: 15 }
        ];
        ws['!cols'] = colWidths;
        
        const nombreArchivo = `PGD_Portafolio_Proyectos_${fecha}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);
        showSuccessToast('📤 Exportación Excel exitosa', `Archivo: ${nombreArchivo}`);
        return;
      }

      // Respaldo con CSV
      const BOM = '\uFEFF';
      const csvContent = BOM + [
        encabezados.join(','),
        ...datosExport.map(row => 
          row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const nombreArchivo = `PGD_Portafolio_Proyectos_${fecha}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', nombreArchivo);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccessToast('📤 Exportación CSV exitosa', `Archivo: ${nombreArchivo}. Se puede abrir en Excel.`);
    } catch (error) {
      console.error('Error al exportar:', error);
      showErrorToast('Error al exportar el archivo. Inténtelo nuevamente.');
    }
  };

  // Función para nuevo proyecto
  const handleNuevoProyecto = () => {
    setEditingProyecto(null);
    setFormData({
      codigo: `PGD-${new Date().getFullYear()}-${String(proyectos.length + 1).padStart(3, '0')}`,
      nombre: '',
      tipoProyecto: '',
      tipoBeneficiario: '',
      fechaInicioProg: '',
      fechaFinProg: '',
      fechaInicioReal: '',
      fechaFinReal: '',
      etapa: 'SIN INICIAR',
      porcentajeAvance: 0,
      informoAvance: false,
      ambito: ''
    });
    setShowModal(true);
  };

  // Aplicar filtros
  const proyectosFiltrados = useMemo(() => {
    let filtered = [...proyectos];

    if (filtros.codigo.trim()) {
      const busqueda = filtros.codigo.toLowerCase();
      filtered = filtered.filter((p) =>
        p.codigo?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.nombre.trim()) {
      const busqueda = filtros.nombre.toLowerCase();
      filtered = filtered.filter((p) =>
        p.nombre?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.etapa) {
      filtered = filtered.filter((p) => p.etapa === filtros.etapa);
    }

    if (filtros.tipoProyecto) {
      filtered = filtered.filter((p) => p.tipoProyecto === filtros.tipoProyecto);
    }

    if (filtros.ambito) {
      filtered = filtered.filter((p) => p.ambito === filtros.ambito);
    }

    return filtered;
  }, [proyectos, filtros]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setPaginaActual(1); // Reset a primera página cuando cambian filtros
  };

  const limpiarFiltros = () => {
    setFiltros({ codigo: '', nombre: '', etapa: '', tipoProyecto: '', ambito: '' });
    setPaginaActual(1);
  };

  // Calcular proyectos paginados
  const indiceUltimo = paginaActual * itemsPorPagina;
  const indicePrimero = indiceUltimo - itemsPorPagina;
  const proyectosPaginados = proyectosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(proyectosFiltrados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowClick = (proyecto) => {
    setEditingProyecto(proyecto);
    setFormData({
      codigo: proyecto.codigo || '',
      nombre: proyecto.nombre || '',
      alcance: proyecto.alcance || '',
      justificacion: proyecto.justificacion || '',
      tipoProyecto: proyecto.tipoProyecto || '',
      objEstrategico: proyecto.objEstrategico || '',
      objTransformacionDigital: proyecto.objTransformacionDigital || '',
      areaProyecto: proyecto.areaProyecto || '',
      areaEjecutora: proyecto.areaEjecutora || '',
      tipoBeneficiario: proyecto.tipoBeneficiario || '',
      etapa: proyecto.etapa || '',
      ambito: proyecto.ambito || '',
      fechaInicioProg: formatDateForInput(proyecto.fechaInicioProg),
      fechaFinProg: formatDateForInput(proyecto.fechaFinProg),
      fechaInicioReal: formatDateForInput(proyecto.fechaInicioReal),
      fechaFinReal: formatDateForInput(proyecto.fechaFinReal),
      estado: proyecto.estado || '',
      alineadoPgd: proyecto.alineadoPgd || '',
      accionEstrategica: proyecto.accionEstrategica || '',
      porcentajeAvance: proyecto.porcentajeAvance || 0,
      informoAvance: proyecto.informoAvance || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('📝 FormData antes de guardar:', formData);
      console.log('📊 Porcentaje avance:', formData.porcentajeAvance, 'Tipo:', typeof formData.porcentajeAvance);
      console.log('� Informó avance:', formData.informoAvance, 'Tipo:', typeof formData.informoAvance);
      console.log('🔑 Proyecto en edición:', editingProyecto);
      
      // Verificar que editingProyecto no sea null
      if (!editingProyecto) {
        showErrorToast('No hay proyecto seleccionado para editar');
        return;
      }
      
      // Actualizar el proyecto en el estado local
      const proyectosActualizados = proyectos.map(p => {
        // Comparar por ID o por código si el ID no existe
        const esElMismo = (p.id && editingProyecto?.id && p.id === editingProyecto.id) || 
                          (p.codigo === editingProyecto?.codigo);
        
        if (esElMismo) {
          const proyectoActualizado = {
            ...p,
            ...formData,
            porcentajeAvance: Number(formData.porcentajeAvance) || 0,
            informoAvance: Boolean(formData.informoAvance)
          };
          console.log('✅ Proyecto actualizado localmente:', proyectoActualizado);
          return proyectoActualizado;
        }
        return p;
      });

      // Obtener el compromiso completo actual desde la API
      const compromisoResponse = await com3EPGDService.getByEntidad(user.entidadId);
      
      if (!compromisoResponse.isSuccess || !compromisoResponse.data) {
        showErrorToast('No se pudo obtener los datos del compromiso');
        return;
      }

      const compromiso = compromisoResponse.data;

      // Preparar los proyectos para enviar al backend (mapear de vista a BD)
      const proyectosParaBackend = proyectosActualizados.map(p => {
        const proyectoBackend = {
          proyEntId: p.id && typeof p.id === 'number' ? p.id : null, // Usar proyEntId según la entidad del backend
          numeracionProy: p.codigo,
          nombre: p.nombre,
          alcance: p.alcance || '',
          justificacion: p.justificacion || '',
          tipoProy: p.tipoProyecto,
          objEstrategico: p.objEstrategico || '',
          objTransformacionDigital: p.objTransformacionDigital || '',
          areaProyecto: p.areaProyecto || '',
          areaEjecutora: p.areaEjecutora || '',
          tipoBeneficiario: p.tipoBeneficiario,
          fecIniProg: p.fechaInicioProg,
          fecFinProg: p.fechaFinProg,
          fecIniReal: p.fechaInicioReal,
          fecFinReal: p.fechaFinReal,
          etapaProyecto: p.etapa,
          porcentajeAvance: Number(p.porcentajeAvance) || 0,
          informoAvance: Boolean(p.informoAvance),
          ambitoProyecto: p.ambito,
          estadoProyecto: p.estado === 'Activo' ? true : false,
          alineadoPgd: p.alineadoPgd || '',
          accEst: p.accionEstrategica || ''
        };
        
        if (p.codigo === editingProyecto?.codigo) {
          console.log('🚀 Proyecto a enviar al backend:', proyectoBackend);
        }
        
        return proyectoBackend;
      });

      // Actualizar el compromiso completo con los proyectos modificados
      const updateData = {
        ...compromiso,
        proyectos: proyectosParaBackend
      };
      
      console.log('📤 Datos completos a enviar:', updateData);

      const updateResponse = await com3EPGDService.update(compromiso.comepgdEntId, updateData);
      
      if (!updateResponse.isSuccess) {
        showErrorToast('Error al guardar los cambios en la base de datos');
        return;
      }

      // Actualizar el estado local
      setProyectos(proyectosActualizados);
      setShowModal(false);
      setEditingProyecto(null);
      showSuccessToast('Proyecto actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      showErrorToast('Error al guardar los cambios');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  };

  const getEtapaBadgeClass = (etapa) => {
    switch (etapa) {
      case 'CERRADO':
        return 'bg-gray-100 text-gray-800';
      case 'EJECUCIÓN':
        return 'bg-blue-100 text-blue-800';
      case 'PLANIFICACIÓN':
        return 'bg-yellow-100 text-yellow-800';
      case 'SIN INICIAR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Seguimiento PGD-PP</h1>
              <p className="text-gray-600 mt-1">Plan de Gobierno Digital - Portafolio de Proyectos</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              <button
                onClick={downloadPlantillaExcel}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200"
                title="Descargar plantilla Excel para importar proyectos"
              >
                <FileText size={16} />
                Plantilla
              </button>
              
              <button
                onClick={handleImportExcel}
                disabled={isImporting}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200 disabled:opacity-50"
                title="Importar proyectos desde Excel/CSV"
              >
                <Upload size={16} />
                {isImporting ? 'Importando...' : 'Importar'}
              </button>
              
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200"
                title="Exportar proyectos a Excel"
              >
                <Download size={16} />
                Exportar
              </button>
            </div>
            
            <button
              onClick={handleNuevoProyecto}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
            >
              <Plus size={18} />
              Nuevo Proyecto
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        {/* Header del panel de filtros */}
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
              {(filtros.codigo || filtros.nombre || filtros.etapa || filtros.tipoProyecto || filtros.ambito) && (
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

        {/* Contenido de filtros colapsable */}
        {showFilters && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={filtros.codigo}
                  onChange={handleFiltroChange}
                  placeholder="Buscar código..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={filtros.nombre}
                  onChange={handleFiltroChange}
                  placeholder="Buscar nombre..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo Proyecto
                </label>
                <select
                  name="tipoProyecto"
                  value={filtros.tipoProyecto}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos los tipos</option>
                  {tiposProyectoOptions.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etapa
                </label>
                <select
                  name="etapa"
                  value={filtros.etapa}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todas las etapas</option>
                  {etapasOptions.map((etapa) => (
                    <option key={etapa} value={etapa}>{etapa}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ámbito
                </label>
                <select
                  name="ambito"
                  value={filtros.ambito}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos los ámbitos</option>
                  {ambitosOptions.map((ambito) => (
                    <option key={ambito} value={ambito}>{ambito}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {proyectosPaginados.length} de {proyectosFiltrados.length} registros
              </div>
              <button
                onClick={limpiarFiltros}
                className="btn-secondary flex items-center gap-2 px-4 py-2"
                title="Limpiar filtros"
              >
                <FilterX size={20} />
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leyenda de etapas - Siempre visible */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Leyenda de etapas:</p>
        <div className="flex flex-wrap gap-2">
          {etapasOptions.map((etapa) => (
            <span
              key={etapa}
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getEtapaBadgeClass(etapa)}`}
            >
              {etapa}
            </span>
          ))}
        </div>
      </div>

      {/* Panel de Lista - Portafolio de Proyectos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FolderKanban size={20} />
            Portafolio de Proyectos ({proyectosFiltrados.length})
          </h2>
        </div> */}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px] min-w-[80px]">
                  #
                </th>
                <th className="sticky left-[80px] z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px] min-w-[140px]">
                  Código
                </th>
                <th className="sticky left-[220px] z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[350px] min-w-[350px]">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Proyecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Beneficiario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio Prog.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin Prog.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio Real
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin Real
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etapa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Avance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Informó Avance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ámbito
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proyectosPaginados.map((proyecto, index) => (
                <tr 
                  key={proyecto.id} 
                  className="hover:bg-gray-50 cursor-pointer group"
                  onClick={() => handleRowClick(proyecto)}
                >
                  <td className="sticky left-0 z-10 bg-gray-50 group-hover:bg-gray-100 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-[80px] min-w-[80px]">
                    {((paginaActual - 1) * itemsPorPagina) + index + 1}
                  </td>
                  <td className="sticky left-[80px] z-10 bg-gray-50 group-hover:bg-gray-100 px-6 py-4 whitespace-nowrap text-sm font-medium text-primary w-[140px] min-w-[140px]">
                    {proyecto.codigo}
                  </td>
                  <td className="sticky left-[220px] z-10 bg-gray-50 group-hover:bg-gray-100 px-6 py-4 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer w-[350px] min-w-[350px]">
                    {proyecto.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proyecto.tipoProyecto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proyecto.tipoBeneficiario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proyecto.fechaInicioProg)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proyecto.fechaFinProg)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proyecto.fechaInicioReal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proyecto.fechaFinReal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEtapaBadgeClass(proyecto.etapa)}`}>
                      {proyecto.etapa}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${proyecto.porcentajeAvance}%` }}
                        ></div>
                      </div>
                      <span>{proyecto.porcentajeAvance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${proyecto.informoAvance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {proyecto.informoAvance ? 'SI' : 'NO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proyecto.ambito}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {proyectosFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FolderKanban size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No se encontraron proyectos</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Mostrando {((paginaActual - 1) * itemsPorPagina) + 1} - {Math.min(paginaActual * itemsPorPagina, proyectosFiltrados.length)} de {proyectosFiltrados.length} registros
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual <= 1}
                className="px-3 py-1 text-sm text-gray-600 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg">
                {paginaActual}
              </span>
              <span className="text-sm text-gray-600">de {totalPaginas}</span>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual >= totalPaginas}
                className="px-3 py-1 text-sm text-gray-600 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Proyecto */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
              <div className="flex items-center gap-3">
                <FolderKanban className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">{editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
                  <p className="text-sm text-white/80">Plan de Gobierno Digital - Portafolio de Proyectos</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProyecto(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Sección 1: Datos Básicos */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Datos Básicos</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Código</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      disabled
                      className="input-field-readonly"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del Proyecto *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      required
                      maxLength={100}
                      className="input-field-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Alcance</label>
                    <input
                      type="text"
                      value={formData.alcance}
                      onChange={(e) => setFormData(prev => ({ ...prev, alcance: e.target.value }))}
                      maxLength={100}
                      className="input-field-sm"
                      placeholder="Ej: Nacional, Regional, Local"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Justificación</label>
                    <input
                      type="text"
                      value={formData.justificacion}
                      onChange={(e) => setFormData(prev => ({ ...prev, justificacion: e.target.value }))}
                      maxLength={200}
                      className="input-field-sm"
                      placeholder="Justificación del proyecto"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Clasificación */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-blue-900">Clasificación</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Proyecto *</label>
                    <select
                      value={formData.tipoProyecto}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipoProyecto: e.target.value }))}
                      required
                      className="input-field-sm"
                    >
                      <option value="">Seleccione...</option>
                      {tiposProyectoOptions.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo Beneficiario *</label>
                    <select
                      value={formData.tipoBeneficiario}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipoBeneficiario: e.target.value }))}
                      required
                      className="input-field-sm"
                    >
                      <option value="">Seleccione...</option>
                      {tiposBeneficiarioOptions.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ámbito *</label>
                    <select
                      value={formData.ambito}
                      onChange={(e) => setFormData(prev => ({ ...prev, ambito: e.target.value }))}
                      required
                      className="input-field-sm"
                    >
                      <option value="">Seleccione...</option>
                      {ambitosOptions.map(ambito => (
                        <option key={ambito} value={ambito}>{ambito}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección 3: Objetivos y Áreas */}
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-green-900">Objetivos y Áreas</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Objetivo Estratégico</label>
                    <input
                      type="text"
                      value={formData.objEstrategico}
                      onChange={(e) => setFormData(prev => ({ ...prev, objEstrategico: e.target.value }))}
                      maxLength={150}
                      className="input-field-sm"
                      placeholder="Objetivo estratégico del proyecto"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Obj. Transformación Digital</label>
                    <input
                      type="text"
                      value={formData.objTransformacionDigital}
                      onChange={(e) => setFormData(prev => ({ ...prev, objTransformacionDigital: e.target.value }))}
                      maxLength={150}
                      className="input-field-sm"
                      placeholder="Objetivo de transformación digital"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Área del Proyecto</label>
                    <input
                      type="text"
                      value={formData.areaProyecto}
                      onChange={(e) => setFormData(prev => ({ ...prev, areaProyecto: e.target.value }))}
                      maxLength={100}
                      className="input-field-sm"
                      placeholder="Área responsable del proyecto"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Área Ejecutora</label>
                    <input
                      type="text"
                      value={formData.areaEjecutora}
                      onChange={(e) => setFormData(prev => ({ ...prev, areaEjecutora: e.target.value }))}
                      maxLength={100}
                      className="input-field-sm"
                      placeholder="Área que ejecuta el proyecto"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Fechas y Cronograma */}
              <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-yellow-900">Cronograma</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Inicio Prog. *</label>
                    <input
                      type="date"
                      value={formData.fechaInicioProg}
                      onChange={(e) => setFormData(prev => ({ ...prev, fechaInicioProg: e.target.value }))}
                      required
                      className="input-field-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Fin Prog. *</label>
                    <input
                      type="date"
                      value={formData.fechaFinProg}
                      onChange={(e) => setFormData(prev => ({ ...prev, fechaFinProg: e.target.value }))}
                      min={formData.fechaInicioProg || ''}
                      required
                      className="input-field-sm"
                    />
                    {formData.fechaInicioProg && <p className="text-xs text-gray-500 mt-1">Debe ser mayor o igual a fecha inicio</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Inicio Real</label>
                    <input
                      type="date"
                      value={formData.fechaInicioReal}
                      onChange={(e) => setFormData(prev => ({ ...prev, fechaInicioReal: e.target.value }))}
                      max={new Date().toISOString().split('T')[0]}
                      className="input-field-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">No puede ser una fecha futura</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Fin Real</label>
                    <input
                      type="date"
                      value={formData.fechaFinReal}
                      onChange={(e) => setFormData(prev => ({ ...prev, fechaFinReal: e.target.value }))}
                      min={formData.fechaInicioReal || ''}
                      max={new Date().toISOString().split('T')[0]}
                      className="input-field-sm"
                    />
                    {formData.fechaInicioReal && <p className="text-xs text-gray-500 mt-1">Debe ser mayor o igual a fecha inicio real y no futura</p>}
                  </div>
                </div>
              </div>

              {/* Sección 4: Estado y Avance */}
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-green-900">Estado y Avance</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Etapa *</label>
                    <select
                      value={formData.etapa}
                      onChange={(e) => setFormData(prev => ({ ...prev, etapa: e.target.value }))}
                      required
                      className="input-field-sm"
                    >
                      <option value="">Seleccione...</option>
                      {etapasOptions.map(etapa => (
                        <option key={etapa} value={etapa}>{etapa}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Porcentaje de Avance *</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        value={formData.porcentajeAvance}
                        onChange={(e) => setFormData(prev => ({ ...prev, porcentajeAvance: parseInt(e.target.value) }))}
                        min="0"
                        max="100"
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md min-w-[45px] text-center border">
                        {formData.porcentajeAvance}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Informó Avance *</label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="informoAvance"
                          checked={formData.informoAvance === true}
                          onChange={() => setFormData(prev => ({ ...prev, informoAvance: true }))}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-xs">Sí</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="informoAvance"
                          checked={formData.informoAvance === false}
                          onChange={() => setFormData(prev => ({ ...prev, informoAvance: false }))}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-xs">No</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Estado del Proyecto</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                      className="input-field-sm"
                    >
                      <option value="">Seleccione...</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Suspendido">Suspendido</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Alineado al PGD</label>
                    <select
                      value={formData.alineadoPgd}
                      onChange={(e) => setFormData(prev => ({ ...prev, alineadoPgd: e.target.value }))}
                      className="input-field-sm"
                    >
                      <option value="">Seleccione...</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                      <option value="Parcial">Parcial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Acción Estratégica</label>
                    <input
                      type="text"
                      value={formData.accionEstrategica}
                      onChange={(e) => setFormData(prev => ({ ...prev, accionEstrategica: e.target.value }))}
                      maxLength={150}
                      className="input-field-sm"
                      placeholder="Acción estratégica asociada"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer con botones */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingProyecto(null);
                }}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <Save size={16} />
                {editingProyecto ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeguimientoPGDPP;
