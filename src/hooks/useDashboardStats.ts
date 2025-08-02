import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalUsuarios: number;
  projetosAtivos: number;
  avaliacoes: number;
  receita: number;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Buscar total de usuários
      const { data: usuarios, error: usuariosError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (usuariosError) throw usuariosError;

      // Buscar projetos ativos
      const { data: projetos, error: projetosError } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .in('status', ['submetido', 'em_avaliacao', 'aprovado']);

      if (projetosError) throw projetosError;

      // Buscar total de avaliações
      const { data: avaliacoes, error: avaliacoesError } = await supabase
        .from('project_avaliacoes')
        .select('id', { count: 'exact', head: true });

      if (avaliacoesError) throw avaliacoesError;

      // Buscar receita total
      const { data: pagamentos, error: pagamentosError } = await supabase
        .from('project_pagamentos')
        .select('valor')
        .eq('status', 'pago');

      if (pagamentosError) throw pagamentosError;

      const receita = pagamentos?.reduce((total, pag) => total + (Number(pag.valor) || 0), 0) || 0;

      return {
        totalUsuarios: usuarios?.length || 0,
        projetosAtivos: projetos?.length || 0,
        avaliacoes: avaliacoes?.length || 0,
        receita
      };
    },
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Buscar atividades recentes dos logs
      const { data: activities, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return activities || [];
    },
    refetchInterval: 2 * 60 * 1000, // Atualizar a cada 2 minutos
  });
};