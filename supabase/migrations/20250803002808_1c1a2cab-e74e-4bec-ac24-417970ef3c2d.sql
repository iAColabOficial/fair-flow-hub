-- Criar novos enums para as tabelas complementares
CREATE TYPE public.document_type AS ENUM ('plano_pesquisa', 'termo_autenticidade', 'relatorio_sucinto', 'video_apresentacao', 'banner', 'diario_bordo', 'termo_autorizacao_imagem', 'termo_autorizacao_menor', 'documento_especial');

CREATE TYPE public.etapa_avaliacao AS ENUM ('cias', 'virtual', 'presencial');

CREATE TYPE public.etapa_tipo AS ENUM ('virtual', 'presencial');

CREATE TYPE public.avaliacao_status AS ENUM ('atribuido', 'em_avaliacao', 'concluido');

CREATE TYPE public.payment_method AS ENUM ('boleto', 'pix', 'cartao');

CREATE TYPE public.payment_status AS ENUM ('pendente', 'pago', 'vencido', 'cancelado', 'isento');

CREATE TYPE public.notification_tipo AS ENUM ('info', 'warning', 'error', 'success');

-- TABELA 8: project_documents
CREATE TABLE public.project_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by UUID NOT NULL REFERENCES public.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 9: project_timeline
CREATE TABLE public.project_timeline (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status_anterior project_status,
    status_novo project_status NOT NULL,
    observacoes TEXT,
    changed_by UUID NOT NULL REFERENCES public.users(id),
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 10: avaliador_areas
CREATE TABLE public.avaliador_areas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    area_id UUID NOT NULL REFERENCES public.areas_conhecimento(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, area_id)
);

-- TABELA 11: avaliador_disponibilidade
CREATE TABLE public.avaliador_disponibilidade (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    data_disponivel DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 12: project_avaliadores
CREATE TABLE public.project_avaliadores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    avaliador_id UUID NOT NULL REFERENCES public.users(id),
    etapa etapa_tipo NOT NULL,
    data_avaliacao DATE,
    horario_avaliacao TIME,
    sala_meet_url TEXT,
    status avaliacao_status NOT NULL DEFAULT 'atribuido',
    assigned_by UUID NOT NULL REFERENCES public.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(project_id, avaliador_id, etapa)
);

-- TABELA 13: project_avaliacoes
CREATE TABLE public.project_avaliacoes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    avaliador_id UUID NOT NULL REFERENCES public.users(id),
    etapa etapa_avaliacao NOT NULL,
    nota_metodo_cientifico NUMERIC(4,2),
    nota_clareza NUMERIC(4,2),
    nota_originalidade NUMERIC(4,2),
    nota_referencias NUMERIC(4,2),
    nota_objetivo_pedagogico NUMERIC(4,2),
    nota_conhecimento NUMERIC(4,2),
    nota_comunicacao_escrita NUMERIC(4,2),
    nota_comunicacao_oral NUMERIC(4,2),
    nota_comunidade NUMERIC(4,2),
    nota_apresentacao NUMERIC(4,2),
    nota_argumentacao NUMERIC(4,2),
    nota_final NUMERIC(4,2) NOT NULL,
    comentarios TEXT,
    comentarios_publicos TEXT,
    is_comentarios_liberados BOOLEAN NOT NULL DEFAULT false,
    avaliado_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(project_id, avaliador_id, etapa)
);

-- TABELA 14: categoria_precos
CREATE TABLE public.categoria_precos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    categoria project_categoria NOT NULL,
    etapa etapa_tipo NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(categoria, etapa)
);

-- TABELA 15: project_pagamentos
CREATE TABLE public.project_pagamentos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    etapa etapa_tipo NOT NULL,
    valor_original NUMERIC(10,2) NOT NULL,
    valor_final NUMERIC(10,2) NOT NULL,
    is_isento BOOLEAN NOT NULL DEFAULT false,
    motivo_isencao TEXT,
    asaas_payment_id TEXT,
    asaas_invoice_url TEXT,
    payment_method payment_method,
    status_pagamento payment_status NOT NULL DEFAULT 'pendente',
    data_vencimento DATE,
    data_pagamento TIMESTAMP WITH TIME ZONE,
    solicitado_by UUID NOT NULL REFERENCES public.users(id),
    liberado_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(project_id, etapa)
);

