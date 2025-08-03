-- Limpar completamente o banco de dados (apenas schema public)
-- ATENÇÃO: Isso irá apagar TODOS os dados e estruturas customizadas

-- Desabilitar RLS temporariamente para facilitar a limpeza
SET session_replication_role = replica;

-- Dropar todas as tabelas da schema public
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Dropar todas as tabelas com CASCADE para remover dependências
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Dropar todas as funções customizadas da schema public
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT proname, oidvectortypes(proargtypes) as argtypes 
              FROM pg_proc p 
              JOIN pg_namespace n ON n.oid = p.pronamespace 
              WHERE n.nspname = 'public' 
              AND p.proname NOT LIKE 'pg_%'
              AND p.proname NOT IN ('gen_random_uuid')) 
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.argtypes || ') CASCADE';
    END LOOP;
END $$;

-- Dropar todos os tipos customizados (enums)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT typname FROM pg_type t 
              JOIN pg_namespace n ON n.oid = t.typnamespace 
              WHERE n.nspname = 'public' 
              AND t.typtype = 'e') 
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;

-- Dropar todas as sequences da schema public
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequencename) || ' CASCADE';
    END LOOP;
END $$;

-- Reabilitar RLS
SET session_replication_role = DEFAULT;

-- Confirmar limpeza
SELECT 'Banco de dados limpo com sucesso! Todas as tabelas, funções, tipos e sequences da schema public foram removidos.' as status;