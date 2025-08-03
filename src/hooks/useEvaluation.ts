import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface EvaluationAssignment {
  id: string;
  project_id: string;
  avaliador_id: string;
  etapa: string;
  data_avaliacao?: string;
  horario_avaliacao?: string;
  status: string;
  assigned_at: string;
  sala_meet_url?: string;
  projects: {
    titulo: string;
    categoria: string;
    status: string;
    resumo?: string;
  };
}

export interface Evaluation {
  id: string;
  project_id: string;
  avaliador_id: string;
  etapa: string;
  nota_final: number;
  avaliado_at: string;
  comentarios?: string;
  comentarios_publicos?: string;
  is_comentarios_liberados: boolean;
  nota_metodo_cientifico?: number;
  nota_clareza?: number;
  nota_originalidade?: number;
  nota_referencias?: number;
  nota_objetivo_pedagogico?: number;
  nota_conhecimento?: number;
  nota_comunicacao_escrita?: number;
  nota_comunicacao_oral?: number;
  nota_comunidade?: number;
  nota_apresentacao?: number;
  nota_argumentacao?: number;
  projects: {
    titulo: string;
    categoria: string;
  };
}

export interface AvailabilitySlot {
  id: string;
  user_id: string;
  data_disponivel: string;
  horario_inicio: string;
  horario_fim: string;
  is_available: boolean;
  created_at: string;
}

export const useEvaluation = () => {
  const [assignments, setAssignments] = useState<EvaluationAssignment[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAssignments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_avaliadores')
        .select(`
          *,
          projects(titulo, categoria, status, resumo)
        `)
        .eq('avaliador_id', user.id)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar atribuições de avaliação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_avaliacoes')
        .select(`
          *,
          projects(titulo, categoria)
        `)
        .eq('avaliador_id', user.id)
        .order('avaliado_at', { ascending: false });

      if (error) throw error;
      setEvaluations(data || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar avaliações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('avaliador_disponibilidade')
        .select('*')
        .eq('user_id', user.id)
        .order('data_disponivel', { ascending: true });

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar disponibilidade",
        variant: "destructive",
      });
    }
  };

  const submitEvaluation = async (evaluationData: any) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('project_avaliacoes')
        .insert({
          ...evaluationData,
          avaliador_id: user.id,
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Avaliação submetida com sucesso",
      });
      
      fetchEvaluations();
      return true;
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast({
        title: "Erro",
        description: "Erro ao submeter avaliação",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateEvaluation = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('project_avaliacoes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Avaliação atualizada com sucesso",
      });
      
      fetchEvaluations();
      return true;
    } catch (error) {
      console.error('Error updating evaluation:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar avaliação",
        variant: "destructive",
      });
      return false;
    }
  };

  const addAvailability = async (availabilityData: any) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('avaliador_disponibilidade')
        .insert({
          ...availabilityData,
          user_id: user.id,
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Disponibilidade adicionada com sucesso",
      });
      
      fetchAvailability();
      return true;
    } catch (error) {
      console.error('Error adding availability:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar disponibilidade",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAvailability = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('avaliador_disponibilidade')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Disponibilidade atualizada com sucesso",
      });
      
      fetchAvailability();
      return true;
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar disponibilidade",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAssignments();
      fetchEvaluations();
      fetchAvailability();
    }
  }, [user]);

  return {
    assignments,
    evaluations,
    availability,
    loading,
    fetchAssignments,
    fetchEvaluations,
    fetchAvailability,
    submitEvaluation,
    updateEvaluation,
    addAvailability,
    updateAvailability,
  };
};