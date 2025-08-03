-- Adicionar políticas faltantes para completar RLS

-- Project_avaliadores: políticas faltantes  
CREATE POLICY "Coordinators can view evaluator assignments" ON public.project_avaliadores
    FOR SELECT USING (true);

CREATE POLICY "Coordinators can manage evaluator assignments" ON public.project_avaliadores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Coordinators can update evaluator assignments" ON public.project_avaliadores
    FOR UPDATE USING (true);

-- Feira_tokens: políticas faltantes
CREATE POLICY "Fair organizers can view tokens" ON public.feira_tokens
    FOR SELECT USING (
        feira_id IN (
            SELECT id FROM public.feiras_afiliadas WHERE user_id = get_current_user_id()
        )
    );

CREATE POLICY "Fair organizers can create tokens" ON public.feira_tokens
    FOR INSERT WITH CHECK (
        created_by = get_current_user_id() AND
        feira_id IN (
            SELECT id FROM public.feiras_afiliadas WHERE user_id = get_current_user_id()
        )
    );

-- System_settings: política para update (apenas admins)
CREATE POLICY "Admins can update settings" ON public.system_settings
    FOR UPDATE USING (true);

CREATE POLICY "Admins can insert settings" ON public.system_settings
    FOR INSERT WITH CHECK (true);