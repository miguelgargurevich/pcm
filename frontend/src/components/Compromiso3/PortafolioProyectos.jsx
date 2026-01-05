import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, Download, X, FileText, Loader } from 'lucide-react';
import * as XLSX from 'xlsx';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../utils/toast.jsx';

/**
 * Componente para gestionar el Portafolio de Proyectos
 */
const PortafolioProyectos = ({ proyectos = [], onProyectosChange, viewMode = false }) => {
  const [localProyectos, setLocalProyectos] = useState(proyectos);
  const [showModal, setShowModal] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
    estado: true,
    alineadoPgd: '',
    accionEstrategica: '',
    porcentajeAvance: 0,
    informoAvance: false
  });

  useEffect(() => {
    console.log('📊 Proyectos recibidos en PortafolioProyectos:', proyectos);
    setLocalProyectos(proyectos);
  }, [proyectos]);

  const generarCodigoProyecto = () => {
    const count = localProyectos.length + 1;
    const year = new Date().getFullYear();
    return `PP-${year}-${count.toString().padStart(3, '0')}`;
  };

  const downloadPlantillaExcel = () => {
    try {
      const encabezados = [
        'Código', 'Nombre', 'Alcance', 'Justificación', 'Tipo', 'Obj. Estratégico',
        'Obj. Transformación Digital', 'Área Proyecto', 'Área Ejecutora', 'Tipo Beneficiario',
        'Etapa', 'Ámbito', 'Fecha Inicio Programada', 'Fecha Fin Programada',
        'Fecha Inicio Real', 'Fecha Fin Real', 'Estado', 'Alineado PGD', 'Acción Estratégica'
      ];

      const datosEjemplo = [
        'PP-2026-001', 'Sistema de Gestión Documental', 'Nacional', 'Modernizar la gestión documentaria', 
        'Software', 'Modernización del Estado', 'Digitalización de procesos', 'TI', 'OGTI',
        'Funcionarios públicos', 'Desarrollo', 'Nacional', '2026-01-15', '2026-12-15',
        '', '', 'Activo', 'Sí', 'Transformación Digital'
      ];

      // Intentar usar XLSX primero
      if (XLSX) {
        const ws = XLSX.utils.aoa_to_sheet([encabezados, datosEjemplo]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Plantilla Proyectos');

        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 25 },
          { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
          { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 15 }, { wch: 20 }
        ];
        ws['!cols'] = colWidths;

        XLSX.writeFile(wb, 'Plantilla_Portafolio_Proyectos.xlsx');
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
      link.setAttribute('download', 'Plantilla_Portafolio_Proyectos.csv');
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

  const handleAddProyecto = () => {
    setFormData({
      id: null,
      codigo: generarCodigoProyecto(),
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
      estado: true,
      alineadoPgd: '',
      accionEstrategica: '',
      porcentajeAvance: 0,
      informoAvance: false
    });
    setEditingProyecto(null);
    setShowModal(true);
  };

  const handleEditProyecto = (proyecto) => {
    console.log('📝 Editando proyecto:', proyecto);
    
    // Helper para formatear fecha para input date sin problemas de zona horaria
    const formatDateForInput = (isoDate) => {
      if (!isoDate) return '';
      try {
        // Si ya es un string YYYY-MM-DD, devolverlo directamente
        if (typeof isoDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
          return isoDate;
        }
        
        // Para fechas ISO (2024-01-15T00:00:00.000Z), extraer solo la parte de la fecha
        if (typeof isoDate === 'string' && isoDate.includes('T')) {
          const datePart = isoDate.split('T')[0];
          if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
            return datePart;
          }
        }
        
        // Crear fecha local sin conversión UTC usando getUTC* methods
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return '';
        
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return '';
      }
    };

    setFormData({
      id: proyecto.proyEntId || proyecto.tempId || proyecto.id,
      codigo: proyecto.numeracionProy || proyecto.codigo || '',
      nombre: proyecto.nombre || '',
      alcance: proyecto.alcance || '',
      justificacion: proyecto.justificacion || '',
      tipoProyecto: proyecto.tipoProy || proyecto.tipoProyecto || '',
      objEstrategico: proyecto.objEst || proyecto.objEstrategico || '',
      objTransformacionDigital: proyecto.objTranDig || proyecto.objTransformacionDigital || '',
      areaProyecto: proyecto.areaProy || proyecto.areaProyecto || '',
      areaEjecutora: proyecto.areaEjecuta || proyecto.areaEjecutora || '',
      tipoBeneficiario: proyecto.tipoBeneficiario || '',
      etapa: proyecto.etapaProyecto || proyecto.etapa || '',
      ambito: proyecto.ambitoProyecto || proyecto.ambito || '',
      fechaInicioProg: formatDateForInput(proyecto.fecIniProg || proyecto.fechaInicioProg),
      fechaFinProg: formatDateForInput(proyecto.fecFinProg || proyecto.fechaFinProg),
      fechaInicioReal: formatDateForInput(proyecto.fecIniReal || proyecto.fechaInicioReal),
      fechaFinReal: formatDateForInput(proyecto.fecFinReal || proyecto.fechaFinReal),
      estado: proyecto.estadoProyecto || proyecto.estado || false,
      alineadoPgd: proyecto.alineadoPgd || '',
      accionEstrategica: proyecto.accEst || proyecto.accionEstrategica || '',
      porcentajeAvance: proyecto.porcentajeAvance || 0,
      informoAvance: Boolean(proyecto.informoAvance)
    });
    setEditingProyecto(proyecto);
    setShowModal(true);
  };

  const handleDeleteProyecto = (proyectoId) => {
    const updated = localProyectos.filter(p => 
      (p.proyEntId || p.tempId || p.id) !== proyectoId
    );
    setLocalProyectos(updated);
    onProyectosChange(updated);
    showInfoToast('🗑️ Proyecto eliminado correctamente');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSaving) return; // Evitar múltiples submissions
    
    setIsSaving(true);
    
    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) {
        showErrorToast('El nombre del proyecto es obligatorio');
        setIsSaving(false);
        return;
      }

      // Helper para convertir fecha YYYY-MM-DD a ISO con hora local al mediodía para evitar zona horaria
      const convertDateToISO = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') return null;
        try {
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day, 12, 0, 0);
            return date.toISOString();
          }
          return null;
        } catch {
          return null;
        }
      };

      // Preparar los datos del proyecto con fechas en formato ISO correcto
      const proyectoData = {
        tempId: formData.id || Date.now(),
        numeracionProy: formData.codigo || generarCodigoProyecto(),
        nombre: formData.nombre.trim(),
        alcance: formData.alcance || '',
        justificacion: formData.justificacion || '',
        tipoProy: formData.tipoProyecto || '',
        objEst: formData.objEstrategico || '',
        objTranDig: formData.objTransformacionDigital || '',
        areaProy: formData.areaProyecto || '',
        areaEjecuta: formData.areaEjecutora || '',
        tipoBeneficiario: formData.tipoBeneficiario || '',
        etapaProyecto: formData.etapa || '',
        ambitoProyecto: formData.ambito || '',
        fecIniProg: convertDateToISO(formData.fechaInicioProg),
        fecFinProg: convertDateToISO(formData.fechaFinProg),
        fecIniReal: convertDateToISO(formData.fechaInicioReal),
        fecFinReal: convertDateToISO(formData.fechaFinReal),
        estadoProyecto: Boolean(formData.estado),
        alineadoPgd: formData.alineadoPgd || '',
        accEst: formData.accionEstrategica || '',
        porcentajeAvance: Number(formData.porcentajeAvance) || 0,
        informoAvance: Boolean(formData.informoAvance),
        activo: true
      };

      let updated;
      if (editingProyecto) {
        // Editar proyecto existente
        updated = localProyectos.map(p => {
          const pId = p.proyEntId || p.tempId || p.id;
          const editId = editingProyecto.proyEntId || editingProyecto.tempId || editingProyecto.id;
          if (pId === editId) {
            return { ...p, ...proyectoData, proyEntId: p.proyEntId }; // Mantener el ID original si existe
          }
          return p;
        });
        showSuccessToast('✅ Proyecto actualizado correctamente');
      } else {
        // Agregar nuevo proyecto
        updated = [...localProyectos, proyectoData];
        showSuccessToast('✅ Proyecto agregado correctamente');
      }

      setLocalProyectos(updated);
      onProyectosChange(updated);
      setShowModal(false);
      setEditingProyecto(null);
    } catch (error) {
      console.error('❌ Error al guardar proyecto:', error);
      showErrorToast('Error al guardar el proyecto');
    } finally {
      setIsSaving(false);
    }
  };

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
        if (!row || row.length < 4) continue;
        
        const nuevoProyecto = {
          tempId: Date.now() + i,
          numeracionProy: row[0] || generarCodigoProyecto(),
          nombre: row[1] || '',
          alcance: row[2] || '',
          justificacion: row[3] || '',
          tipoProy: row[4] || '',
          objEst: row[5] || '',
          objTranDig: row[6] || '',
          areaProy: row[7] || '',
          areaEjecuta: row[8] || '',
          tipoBeneficiario: row[9] || '',
          etapaProyecto: row[10] || '',
          ambitoProyecto: row[11] || '',
          fecIniProg: row[12] || '',
          fecFinProg: row[13] || '',
          fecIniReal: row[14] || '',
          fecFinReal: row[15] || '',
          estadoProyecto: row[16] === 'true' || row[16] === 'Activo' || false,
          alineadoPgd: row[17] || '',
          accEst: row[18] || '',
          activo: true
        };
        
        // Validar datos mínimos
        if (nuevoProyecto.nombre.trim()) {
          proyectosImportados.push(nuevoProyecto);
        }
      }

      if (proyectosImportados.length === 0) {
        showErrorToast('No se encontraron datos válidos en el archivo');
      } else {
        const updated = [...localProyectos, ...proyectosImportados];
        setLocalProyectos(updated);
        onProyectosChange(updated);
        showSuccessToast('📥 Importación exitosa', `Se importaron ${proyectosImportados.length} proyecto(s) exitosamente`);
      }
      
    } catch (error) {
      console.error('Error al procesar datos:', error);
      showErrorToast('Error al procesar los datos importados');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportExcel = () => {
    if (localProyectos.length === 0) {
      showInfoToast('No hay proyectos para exportar');
      return;
    }
    
    try {
      const encabezados = [
        'Código', 'Nombre', 'Alcance', 'Justificación', 'Tipo', 'Obj. Estratégico',
        'Obj. Transformación Digital', 'Área Proyecto', 'Área Ejecutora', 'Tipo Beneficiario',
        'Etapa', 'Ámbito', 'Fecha Inicio Programada', 'Fecha Fin Programada',
        'Fecha Inicio Real', 'Fecha Fin Real', 'Estado', 'Alineado PGD', 'Acción Estratégica'
      ];
      
      // Helper para formatear fechas en exportación sin zona horaria
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
      
      const datosExport = localProyectos.map(proyecto => [
        proyecto.numeracionProy || '',
        proyecto.nombre || '',
        proyecto.alcance || '',
        proyecto.justificacion || '',
        proyecto.tipoProy || '',
        proyecto.objEst || '',
        proyecto.objTranDig || '',
        proyecto.areaProy || '',
        proyecto.areaEjecuta || '',
        proyecto.tipoBeneficiario || '',
        proyecto.etapaProyecto || '',
        proyecto.ambitoProyecto || '',
        formatDateForExport(proyecto.fecIniProg),
        formatDateForExport(proyecto.fecFinProg),
        formatDateForExport(proyecto.fecIniReal),
        formatDateForExport(proyecto.fecFinReal),
        proyecto.estadoProyecto ? 'Activo' : 'Inactivo',
        proyecto.alineadoPgd || '',
        proyecto.accEst || ''
      ]);

      const fecha = new Date().toISOString().split('T')[0];

      // Intentar usar XLSX primero
      if (XLSX) {
        const ws = XLSX.utils.aoa_to_sheet([encabezados, ...datosExport]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Portafolio de Proyectos');
        
        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 25 },
          { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
          { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 15 }, { wch: 20 }
        ];
        ws['!cols'] = colWidths;
        
        const nombreArchivo = `Portafolio_Proyectos_${fecha}.xlsx`;
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
      const nombreArchivo = `Portafolio_Proyectos_${fecha}.csv`;
      
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

  const tiposProyecto = [
    { value: 'Infraestructura', label: 'Infraestructura TI' },
    { value: 'Software', label: 'Desarrollo de Software' },
    { value: 'Interoperabilidad', label: 'Interoperabilidad' },
    { value: 'Seguridad', label: 'Seguridad de la Información' },
    { value: 'Transformacion', label: 'Transformación Digital' },
    { value: 'Datos', label: 'Gestión de Datos' },
    { value: 'Capacitacion', label: 'Capacitación' },
    { value: 'Otro', label: 'Otro' }
  ];

  const etapasOptions = [
    'Planificación', 'Diseño', 'Desarrollo', 'Implementación', 
    'Pruebas', 'Despliegue', 'Mantenimiento', 'Cierre'
  ];

  const ambitosOptions = [
    'Nacional', 'Regional', 'Local', 'Institucional'
  ];

  const areasOptions = [
    'OGTI', 'TI', 'Sistemas', 'Infraestructura', 'Seguridad',
    'Datos', 'Desarrollo', 'Soporte', 'Proyectos'
  ];

  const beneficiariosOptions = [
    'Funcionarios públicos', 'Ciudadanos', 'Empresas', 
    'Instituciones públicas', 'Todos'
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800">Portafolio de Proyectos</h3>
        <div className="flex items-center gap-2">
          {!viewMode && (
            <>
              <div className="flex items-center gap-1">
                <button
                  onClick={downloadPlantillaExcel}
                  className="flex items-center gap-2 px-3 py-1.5 text-blue-700 border border-blue-300 text-sm rounded-lg hover:bg-blue-50 transition-colors"
                  title="Descargar plantilla Excel vacía"
                >
                  <FileText className="w-4 h-4" />
                  Plantilla
                </button>
                <button
                  onClick={handleImportExcel}
                  disabled={isImporting}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-700 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Importar proyectos desde Excel"
                >
                  <Upload className={`w-4 h-4 ${isImporting ? 'animate-spin' : ''}`} />
                  {isImporting ? 'Importando...' : 'Importar'}
                </button>
              </div>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                title="Exportar proyectos a Excel"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={handleAddProyecto}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo Proyecto
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabla de proyectos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Código</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Área</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Avance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Inicio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Fin</th>
                {!viewMode && (
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {localProyectos.length === 0 ? (
                <tr>
                  <td colSpan={viewMode ? 8 : 9} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">No hay proyectos registrados</p>
                        <p className="text-sm text-gray-500">Agregue un nuevo proyecto o importe desde Excel</p>
                      </div>
                      {!viewMode && (
                        <button
                          onClick={handleAddProyecto}
                          className="mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Crear Primer Proyecto
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                localProyectos.map((proyecto, index) => {
                  const proyectoId = proyecto.proyEntId || proyecto.tempId || proyecto.id || `temp-${index}`;
                  
                  // Formatear fechas para mostrar sin problemas de zona horaria
                  const formatDateDisplay = (isoDate) => {
                    if (!isoDate) return '-';
                    try {
                      // Si ya es formato YYYY-MM-DD, parsearlo localmente
                      if (typeof isoDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
                        const [year, month, day] = isoDate.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        return date.toLocaleDateString('es-PE', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric' 
                        });
                      }
                      
                      // Para fechas ISO (2024-01-15T00:00:00.000Z), extraer la fecha sin zona horaria
                      if (typeof isoDate === 'string' && isoDate.includes('T')) {
                        const datePart = isoDate.split('T')[0];
                        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
                          const [year, month, day] = datePart.split('-').map(Number);
                          const date = new Date(year, month - 1, day);
                          return date.toLocaleDateString('es-PE', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          });
                        }
                      }
                      
                      const date = new Date(isoDate);
                      if (isNaN(date.getTime())) return '-';
                      
                      return date.toLocaleDateString('es-PE', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      });
                    } catch {
                      return '-';
                    }
                  };

                  const porcentajeAvance = proyecto.porcentajeAvance || 0;
                  
                  return (
                    <tr key={proyectoId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-r border-gray-100">
                        <span className="text-sm font-mono text-indigo-600 font-medium">
                          {proyecto.numeracionProy || proyecto.codigo || `PP-${(index + 1).toString().padStart(3, '0')}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 line-clamp-1">
                            {proyecto.nombre || 'Sin nombre'}
                          </span>
                          {proyecto.alcance && (
                            <span className="text-xs text-gray-500 line-clamp-1">
                              {proyecto.alcance}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-100">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {proyecto.tipoProy || proyecto.tipoProyecto || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-100">
                        <span className="text-sm text-gray-700">
                          {proyecto.areaProy || proyecto.areaProyecto || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-100">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          (proyecto.estadoProyecto || proyecto.estado) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {(proyecto.estadoProyecto || proyecto.estado) ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                porcentajeAvance >= 100 ? 'bg-green-500' :
                                porcentajeAvance >= 75 ? 'bg-blue-500' :
                                porcentajeAvance >= 50 ? 'bg-yellow-500' :
                                porcentajeAvance >= 25 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, porcentajeAvance))}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-700 min-w-[35px]">
                            {porcentajeAvance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-100">
                        <span className="text-sm text-gray-700">
                          {formatDateDisplay(proyecto.fecIniProg || proyecto.fechaInicioProg)}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-100">
                        <span className="text-sm text-gray-700">
                          {formatDateDisplay(proyecto.fecFinProg || proyecto.fechaFinProg)}
                        </span>
                      </td>
                      {!viewMode && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditProyecto(proyecto)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Editar proyecto"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProyecto(proyectoId)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar proyecto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Proyecto */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-700 rounded-t-xl text-white">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">
                    {editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                  </h2>
                  <p className="text-sm text-white/80">
                    Portafolio de Proyectos - Compromiso 3
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Sección 1: Datos Básicos */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">📋 Información Básica</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Código del Proyecto
                      </label>
                      <input
                        type="text"
                        value={formData.codigo}
                        disabled
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre del Proyecto *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        required
                        maxLength={200}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Ingrese el nombre del proyecto..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Alcance del Proyecto *
                      </label>
                      <textarea
                        value={formData.alcance}
                        onChange={(e) => setFormData(prev => ({ ...prev, alcance: e.target.value }))}
                        required
                        rows={2}
                        maxLength={300}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        placeholder="Describa el alcance y objetivos del proyecto..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Justificación *
                      </label>
                      <textarea
                        value={formData.justificacion}
                        onChange={(e) => setFormData(prev => ({ ...prev, justificacion: e.target.value }))}
                        required
                        rows={2}
                        maxLength={300}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        placeholder="Justifique la necesidad del proyecto..."
                      />
                    </div>
                  </div>
                </div>

                {/* Sección 2: Clasificación y Categorización */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-blue-900">🏷️ Clasificación y Categorización</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo de Proyecto *
                      </label>
                      <select
                        value={formData.tipoProyecto}
                        onChange={(e) => setFormData(prev => ({ ...prev, tipoProyecto: e.target.value }))}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Seleccione...</option>
                        {tiposProyecto.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Etapa del Proyecto *
                      </label>
                      <select
                        value={formData.etapa}
                        onChange={(e) => setFormData(prev => ({ ...prev, etapa: e.target.value }))}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Seleccione...</option>
                        {etapasOptions.map(etapa => (
                          <option key={etapa} value={etapa}>{etapa}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Ámbito del Proyecto *
                      </label>
                      <select
                        value={formData.ambito}
                        onChange={(e) => setFormData(prev => ({ ...prev, ambito: e.target.value }))}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  <h4 className="text-sm font-medium text-green-900">🎯 Objetivos y Áreas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Objetivo Estratégico
                      </label>
                      <input
                        type="text"
                        value={formData.objEstrategico}
                        onChange={(e) => setFormData(prev => ({ ...prev, objEstrategico: e.target.value }))}
                        maxLength={200}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Objetivo estratégico vinculado..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Objetivo Transformación Digital
                      </label>
                      <input
                        type="text"
                        value={formData.objTransformacionDigital}
                        onChange={(e) => setFormData(prev => ({ ...prev, objTransformacionDigital: e.target.value }))}
                        maxLength={200}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Objetivo de transformación digital..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Área del Proyecto *
                      </label>
                      <select
                        value={formData.areaProyecto}
                        onChange={(e) => setFormData(prev => ({ ...prev, areaProyecto: e.target.value }))}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Seleccione...</option>
                        {areasOptions.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Área Ejecutora *
                      </label>
                      <select
                        value={formData.areaEjecutora}
                        onChange={(e) => setFormData(prev => ({ ...prev, areaEjecutora: e.target.value }))}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Seleccione...</option>
                        {areasOptions.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo de Beneficiario
                      </label>
                      <select
                        value={formData.tipoBeneficiario}
                        onChange={(e) => setFormData(prev => ({ ...prev, tipoBeneficiario: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Seleccione...</option>
                        {beneficiariosOptions.map(beneficiario => (
                          <option key={beneficiario} value={beneficiario}>{beneficiario}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sección 4: Alineamiento */}
                <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-purple-900">🔗 Alineamiento y Estrategia</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Alineado al PGD
                      </label>
                      <input
                        type="text"
                        value={formData.alineadoPgd}
                        onChange={(e) => setFormData(prev => ({ ...prev, alineadoPgd: e.target.value }))}
                        maxLength={100}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Alineamiento con el Plan de Gobierno Digital..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Acción Estratégica
                      </label>
                      <input
                        type="text"
                        value={formData.accionEstrategica}
                        onChange={(e) => setFormData(prev => ({ ...prev, accionEstrategica: e.target.value }))}
                        maxLength={100}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Acción estratégica vinculada..."
                      />
                    </div>
                  </div>
                </div>

                {/* Sección 5: Cronograma y Avance */}
                <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-orange-900">📅 Cronograma y Estado</h4>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha Inicio Programada
                      </label>
                      <input
                        type="date"
                        value={formData.fechaInicioProg}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaInicioProg: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha Fin Programada
                      </label>
                      <input
                        type="date"
                        value={formData.fechaFinProg}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaFinProg: e.target.value }))}
                        min={formData.fechaInicioProg || ''}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {formData.fechaInicioProg && (
                        <p className="text-xs text-gray-500 mt-1">Debe ser posterior a fecha de inicio</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha Inicio Real
                      </label>
                      <input
                        type="date"
                        value={formData.fechaInicioReal}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaInicioReal: e.target.value }))}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">No puede ser fecha futura</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha Fin Real
                      </label>
                      <input
                        type="date"
                        value={formData.fechaFinReal}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaFinReal: e.target.value }))}
                        min={formData.fechaInicioReal || ''}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Porcentaje de Avance (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.porcentajeAvance}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                            setFormData(prev => ({ ...prev, porcentajeAvance: value }));
                          }}
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="0-100"
                        />
                        <span className="absolute right-3 top-2 text-xs text-gray-500">%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="estadoProyecto"
                        checked={formData.estado}
                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="estadoProyecto" className="text-sm font-medium text-gray-700">
                        Proyecto Activo
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="informoAvance"
                        checked={formData.informoAvance}
                        onChange={(e) => setFormData(prev => ({ ...prev, informoAvance: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="informoAvance" className="text-sm font-medium text-gray-700">
                        Informó Avance
                      </label>
                    </div>
                  </div>
                </div>
                
              </div>
              
              {/* Footer con botones */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formData.nombre.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                  {isSaving ? 'Guardando...' : (editingProyecto ? 'Actualizar' : 'Crear')} Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortafolioProyectos;
