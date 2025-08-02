-- First drop the trigger to avoid issues during function update
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Fix the handle_new_user function with correct variable naming
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_febic_role febic_role;
  role_status text;
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

  -- Determinar o role baseado nos metadados
  user_febic_role := COALESCE(NEW.raw_user_meta_data->>'role', 'autor')::febic_role;
  role_status := CASE 
    WHEN user_febic_role IN ('autor', 'orientador') THEN 'ativo'
    ELSE 'pendente'
  END;

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
  
  -- Criar role FEBIC para o usuário
  INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
  VALUES (
    NEW.id, 
    user_febic_role, 
    role_status,
    CASE WHEN role_status = 'ativo' THEN NOW() ELSE NULL END,
    CASE WHEN role_status = 'ativo' THEN NEW.id ELSE NULL END
  );
  
  -- Log da criação do usuário
  INSERT INTO activity_logs (user_id, action, details)
  VALUES (NEW.id, 'user_registered', jsonb_build_object(
    'email', NEW.email,
    'role', user_febic_role::text,
    'status', role_status,
    'system', 'FEBIC'
  ));
  
  RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Now clear all data
TRUNCATE TABLE public.project_timeline CASCADE;
TRUNCATE TABLE public.user_notifications CASCADE;
TRUNCATE TABLE public.assistant_configs CASCADE;
TRUNCATE TABLE public.medical_information CASCADE;
TRUNCATE TABLE public.system_settings CASCADE;
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.n8n_chat_histories CASCADE;
TRUNCATE TABLE public.project_pagamentos CASCADE;
TRUNCATE TABLE public.project_members CASCADE;
TRUNCATE TABLE public.system_notices CASCADE;
TRUNCATE TABLE public.project_avaliadores CASCADE;
TRUNCATE TABLE public.gringo_chat_historico CASCADE;
TRUNCATE TABLE public.areas_conhecimento CASCADE;
TRUNCATE TABLE public.avaliador_areas CASCADE;
TRUNCATE TABLE public.project_documents CASCADE;
TRUNCATE TABLE public.user_roles CASCADE;
TRUNCATE TABLE public.threads CASCADE;
TRUNCATE TABLE public.feira_tokens CASCADE;
TRUNCATE TABLE public.feiras_afiliadas CASCADE;
TRUNCATE TABLE public.usage_stats CASCADE;
TRUNCATE TABLE public.conversations CASCADE;
TRUNCATE TABLE public.project_avaliacoes CASCADE;
TRUNCATE TABLE public.categoria_precos CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.activity_logs CASCADE;
TRUNCATE TABLE public.projects CASCADE;
TRUNCATE TABLE public.avaliador_disponibilidade CASCADE;

-- Clear auth users
DELETE FROM auth.users;

-- Temporarily disable the trigger
DROP TRIGGER on_auth_user_created ON auth.users;

-- Create admin user manually
DO $$
DECLARE
  admin_user_id uuid := gen_random_uuid();
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    admin_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@gmail.com',
    crypt('Admin123.', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Administrador", "role": "admin_staff"}',
    false,
    'authenticated'
  );
  
  -- Create profile for admin user
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    ai_status
  ) VALUES (
    admin_user_id,
    'admin@gmail.com',
    'Administrador',
    'admin',
    'inactive'
  );
  
  -- Create admin_staff role
  INSERT INTO public.user_roles (
    user_id,
    role,
    status,
    approved_at,
    approved_by
  ) VALUES (
    admin_user_id,
    'admin_staff',
    'ativo',
    now(),
    admin_user_id
  );
  
  -- Log the admin creation
  INSERT INTO public.activity_logs (
    user_id,
    action,
    details
  ) VALUES (
    admin_user_id,
    'admin_created',
    jsonb_build_object(
      'email', 'admin@gmail.com',
      'role', 'admin_staff',
      'system', 'FEBIC'
    )
  );
END $$;

-- Re-enable the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();