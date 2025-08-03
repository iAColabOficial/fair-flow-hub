-- Corrigir funções com search_path mutável
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
    SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

-- Adicionar políticas para INSERT nos project_members e project_orientadores
CREATE POLICY "Project creators can add members" ON public.project_members
    FOR INSERT WITH CHECK (
        project_id IN (
            SELECT id FROM public.projects WHERE created_by = get_current_user_id()
        )
    );

CREATE POLICY "Project creators can add orientadores" ON public.project_orientadores
    FOR INSERT WITH CHECK (
        project_id IN (
            SELECT id FROM public.projects WHERE created_by = get_current_user_id()
        )
    );

-- Adicionar política para inserir roles (apenas admins poderão aprovar depois)
CREATE POLICY "Users can request roles" ON public.user_roles
    FOR INSERT WITH CHECK (user_id = get_current_user_id());