import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface SystemStats {
  totalUsers: number;
  totalProjects: number;
  totalEvaluations: number;
  pendingEvaluations: number;
  projectsByCategory: Record<string, number>;
  projectsByStatus: Record<string, number>;
  evaluationsByEtapa: Record<string, number>;
}

export interface SchedulePhase {
  id: string;
  fase: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value?: string;
  description?: string;
  updated_at: string;
}

export const useAdmin = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [schedule, setSchedule] = useState<SchedulePhase[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, hasRole } = useAuth();

  const fetchSystemStats = async () => {
    if (!user || !hasRole('admin_staff')) return;
    
    setLoading(true);
    try {
      // Buscar estatísticas gerais
      const [usersResult, projectsResult, evaluationsResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('projects').select('categoria, status', { count: 'exact' }),
        supabase.from('project_avaliacoes').select('etapa', { count: 'exact' })
      ]);

      const totalUsers = usersResult.count || 0;
      const totalProjects = projectsResult.count || 0;
      const totalEvaluations = evaluationsResult.count || 0;

      // Buscar avaliações pendentes
      const { count: pendingEvaluations } = await supabase
        .from('project_avaliadores')
        .select('id', { count: 'exact' })
        .eq('status', 'atribuido');

      // Agrupar projetos por categoria
      const projectsByCategory: Record<string, number> = {};
      if (projectsResult.data) {
        projectsResult.data.forEach(project => {
          projectsByCategory[project.categoria] = (projectsByCategory[project.categoria] || 0) + 1;
        });
      }

      // Agrupar projetos por status
      const projectsByStatus: Record<string, number> = {};
      if (projectsResult.data) {
        projectsResult.data.forEach(project => {
          projectsByStatus[project.status] = (projectsByStatus[project.status] || 0) + 1;
        });
      }

      // Agrupar avaliações por etapa
      const evaluationsByEtapa: Record<string, number> = {};
      if (evaluationsResult.data) {
        evaluationsResult.data.forEach(evaluation => {
          evaluationsByEtapa[evaluation.etapa] = (evaluationsByEtapa[evaluation.etapa] || 0) + 1;
        });
      }

      setStats({
        totalUsers,
        totalProjects,
        totalEvaluations,
        pendingEvaluations: pendingEvaluations || 0,
        projectsByCategory,
        projectsByStatus,
        evaluationsByEtapa,
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas do sistema",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cronograma_febic')
        .select('*')
        .order('data_inicio', { ascending: true });

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar cronograma",
        variant: "destructive",
      });
    }
  };

  const fetchSettings = async () => {
    if (!user || !hasRole('admin_staff')) return;
    
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações",
        variant: "destructive",
      });
    }
  };

  const updateSchedulePhase = async (id: string, updates: Partial<SchedulePhase>) => {
    if (!user || !hasRole('admin_staff')) return false;
    
    try {
      const { error } = await supabase
        .from('cronograma_febic')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Fase do cronograma atualizada com sucesso",
      });
      
      fetchSchedule();
      return true;
    } catch (error) {
      console.error('Error updating schedule phase:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar fase do cronograma",
        variant: "destructive",
      });
      return false;
    }
  };

  const createSchedulePhase = async (phaseData: Omit<SchedulePhase, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user || !hasRole('admin_staff')) return false;
    
    try {
      const { error } = await supabase
        .from('cronograma_febic')
        .insert({
          ...phaseData,
          created_by: user.id,
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Fase do cronograma criada com sucesso",
      });
      
      fetchSchedule();
      return true;
    } catch (error) {
      console.error('Error creating schedule phase:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar fase do cronograma",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSetting = async (id: string, value: string) => {
    if (!user || !hasRole('admin_staff')) return false;
    
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({
          setting_value: value,
          updated_by: user.id,
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Configuração atualizada com sucesso",
      });
      
      fetchSettings();
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração",
        variant: "destructive",
      });
      return false;
    }
  };

  const createSetting = async (settingData: Omit<SystemSetting, 'id' | 'updated_at'>) => {
    if (!user || !hasRole('admin_staff')) return false;
    
    try {
      const { error } = await supabase
        .from('system_settings')
        .insert({
          ...settingData,
          updated_by: user.id,
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Configuração criada com sucesso",
      });
      
      fetchSettings();
      return true;
    } catch (error) {
      console.error('Error creating setting:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar configuração",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user && hasRole('admin_staff')) {
      fetchSystemStats();
      fetchSchedule();
      fetchSettings();
    }
  }, [user]);

  return {
    stats,
    schedule,
    settings,
    loading,
    fetchSystemStats,
    fetchSchedule,
    fetchSettings,
    updateSchedulePhase,
    createSchedulePhase,
    updateSetting,
    createSetting,
  };
};