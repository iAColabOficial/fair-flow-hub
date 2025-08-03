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
      const { count: totalUsuarios } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true });

      // Buscar projetos ativos 
      const { count: projetosAtivos } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .in('status', ['submetido', 'selecionado', 'finalista']);

      // Buscar avaliações
      const { count: avaliacoes } = await supabase
        .from('project_avaliacoes')
        .select('id', { count: 'exact', head: true });

      // Buscar receita total
      const { data: pagamentos } = await supabase
        .from('project_pagamentos')
        .select('valor_final')
        .eq('status_pagamento', 'pago');

      const receita = pagamentos?.reduce((sum, p) => sum + Number(p.valor_final || 0), 0) || 0;

      return {
        totalUsuarios: totalUsuarios || 0,
        projetosAtivos: projetosAtivos || 0,
        avaliacoes: avaliacoes || 0,
        receita
      };
    },
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Buscar atividades recentes dos logs do sistema
      const { data } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      return data || [];
    }
  });
};