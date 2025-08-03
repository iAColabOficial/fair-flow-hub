-- Criar enums para as opções
CREATE TYPE public.role_type AS ENUM ('autor', 'orientador', 'coorientador', 'avaliador', 'voluntario', 'feira_afiliada', 'coordenador', 'coordenador_admin', 'diretor', 'financeiro', 'admin_staff');

CREATE TYPE public.role_status AS ENUM ('ativo', 'pendente', 'rejeitado', 'inativo');

CREATE TYPE public.nivel_escolar AS ENUM ('educacao_infantil', 'fundamental_1_3', 'fundamental_4_6', 'fundamental_7_9', 'medio', 'tecnico', 'eja', 'superior', 'pos_graduacao');

CREATE TYPE public.area_nivel AS ENUM ('area', 'subarea');

CREATE TYPE public.project_categoria AS ENUM ('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'RELATO');

CREATE TYPE public.project_subcategoria AS ENUM ('II_a', 'II_b');

CREATE TYPE public.project_status AS ENUM ('rascunho', 'submetido', 'selecionado', 'confirmado_virtual', 'finalista', 'confirmado_presencial', 'avaliado', 'premiado', 'desclassificado');

CREATE TYPE public.member_role AS ENUM ('autor_principal', 'autor');

CREATE TYPE public.orientador_tipo AS ENUM ('orientador', 'coorientador');

-- TABELA 1: users
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    cpf TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    telefone TEXT,
    data_nascimento DATE,
    endereco_completo TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 2: user_roles
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role_type role_type NOT NULL,
    status role_status NOT NULL DEFAULT 'pendente',
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, role_type)
);

-- TABELA 3: user_profiles
CREATE TABLE public.user_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    instituicao TEXT,
    nivel_escolar nivel_escolar,
    formacao_academica TEXT,
    area_atuacao TEXT,
    curriculo_lattes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 4: areas_conhecimento
CREATE TABLE public.areas_conhecimento (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo_cnpq TEXT,
    nome TEXT NOT NULL,
    nivel area_nivel NOT NULL,
    parent_id UUID REFERENCES public.areas_conhecimento(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 5: projects
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL CHECK (length(titulo) <= 500),
    categoria project_categoria NOT NULL,
    subcategoria project_subcategoria,
    area_conhecimento_id UUID NOT NULL REFERENCES public.areas_conhecimento(id),
    resumo TEXT,
    palavras_chave TEXT,
    status project_status NOT NULL DEFAULT 'rascunho',
    is_credenciado BOOLEAN NOT NULL DEFAULT false,
    token_feira TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 6: project_members
CREATE TABLE public.project_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role member_role NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(project_id, user_id)
);

-- TABELA 7: project_orientadores
CREATE TABLE public.project_orientadores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tipo orientador_tipo NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(project_id, user_id, tipo)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas_conhecimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_orientadores ENABLE ROW LEVEL SECURITY;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para busca frequente
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_cpf ON public.users(cpf);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role_type ON public.user_roles(role_type);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_projects_created_by ON public.projects(created_by);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_categoria ON public.projects(categoria);
CREATE INDEX idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX idx_project_orientadores_project_id ON public.project_orientadores(project_id);
CREATE INDEX idx_project_orientadores_user_id ON public.project_orientadores(user_id);

-- Função de segurança para verificar se usuário pode acessar dados
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
    SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Políticas RLS básicas

-- Users: usuários podem ver e editar apenas seus próprios dados
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (id = get_current_user_id());

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (id = get_current_user_id());

-- User_roles: usuários podem ver suas próprias permissões
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (user_id = get_current_user_id());

-- User_profiles: usuários podem ver e editar seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (user_id = get_current_user_id());

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = get_current_user_id());

-- Areas_conhecimento: todos podem visualizar (dados públicos)
CREATE POLICY "Anyone can view areas" ON public.areas_conhecimento
    FOR SELECT USING (true);

-- Projects: usuários podem ver projetos onde são membros, orientadores ou criadores
CREATE POLICY "Users can view related projects" ON public.projects
    FOR SELECT USING (
        created_by = get_current_user_id() OR
        id IN (
            SELECT project_id FROM public.project_members WHERE user_id = get_current_user_id()
        ) OR
        id IN (
            SELECT project_id FROM public.project_orientadores WHERE user_id = get_current_user_id()
        )
    );

CREATE POLICY "Users can insert projects" ON public.projects
    FOR INSERT WITH CHECK (created_by = get_current_user_id());

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (created_by = get_current_user_id());

-- Project_members: usuários podem ver membros dos projetos relacionados
CREATE POLICY "Users can view project members" ON public.project_members
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE 
            created_by = get_current_user_id() OR
            id IN (SELECT project_id FROM public.project_members WHERE user_id = get_current_user_id()) OR
            id IN (SELECT project_id FROM public.project_orientadores WHERE user_id = get_current_user_id())
        )
    );

-- Project_orientadores: usuários podem ver orientadores dos projetos relacionados
CREATE POLICY "Users can view project orientadores" ON public.project_orientadores
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE 
            created_by = get_current_user_id() OR
            id IN (SELECT project_id FROM public.project_members WHERE user_id = get_current_user_id()) OR
            id IN (SELECT project_id FROM public.project_orientadores WHERE user_id = get_current_user_id())
        )
    );