-- TABELA 16: system_settings
CREATE TABLE public.system_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 17: cronograma_febic
CREATE TABLE public.cronograma_febic (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    fase TEXT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    descricao TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 18: system_notices
CREATE TABLE public.system_notices (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    target_roles JSONB,
    is_urgent BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- TABELA 19: user_notifications
CREATE TABLE public.user_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo notification_tipo NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_project_id UUID REFERENCES public.projects(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 20: feiras_afiliadas
CREATE TABLE public.feiras_afiliadas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id),
    nome_feira TEXT NOT NULL,
    instituicao_organizadora TEXT,
    cnpj TEXT,
    cidade TEXT,
    estado TEXT CHECK (length(estado) = 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 21: feira_tokens
CREATE TABLE public.feira_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    feira_id UUID NOT NULL REFERENCES public.feiras_afiliadas(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    quantidade_credenciais INTEGER NOT NULL,
    quantidade_usada INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at DATE,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 22: premio_tipos
CREATE TABLE public.premio_tipos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    categoria_especifica project_categoria,
    area_especifica_id UUID REFERENCES public.areas_conhecimento(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 23: project_premios
CREATE TABLE public.project_premios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    premio_tipo_id UUID NOT NULL REFERENCES public.premio_tipos(id),
    posicao INTEGER,
    observacoes TEXT,
    awarded_by UUID NOT NULL REFERENCES public.users(id),
    awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TABELA 24: system_logs
CREATE TABLE public.system_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as novas tabelas
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliador_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliador_disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_avaliadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categoria_precos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cronograma_febic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feiras_afiliadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feira_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premio_tipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_premios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Triggers para updated_at nas tabelas que precisam
CREATE TRIGGER update_categoria_precos_updated_at
    BEFORE UPDATE ON public.categoria_precos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_pagamentos_updated_at
    BEFORE UPDATE ON public.project_pagamentos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cronograma_febic_updated_at
    BEFORE UPDATE ON public.cronograma_febic
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar storage bucket para documentos
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);

-- Índices para busca frequente
CREATE INDEX idx_project_documents_project_id ON public.project_documents(project_id);
CREATE INDEX idx_project_documents_type ON public.project_documents(document_type);
CREATE INDEX idx_project_timeline_project_id ON public.project_timeline(project_id);
CREATE INDEX idx_avaliador_areas_user_id ON public.avaliador_areas(user_id);
CREATE INDEX idx_avaliador_areas_area_id ON public.avaliador_areas(area_id);
CREATE INDEX idx_avaliador_disponibilidade_user_id ON public.avaliador_disponibilidade(user_id);
CREATE INDEX idx_avaliador_disponibilidade_data ON public.avaliador_disponibilidade(data_disponivel);
CREATE INDEX idx_project_avaliadores_project_id ON public.project_avaliadores(project_id);
CREATE INDEX idx_project_avaliadores_avaliador_id ON public.project_avaliadores(avaliador_id);
CREATE INDEX idx_project_avaliacoes_project_id ON public.project_avaliacoes(project_id);
CREATE INDEX idx_project_avaliacoes_avaliador_id ON public.project_avaliacoes(avaliador_id);
CREATE INDEX idx_project_pagamentos_project_id ON public.project_pagamentos(project_id);
CREATE INDEX idx_project_pagamentos_status ON public.project_pagamentos(status_pagamento);
CREATE INDEX idx_system_settings_key ON public.system_settings(setting_key);
CREATE INDEX idx_system_notices_target_roles ON public.system_notices USING GIN(target_roles);
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX idx_user_notifications_read ON public.user_notifications(is_read);
CREATE INDEX idx_feiras_afiliadas_user_id ON public.feiras_afiliadas(user_id);
CREATE INDEX idx_feira_tokens_feira_id ON public.feira_tokens(feira_id);
CREATE INDEX idx_feira_tokens_token ON public.feira_tokens(token);
CREATE INDEX idx_project_premios_project_id ON public.project_premios(project_id);
CREATE INDEX idx_system_logs_user_id ON public.system_logs(user_id);
CREATE INDEX idx_system_logs_table_record ON public.system_logs(table_name, record_id);
CREATE INDEX idx_system_logs_created_at ON public.system_logs(created_at);

-- Políticas RLS básicas

-- Project_documents: relacionados aos projetos do usuário
CREATE POLICY "Users can view project documents" ON public.project_documents
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE 
            created_by = get_current_user_id() OR
            id IN (SELECT project_id FROM public.project_members WHERE user_id = get_current_user_id()) OR
            id IN (SELECT project_id FROM public.project_orientadores WHERE user_id = get_current_user_id())
        )
    );

CREATE POLICY "Users can upload project documents" ON public.project_documents
    FOR INSERT WITH CHECK (
        uploaded_by = get_current_user_id() AND
        project_id IN (
            SELECT id FROM public.projects WHERE 
            created_by = get_current_user_id() OR
            id IN (SELECT project_id FROM public.project_members WHERE user_id = get_current_user_id()) OR
            id IN (SELECT project_id FROM public.project_orientadores WHERE user_id = get_current_user_id())
        )
    );

-- Project_timeline: relacionados aos projetos do usuário
CREATE POLICY "Users can view project timeline" ON public.project_timeline
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE 
            created_by = get_current_user_id() OR
            id IN (SELECT project_id FROM public.project_members WHERE user_id = get_current_user_id()) OR
            id IN (SELECT project_id FROM public.project_orientadores WHERE user_id = get_current_user_id())
        )
    );

