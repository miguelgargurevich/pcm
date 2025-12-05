import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164/api';

// Cache simple en memoria
const catalogCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene los elementos de un catálogo específico desde la API
 * @param {string} nombreTabla - Nombre del catálogo (ej: ROL_FUNCIONARIO, ROL_COMITE, ALCANCE)
 * @param {boolean} forceRefresh - Forzar actualización del cache
 * @returns {Promise<Array>} Array de objetos {id, valor, descripcion, orden}
 */
export const getCatalogo = async (nombreTabla, forceRefresh = false) => {
  try {
    // Verificar cache
    const cacheKey = nombreTabla;
    const cached = catalogCache.get(cacheKey);
    
    if (!forceRefresh && cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log(`[Catálogo] Cache hit: ${nombreTabla}`);
      return cached.data;
    }

    console.log(`[Catálogo] Fetching: ${nombreTabla}`);
    
    const response = await axios.get(`${API_URL}/Catalogo/${nombreTabla}`);
    
    if (response.data && response.data.isSuccess && response.data.data) {
      const items = response.data.data;
      
      // Guardar en cache
      catalogCache.set(cacheKey, {
        data: items,
        timestamp: Date.now()
      });
      
      return items;
    }
    
    console.warn(`[Catálogo] No data returned for: ${nombreTabla}`);
    return [];
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(`[Catálogo] Not found: ${nombreTabla}`);
      return [];
    }
    
    console.error(`[Catálogo] Error fetching ${nombreTabla}:`, error);
    throw error;
  }
};

/**
 * Limpia el cache de catálogos (útil para refrescar datos)
 * @param {string} nombreTabla - Nombre del catálogo a limpiar, o undefined para limpiar todo
 */
export const clearCatalogoCache = (nombreTabla) => {
  if (nombreTabla) {
    catalogCache.delete(nombreTabla);
    console.log(`[Catálogo] Cache cleared: ${nombreTabla}`);
  } else {
    catalogCache.clear();
    console.log('[Catálogo] All cache cleared');
  }
};

/**
 * Obtiene opciones formateadas para un <select>
 * @param {string} nombreTabla - Nombre del catálogo
 * @returns {Promise<Array>} Array de objetos {value, label}
 */
export const getCatalogoOptions = async (nombreTabla) => {
  const items = await getCatalogo(nombreTabla);
  return items.map(item => ({
    value: item.valor,
    label: item.valor,
    descripcion: item.descripcion
  }));
};

/**
 * Obtiene un valor de configuración específico desde tabla_tablas
 * @param {string} nombreTabla - Nombre de la tabla de configuración (ej: CONFIG_DOCUMENTOS)
 * @param {string} columnaId - ID de la columna a buscar (ej: URL_POL_PRIVACIDAD)
 * @returns {Promise<string|null>} Valor de configuración o null si no existe
 */
export const getConfigValue = async (nombreTabla, columnaId) => {
  try {
    const items = await getCatalogo(nombreTabla);
    const item = items.find(i => i.columnaId === columnaId);
    return item ? item.valor : null;
  } catch (error) {
    console.error(`[Catálogo] Error getting config ${nombreTabla}.${columnaId}:`, error);
    return null;
  }
};

export default {
  getCatalogo,
  getCatalogoOptions,
  getConfigValue,
  clearCatalogoCache
};
