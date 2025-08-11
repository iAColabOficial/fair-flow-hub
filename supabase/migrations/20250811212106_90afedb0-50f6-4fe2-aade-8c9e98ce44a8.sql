-- Add 'IX' to the project_categoria enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'IX' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'project_categoria')
    ) THEN
        ALTER TYPE project_categoria ADD VALUE 'IX';
    END IF;
END $$;

-- Also add pricing for Category IX if not exists
INSERT INTO categoria_precos (categoria, etapa, valor, is_active)
VALUES 
    ('IX', 'virtual', 80.00, true),
    ('IX', 'presencial', 120.00, true)
ON CONFLICT DO NOTHING;