-- Avaliador_areas: próprios dados dos avaliadores
CREATE POLICY "Users can manage own evaluator areas" ON public.avaliador_areas
    FOR ALL USING (user_id = get_current_user_id())
    WITH CHECK (user_id = get_current_user_id());

-- Avaliador_disponibilidade: próprios dados dos avaliadores
CREATE POLICY "Users can manage own availability" ON public.avaliador_disponibilidade
    FOR ALL USING (user_id = get_current_user_id())
    WITH CHECK (user_id = get_current_user_id());

-- Project_avaliacoes: avaliadores podem ver suas próprias avaliações
CREATE POLICY "Evaluators can view own evaluations" ON public.project_avaliacoes
    FOR SELECT USING (avaliador_id = get_current_user_id());

CREATE POLICY "Evaluators can insert own evaluations" ON public.project_avaliacoes
    FOR INSERT WITH CHECK (avaliador_id = get_current_user_id());

CREATE POLICY "Evaluators can update own evaluations" ON public.project_avaliacoes
    FOR UPDATE USING (avaliador_id = get_current_user_id());

-- Categoria_precos: todos podem visualizar (dados públicos)
CREATE POLICY "Anyone can view pricing" ON public.categoria_precos
    FOR SELECT USING (true);

-- Project_pagamentos: relacionados aos projetos do usuário
CREATE POLICY "Users can view project payments" ON public.project_pagamentos
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE 
            created_by = get_current_user_id() OR
            id IN (SELECT project_id FROM public.project_members WHERE user_id = get_current_user_id()) OR
            id IN (SELECT project_id FROM public.project_orientadores WHERE user_id = get_current_user_id())
        )
    );

-- System_settings: apenas visualização (dados públicos)
CREATE POLICY "Anyone can view system settings" ON public.system_settings
    FOR SELECT USING (true);

-- Cronograma_febic: todos podem visualizar (dados públicos)
CREATE POLICY "Anyone can view schedule" ON public.cronograma_febic
    FOR SELECT USING (true);

-- System_notices: todos podem visualizar (dados públicos)
CREATE POLICY "Anyone can view notices" ON public.system_notices
    FOR SELECT USING (true);

-- User_notifications: próprias notificações
CREATE POLICY "Users can view own notifications" ON public.user_notifications
    FOR SELECT USING (user_id = get_current_user_id());

CREATE POLICY "Users can update own notifications" ON public.user_notifications
    FOR UPDATE USING (user_id = get_current_user_id());

-- Feiras_afiliadas: próprios dados das feiras
CREATE POLICY "Users can manage own affiliated fairs" ON public.feiras_afiliadas
    FOR ALL USING (user_id = get_current_user_id())
    WITH CHECK (user_id = get_current_user_id());

-- Premio_tipos: todos podem visualizar (dados públicos)
CREATE POLICY "Anyone can view award types" ON public.premio_tipos
    FOR SELECT USING (true);

-- Project_premios: relacionados aos projetos do usuário
CREATE POLICY "Users can view project awards" ON public.project_premios
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE 
            created_by = get_current_user_id() OR
            id IN (SELECT project_id FROM public.project_members WHERE user_id = get_current_user_id()) OR
            id IN (SELECT project_id FROM public.project_orientadores WHERE user_id = get_current_user_id())
        )
    );

-- System_logs: apenas logs próprios (para auditoria pessoal)
CREATE POLICY "Users can view own logs" ON public.system_logs
    FOR SELECT USING (user_id = get_current_user_id());

-- Políticas para storage bucket de documentos
CREATE POLICY "Users can view project documents in storage" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-documents');

CREATE POLICY "Users can upload project documents to storage" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'project-documents');

CREATE POLICY "Users can update project documents in storage" ON storage.objects
    FOR UPDATE USING (bucket_id = 'project-documents');

CREATE POLICY "Users can delete project documents in storage" ON storage.objects
    FOR DELETE USING (bucket_id = 'project-documents');