-- Atualizar a função handle_new_user para processar roles automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Atualizar o profile com dados extras do FEBIC
  UPDATE profiles SET
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    phone = NEW.raw_user_meta_data->>'phone',
    cpf = NEW.raw_user_meta_data->>'cpf',
    instituicao = NEW.raw_user_meta_data->>'instituicao',
    role = 'user', -- Manter compatibilidade com sistema existente
    ai_status = 'inactive'
  WHERE id = NEW.id;
  
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
$$;