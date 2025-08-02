-- Inserir usuários de teste com CPF no formato correto
-- O formato deve ser 000.000.000-00

-- Admin Staff
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'admin@febic.org.br', 
  'João Silva Santos', 
  'admin', 
  '123.456.789-01',
  'IBIC - Instituto Brasileiro de Iniciação Científica'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin_staff',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Diretor
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000002', 
  'diretor@febic.org.br', 
  'Maria Oliveira Costa', 
  'admin', 
  '123.456.789-02',
  'IBIC - Instituto Brasileiro de Iniciação Científica'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'diretor',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Coordenador Admin
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000003', 
  'coordenador.admin@febic.org.br', 
  'Carlos Pereira Lima', 
  'admin', 
  '123.456.789-03',
  'Universidade Federal de Santa Catarina'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'coordenador_admin',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Coordenador
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000004', 
  'coordenador@febic.org.br', 
  'Ana Souza Rodrigues', 
  'user', 
  '123.456.789-04',
  'Universidade Estadual de Campinas'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'coordenador',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Financeiro
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000005', 
  'financeiro@febic.org.br', 
  'Roberto Alves Martins', 
  'user', 
  '123.456.789-05',
  'IBIC - Instituto Brasileiro de Iniciação Científica'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'financeiro',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Avaliador
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000006', 
  'avaliador@febic.org.br', 
  'Patricia Santos Ferreira', 
  'user', 
  '123.456.789-06',
  'Universidade de São Paulo'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000006',
  'avaliador',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Feira Afiliada
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000007', 
  'feira.afiliada@febic.org.br', 
  'Lucas Costa Andrade', 
  'user', 
  '123.456.789-07',
  'Feira de Ciências de São Paulo'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000007',
  'feira_afiliada',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Orientador
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000008', 
  'orientador@febic.org.br', 
  'Fernanda Lima Gomes', 
  'user', 
  '123.456.789-08',
  'Escola Estadual Dom Pedro II'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000008',
  'orientador',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Autor
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000009', 
  'autor@febic.org.br', 
  'Giovanna Silva Nascimento', 
  'user', 
  '123.456.789-09',
  'Escola Municipal Santos Dumont'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, status, approved_at, approved_by)
VALUES (
  '00000000-0000-0000-0000-000000000009',
  'autor',
  'ativo',
  NOW(),
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (user_id, role) DO NOTHING;