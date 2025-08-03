import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FebicRole = 'autor' | 'orientador' | 'coorientador' | 'avaliador' | 'admin_staff' | 'coordenador_admin' | 'coordenador' | 'diretor' | 'financeiro' | 'feira_afiliada' | 'voluntario';

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
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        user_id: data.user_id,
        role: data.role_type as FebicRole,
        status: data.status as 'pendente' | 'ativo' | 'inativo',
        created_at: data.created_at,
        approved_at: data.approved_at,
        approved_by: data.approved_by,
        notes: '',
      };
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
  const isAdvisor = () => hasRole(['orientador', 'coorientador']);
  const isCoordinator = () => hasRole('coordenador');
  const isFairAffiliate = () => hasRole('feira_afiliada');
  const isVolunteer = () => hasRole('voluntario');

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
    isCoordinator,
    isFairAffiliate,
    isVolunteer,
    canManageUsers,
    canManageProjects,
    canEvaluate,
    canManageFinancial,
    canViewReports,
  };
};