-- Script para corregir alcances duplicados en compromisos de gobierno digital

-- 1. Corregir el compromiso "Designar al Líder de Gobierno y Transformación Digital"
UPDATE compromiso_gobierno_digital
SET alcances = ''

-- 2. Verificar si hay otros casos (opcional, para revisión manual)
-- SELECT nombre_compromiso, alcances FROM compromiso_gobierno_digital;
