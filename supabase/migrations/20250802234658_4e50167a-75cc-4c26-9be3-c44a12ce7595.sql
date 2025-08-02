-- Clear all data from tables
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

-- Clear auth users (this will cascade to profiles due to foreign key)
DELETE FROM auth.users;

-- Create admin user in auth.users
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
  gen_random_uuid(),
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

-- Get the created user ID
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@gmail.com';
  
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