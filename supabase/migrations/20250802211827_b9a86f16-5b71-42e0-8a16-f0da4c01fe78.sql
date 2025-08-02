-- Criar usuários de teste para cada tipo de role
-- Inserir dados de exemplo para testar o sistema

-- Admin Staff
INSERT INTO profiles (id, email, full_name, role, cpf, instituicao) 
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'admin@febic.org.br', 
  'João Silva Santos', 
  'admin', 
  '12345678901',
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
  '12345678902',
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
  '12345678903',
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
  '12345678904',
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
  '12345678905',
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
  '12345678906',
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
  '12345678907',
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
  '12345678908',
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
  '12345678909',
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