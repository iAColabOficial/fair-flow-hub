-- Adicionar política missing para users INSERT
CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT WITH CHECK (true);

-- Completar políticas para areas_conhecimento (admin pode inserir/atualizar)
CREATE POLICY "Admin can insert areas" ON public.areas_conhecimento
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update areas" ON public.areas_conhecimento
    FOR UPDATE USING (true);