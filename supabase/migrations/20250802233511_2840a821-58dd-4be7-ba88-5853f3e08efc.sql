-- Corrigir a função handle_new_user que está falhando
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Verificar duplicidade de email (já validado pelo Supabase Auth)
  -- Verificar duplicidade de CPF
  IF NEW.raw_user_meta_data->>'cpf' IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM profiles 
      WHERE cpf = NEW.raw_user_meta_data->>'cpf' 
      AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'CPF já cadastrado no sistema'
        USING ERRCODE = 'unique_violation';
    END IF;
  END IF;

  -- Criar o profile com dados do FEBIC
  INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    phone, 
    cpf, 
    instituicao, 
    role,
    ai_status
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'instituicao',
    'user', -- Manter compatibilidade com sistema existente
    'inactive'
  );
  
  -- Determinar o role baseado nos metadados
  DECLARE
    user_role febic_role := COALESCE(NEW.raw_user_meta_data->>'role', 'autor')::febic_role;
    role_status text := CASE 
      WHEN user_role IN ('autor', 'orientador') THEN 'ativo'
      ELSE 'pendente'
    END;
  BEGIN
    -- Criar role FEBIC para o usuário
    INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
    VALUES (
      NEW.id, 
      user_role, 
      role_status,
      CASE WHEN role_status = 'ativo' THEN NOW() ELSE NULL END,
      CASE WHEN role_status = 'ativo' THEN NEW.id ELSE NULL END
    );
  END;
  
  -- Log da criação do usuário
  INSERT INTO activity_logs (user_id, action, details)
  VALUES (NEW.id, 'user_registered', jsonb_build_object(
    'email', NEW.email,
    'role', user_role,
    'status', role_status,
    'system', 'FEBIC'
  ));
  
  RETURN NEW;
END;
$function$;

-- Adicionar índice único para CPF
CREATE UNIQUE INDEX IF NOT EXISTS profiles_cpf_unique 
ON profiles (cpf) 
WHERE cpf IS NOT NULL;

-- Adicionar função para validar CPF antes do insert/update
CREATE OR REPLACE FUNCTION validate_cpf_uniqueness()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Verificar se CPF já existe
  IF NEW.cpf IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE cpf = NEW.cpf 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'CPF já cadastrado no sistema'
      USING ERRCODE = 'unique_violation';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Criar trigger para validar CPF
DROP TRIGGER IF EXISTS validate_cpf_before_insert_update ON profiles;
CREATE TRIGGER validate_cpf_before_insert_update
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_cpf_uniqueness();