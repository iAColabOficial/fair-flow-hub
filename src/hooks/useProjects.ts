import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  titulo: string;
  categoria: string;
  subcategoria?: string;
  area_conhecimento_id: string;
  status: string;
  is_credenciado: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  resumo?: string;
  palavras_chave?: string;
  token_feira?: string;
  areas_conhecimento?: {
    nome: string;
    codigo_cnpq?: string;
  };
  project_members?: Array<{
    user_id: string;
    role: string;
    users: {
      nome: string;
      email: string;
    };
  }>;
  project_orientadores?: Array<{
    user_id: string;
    tipo: string;
    users: {
      nome: string;
      email: string;
    };
  }>;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          areas_conhecimento(nome, codigo_cnpq),
          project_members(
            user_id,
            role,
            users(nome, email)
          ),
          project_orientadores(
            user_id,
            tipo,
            users(nome, email)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProject = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          areas_conhecimento(nome, codigo_cnpq),
          project_members(
            user_id,
            role,
            users(nome, email)
          ),
          project_orientadores(
            user_id,
            tipo,
            users(nome, email)
          ),
          project_documents(
            id,
            document_type,
            file_name,
            file_path,
            uploaded_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar projeto",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates as any)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso",
      });
      
      fetchProjects();
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Projeto deletado com sucesso",
      });
      
      fetchProjects();
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar projeto",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return {
    projects,
    loading,
    fetchProjects,
    getProject,
    updateProject,
    deleteProject,
  };
};