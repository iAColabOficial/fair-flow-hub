-- Limpar qualquer dado existente primeiro
DELETE FROM public.profiles WHERE email = 'admin@gmail.com';
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
);
DELETE FROM public.activity_logs WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
);
DELETE FROM auth.users WHERE email = 'admin@gmail.com';

-- Criar o usuário admin usando a extensão adminapi (método correto para criar usuários)
SELECT auth.create_user(jsonb_build_object(
  'email', 'admin@gmail.com',
  'password', 'Admin123.',
  'email_confirmed_at', now(),
  'user_metadata', jsonb_build_object(
    'full_name', 'Administrador',
    'cpf', '038.762.589-52',
    'phone', '(11) 99999-9999',
    'instituicao', 'FEBIC',
    'role', 'admin_staff'
  )
));

-- Buscar o ID do usuário criado e atualizar o perfil manualmente se necessário
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Garantir que o perfil foi criado corretamente
    INSERT INTO public.profiles (
      id, email, full_name, cpf, phone, instituicao, role, ai_status
    ) VALUES (
      admin_user_id, 'admin@gmail.com', 'Administrador', '038.762.589-52', 
      '(11) 99999-9999', 'FEBIC', 'admin', 'inactive'
    ) ON CONFLICT (id) DO UPDATE SET
      cpf = EXCLUDED.cpf,
      phone = EXCLUDED.phone,
      instituicao = EXCLUDED.instituicao;
    
    -- Garantir que o role admin_staff foi criado
    INSERT INTO public.user_roles (
      user_id, role, status, approved_at, approved_by
    ) VALUES (
      admin_user_id, 'admin_staff', 'ativo', now(), admin_user_id
    ) ON CONFLICT (user_id, role) DO UPDATE SET
      status = 'ativo',
      approved_at = now();
  END IF;
END $$;