-- Limpar qualquer dado existente primeiro
DELETE FROM public.profiles WHERE email = 'admin@gmail.com';
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
);
DELETE FROM public.activity_logs WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
);
DELETE FROM auth.users WHERE email = 'admin@gmail.com';

-- Criar o usuário admin diretamente na tabela auth.users
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
    jsonb_build_object(
      'full_name', 'Administrador',
      'cpf', '038.762.589-52',
      'phone', '(11) 99999-9999',
      'instituicao', 'FEBIC',
      'role', 'admin_staff'
    ),
    false,
    'authenticated'
  );
  
  -- Create profile for admin user
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    cpf,
    phone,
    instituicao,
    role,
    ai_status
  ) VALUES (
    admin_user_id,
    'admin@gmail.com',
    'Administrador',
    '038.762.589-52',
    '(11) 99999-9999',
    'FEBIC',
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