-- Script para LOCAL: Alinear estructura de alcance_compromisos con PRODUCCIÓN
-- 1. Renombrar ID
-- 2. Cambiar FK para apuntar a compromiso_gobierno_digital
-- 3. Eliminar tabla obsoleta compromisos (opcional, pero recomendado para evitar confusión)

-- 1. Renombrar columna ID si es necesario
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alcance_compromisos' AND column_name = 'alcance_compromiso_id'
    ) THEN
        ALTER TABLE alcance_compromisos RENAME COLUMN alcance_compromiso_id TO alc_com_id;
    END IF;
END $$;

-- 2. Actualizar Foreign Key
DO $$
BEGIN
    -- Eliminar FK antigua si existe
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_alcance_compromiso'
    ) THEN
        ALTER TABLE alcance_compromisos DROP CONSTRAINT fk_alcance_compromiso;
    END IF;

    -- Crear nueva FK apuntando a compromiso_gobierno_digital
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_alcance_compromisos_cgd'
    ) THEN
        ALTER TABLE alcance_compromisos
        ADD CONSTRAINT fk_alcance_compromisos_cgd
        FOREIGN KEY (compromiso_id)
        REFERENCES compromiso_gobierno_digital(compromiso_id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Verificar y limpiar datos huérfanos antes de crear la FK si falló
-- (Si hay datos en alcance_compromisos que no están en compromiso_gobierno_digital, la FK fallará)
-- DELETE FROM alcance_compromisos WHERE compromiso_id NOT IN (SELECT compromiso_id FROM compromiso_gobierno_digital);
