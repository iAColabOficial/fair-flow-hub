-- Desabilitar temporariamente o trigger para evitar conflitos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Limpar completamente qualquer dado existente
DO $$
DECLARE
  existing_user_id uuid;
BEGIN
  -- Buscar ID do usuário existente se houver
  SELECT id INTO existing_user_id FROM auth.users WHERE email = 'admin@gmail.com';
  
  IF existing_user_id IS NOT NULL THEN
    -- Limpar dados relacionados
    DELETE FROM public.activity_logs WHERE user_id = existing_user_id;
    DELETE FROM public.user_roles WHERE user_id = existing_user_id;
    DELETE FROM public.profiles WHERE id = existing_user_id;
    DELETE FROM auth.users WHERE id = existing_user_id;
  END IF;
END $$;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar o usuário admin com o CPF válido
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
END $$;