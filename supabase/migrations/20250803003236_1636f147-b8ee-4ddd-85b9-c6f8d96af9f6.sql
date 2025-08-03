-- Inserir usuário admin_staff
INSERT INTO public.users (
    id,
    email,
    cpf,
    nome,
    telefone,
    data_nascimento,
    endereco_completo,
    is_active,
    email_verified
) VALUES (
    gen_random_uuid(),
    'profe.leandrorodrigues@gmail.com',
    '038.762.589-52',
    'Leandro Rodrigues',
    '(47) 99999-9999',
    '1985-03-15',
    'Rua das Flores, 123 - Centro - Jaraguá do Sul/SC - CEP: 89251-000',
    true,
    true
);

-- Obter o ID do usuário recém-criado e inserir role admin_staff
WITH new_user AS (
    SELECT id FROM public.users WHERE email = 'profe.leandrorodrigues@gmail.com'
)
INSERT INTO public.user_roles (
    user_id,
    role_type,
    status,
    approved_by,
    approved_at
) 
SELECT 
    id,
    'admin_staff'::role_type,
    'ativo'::role_status,
    id, -- auto-aprovado
    now()
FROM new_user;

-- Inserir perfil do usuário
WITH new_user AS (
    SELECT id FROM public.users WHERE email = 'profe.leandrorodrigues@gmail.com'
)
INSERT INTO public.user_profiles (
    user_id,
    instituicao,
    nivel_escolar,
    formacao_academica,
    area_atuacao,
    curriculo_lattes
)
SELECT 
    id,
    'IBIC - Instituto Brasileiro de Iniciação Científica',
    'pos_graduacao'::nivel_escolar,
    'Mestrado em Educação Científica',
    'Coordenação de Feira Científica e Iniciação Científica',
    'http://lattes.cnpq.br/1234567890123456'
FROM new_user;