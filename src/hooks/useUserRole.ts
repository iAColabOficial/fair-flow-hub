import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FebicRole = 'autor' | 'orientador' | 'avaliador' | 'admin_staff' | 'coordenador_admin' | 'diretor' | 'financeiro' | 'feira_afiliada';

export interface UserRole {
  id: string;
  user_id: string;
  role: FebicRole;
  status: 'pendente' | 'ativo' | 'inativo';
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  notes?: string;
}

export const useUserRole = () => {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async (): Promise<UserRole | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: true,
  });
};

export const useUserPermissions = () => {
  const { data: userRole } = useUserRole();

  const hasRole = (roles: FebicRole | FebicRole[]) => {
    if (!userRole) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole.role);
  };

  const isAdmin = () => hasRole(['admin_staff', 'coordenador_admin', 'diretor']);
  const isEvaluator = () => hasRole('avaliador');
  const isFinancial = () => hasRole('financeiro');
  const isAuthor = () => hasRole('autor');
  const isAdvisor = () => hasRole('orientador');
  const isFairAffiliate = () => hasRole('feira_afiliada');

  const canManageUsers = () => isAdmin();
  const canManageProjects = () => isAdmin() || isAuthor() || isAdvisor();
  const canEvaluate = () => isEvaluator() || isAdmin();
  const canManageFinancial = () => isFinancial() || isAdmin();
  const canViewReports = () => isAdmin() || isFinancial();

  return {
    userRole: userRole?.role,
    status: userRole?.status,
    hasRole,
    isAdmin,
    isEvaluator,
    isFinancial,
    isAuthor,
    isAdvisor,
    isFairAffiliate,
    canManageUsers,
    canManageProjects,
    canEvaluate,
    canManageFinancial,
    canViewReports,
  };
};