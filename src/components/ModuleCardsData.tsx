import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ModuleData {
  title: string;
  description: string;
  icon: any;
  status: "active" | "in-progress" | "pending";
  stats: { total: string; pending: string };
  color: string;
  href: string;
  actions: string[];
  realData: {
    total: number;
    pending: number;
    loading: boolean;
  };
}

export const useModulesData = () => {
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['module-users'],
    queryFn: async () => {
      const [totalUsers, pendingRoles] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('status', 'pendente')
      ]);

      return {
        total: totalUsers.count || 0,
        pending: pendingRoles.count || 0
      };
    }
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['module-projects'],
    queryFn: async () => {
      const [totalProjects, pendingProjects] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'submetido')
      ]);

      return {
        total: totalProjects.count || 0,
        pending: pendingProjects.count || 0
      };
    }
  });

  const { data: evaluationsData, isLoading: evaluationsLoading } = useQuery({
    queryKey: ['module-evaluations'],
    queryFn: async () => {
      const [totalEvaluations, pendingEvaluations] = await Promise.all([
        supabase.from('project_avaliacoes').select('id', { count: 'exact', head: true }),
        supabase.from('project_avaliadores').select('id', { count: 'exact', head: true }).eq('status', 'atribuido')
      ]);

      return {
        total: totalEvaluations.count || 0,
        pending: pendingEvaluations.count || 0
      };
    }
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['module-payments'],
    queryFn: async () => {
      const [totalPayments, pendingPayments] = await Promise.all([
        supabase.from('project_pagamentos').select('valor_final').eq('status_pagamento', 'pago'),
        supabase.from('project_pagamentos').select('id', { count: 'exact', head: true }).eq('status_pagamento', 'pendente')
      ]);

      const totalRevenue = totalPayments.data?.reduce((sum, p) => sum + Number(p.valor_final || 0), 0) || 0;

      return {
        total: totalRevenue,
        pending: pendingPayments.count || 0
      };
    }
  });

  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['module-notifications'],
    queryFn: async () => {
      const [totalNotifications, pendingNotifications] = await Promise.all([
        supabase.from('user_notifications').select('id', { count: 'exact', head: true }),
        supabase.from('system_notices').select('id', { count: 'exact', head: true }).eq('is_active', true)
      ]);

      return {
        total: totalNotifications.count || 0,
        pending: pendingNotifications.count || 0
      };
    }
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['module-events'],
    queryFn: async () => {
      const now = new Date().toISOString().split('T')[0];
      const [totalEvents, upcomingEvents] = await Promise.all([
        supabase.from('cronograma_febic').select('id', { count: 'exact', head: true }),
        supabase.from('cronograma_febic').select('id', { count: 'exact', head: true }).gte('data_inicio', now)
      ]);

      return {
        total: totalEvents.count || 0,
        pending: upcomingEvents.count || 0
      };
    }
  });

  return {
    usersData: {
      ...usersData,
      loading: usersLoading
    },
    projectsData: {
      ...projectsData,
      loading: projectsLoading
    },
    evaluationsData: {
      ...evaluationsData,
      loading: evaluationsLoading
    },
    paymentsData: {
      ...paymentsData,
      loading: paymentsLoading
    },
    notificationsData: {
      ...notificationsData,
      loading: notificationsLoading
    },
    eventsData: {
      ...eventsData,
      loading: eventsLoading
    }
  };
};