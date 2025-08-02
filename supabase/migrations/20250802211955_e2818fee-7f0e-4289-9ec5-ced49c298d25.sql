-- Criar dados de exemplo para projetos, áreas de conhecimento e outras informações
-- Usando IDs de usuários existentes se houver

-- Adicionar algumas áreas de conhecimento se não existirem
INSERT INTO areas_conhecimento (nome, descricao) VALUES
('Ciências Exatas e da Terra', 'Matemática, Física, Química, Geociências, Astronomia'),
('Ciências Biológicas', 'Biologia Geral, Botânica, Zoologia, Ecologia, Morfologia'),
('Engenharias', 'Engenharia Civil, Mecânica, Elétrica, Química, de Produção'),
('Ciências da Saúde', 'Medicina, Odontologia, Farmácia, Enfermagem, Saúde Coletiva'),
('Ciências Agrárias', 'Agronomia, Recursos Florestais, Engenharia Agrícola, Zootecnia'),
('Ciências Sociais Aplicadas', 'Direito, Administração, Economia, Arquitetura e Urbanismo'),
('Ciências Humanas', 'Filosofia, Sociologia, Antropologia, História, Geografia'),
('Linguística Letras e Artes', 'Linguística, Literatura, Artes Visuais, Música, Teatro')
ON CONFLICT (nome) DO NOTHING;

-- Adicionar preços para as categorias
INSERT INTO categoria_precos (categoria, etapa, valor, ano) VALUES
('I', 'virtual', 35.00, 2025),
('I', 'presencial', 50.00, 2025),
('II', 'virtual', 35.00, 2025),
('II', 'presencial', 50.00, 2025),
('III', 'virtual', 40.00, 2025),
('III', 'presencial', 60.00, 2025),
('IV', 'virtual', 45.00, 2025),
('IV', 'presencial', 70.00, 2025),
('V', 'virtual', 40.00, 2025),
('V', 'presencial', 60.00, 2025),
('VI', 'virtual', 50.00, 2025),
('VI', 'presencial', 80.00, 2025),
('VII', 'virtual', 60.00, 2025),
('VII', 'presencial', 100.00, 2025),
('VIII', 'virtual', 70.00, 2025),
('VIII', 'presencial', 120.00, 2025)
ON CONFLICT (categoria, etapa, ano) DO NOTHING;

-- Adicionar configurações do sistema
INSERT INTO system_settings (key, value, description) VALUES
('event_name', 'FEBIC 2025 - Feira Brasileira de Iniciação Científica', 'Nome do evento atual'),
('event_date_start', '2025-10-15', 'Data de início do evento presencial'),
('event_date_end', '2025-10-17', 'Data de fim do evento presencial'),
('submission_deadline', '2025-06-30', 'Prazo final para submissão de projetos'),
('virtual_confirmation_deadline', '2025-07-15', 'Prazo para confirmação da etapa virtual'),
('presential_confirmation_deadline', '2025-08-30', 'Prazo para confirmação da etapa presencial'),
('max_projects_virtual', '700', 'Número máximo de projetos na etapa virtual'),
('max_projects_presential', '450', 'Número máximo de projetos na etapa presencial'),
('public_school_percentage', '55', 'Percentual mínimo de vagas para escolas públicas'),
('santa_catarina_percentage', '15', 'Percentual máximo de vagas para SC'),
('host_city_percentage', '5', 'Percentual máximo de vagas para cidade-sede')
ON CONFLICT (key) DO NOTHING;

-- Adicionar algumas feiras afiliadas de exemplo
INSERT INTO feiras_afiliadas (nome, cidade, estado, contato_email, contato_telefone, status) VALUES
('Feira de Ciências de São Paulo', 'São Paulo', 'SP', 'contato@feiraspcontato.br', '(11) 99999-9999', 'ativo'),
('Mostra Científica do Rio de Janeiro', 'Rio de Janeiro', 'RJ', 'mostra@rj.gov.br', '(21) 88888-8888', 'ativo'),
('Feira de Inovação de Minas Gerais', 'Belo Horizonte', 'MG', 'feira@mg.gov.br', '(31) 77777-7777', 'ativo'),
('Feira Científica do Paraná', 'Curitiba', 'PR', 'ciencia@pr.gov.br', '(41) 66666-6666', 'ativo'),
('Mostra de Ciências do Rio Grande do Sul', 'Porto Alegre', 'RS', 'mostra@rs.gov.br', '(51) 55555-5555', 'ativo')
ON CONFLICT (nome) DO NOTHING;