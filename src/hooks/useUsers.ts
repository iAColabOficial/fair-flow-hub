import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
}

// HOOK GERAL: Busca todos os usuários ativos (para casos gerais)
export function useUsers(searchTerm?: string) {
  return useQuery({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      try {
        console.log('🔍 [USERS] Buscando usuários gerais:', searchTerm);

        let query = supabase
          .from('users')
          .select('id, nome, email, cpf')
          .eq('is_active', true);

        if (searchTerm && searchTerm.length >= 2) {
          query = query.or(`nome.ilike.%${searchTerm}%, email.ilike.%${searchTerm}%, cpf.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query.order('nome').limit(20);
        
        if (error) {
          console.error('❌ Erro useUsers:', error);
          throw error;
        }

        console.log('👥 Usuários encontrados:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('💥 Erro geral useUsers:', error);
        return [];
      }
    },
    enabled: !searchTerm || searchTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10 // 10 minutos
  });
}

// HOOK ESPECÍFICO: Busca orientadores ativos (para campos orientador/coorientador)
export function useOrientadores(cpfSearch?: string) {
  return useQuery({
    queryKey: ['orientadores-view', cpfSearch],
    queryFn: async () => {
      try {
        console.log('🎯 [ORIENTADORES] Buscando orientadores com CPF:', cpfSearch);

        // Consulta otimizada na VIEW orientadores_ativos (sem JOINs complexos)
        let query = supabase
          .from('orientadores_ativos')
          .select('id, nome, email, cpf');

        // Filtrar APENAS por CPF (busca segura)
        if (cpfSearch && cpfSearch.length >= 3) {
          const cleanCpf = cpfSearch.replace(/[^0-9]/g, '');
          console.log('🧹 CPF limpo para busca (orientadores):', cleanCpf);
          query = query.ilike('cpf', `%${cleanCpf}%`);
        }

        const { data, error } = await query.order('nome').limit(10);

        if (error) {
          console.error('❌ Erro ao buscar orientadores:', error);
          throw error;
        }

        console.log('👥 Orientadores encontrados:', data?.length || 0);
        console.log('✅ Resultado orientadores:', data || []);
        
        return data || [];

      } catch (error) {
        console.error('💥 Erro geral orientadores:', error);
        return [];
      }
    },
    enabled: !cpfSearch || cpfSearch.length >= 3, // Mínimo 3 dígitos do CPF
    staleTime: 1000 * 60 * 5, // 5 minutos (orientadores mudam pouco)
    cacheTime: 1000 * 60 * 10 // 10 minutos
  });
}

// HOOK ESPECÍFICO: Busca autores ativos (para campo integrantes da equipe)
export function useAutores(cpfSearch?: string) {
  return useQuery({
    queryKey: ['autores-view', cpfSearch],
    queryFn: async () => {
      try {
        console.log('👤 [AUTORES] Buscando autores com CPF:', cpfSearch);

        // Consulta otimizada na VIEW autores_ativos (apenas role "autor")
        let query = supabase
          .from('autores_ativos')
          .select('id, nome, email, cpf');

        // Filtrar APENAS por CPF (não por nome para segurança)
        if (cpfSearch && cpfSearch.length >= 3) {
          const cleanCpf = cpfSearch.replace(/[^0-9]/g, '');
          console.log('🧹 CPF limpo para busca (autores):', cleanCpf);
          query = query.ilike('cpf', `%${cleanCpf}%`);
        }

        const { data, error } = await query.order('nome').limit(10);

        if (error) {
          console.error('❌ Erro ao buscar autores:', error);
          throw error;
        }

        console.log('👥 Autores encontrados:', data?.length || 0);
        console.log('✅ Resultado autores:', data || []);
        
        return data || [];

      } catch (error) {
        console.error('💥 Erro geral autores:', error);
        return [];
      }
    },
    enabled: !cpfSearch || cpfSearch.length >= 3, // Mínimo 3 dígitos do CPF
    staleTime: 1000 * 60 * 2, // 2 minutos (autores podem mudar mais)
    cacheTime: 1000 * 60 * 5 // 5 minutos
  });
}

// HOOK AVANÇADO: Busca usuários por role específico (para casos especiais)
export function useUsersByRole(role: 'autor' | 'orientador' | 'avaliador' | 'admin_staff', searchTerm?: string) {
  return useQuery({
    queryKey: ['users-by-role', role, searchTerm],
    queryFn: async () => {
      try {
        console.log(`🎭 [ROLE-${role.toUpperCase()}] Buscando usuários:`, searchTerm);

        // Usar VIEW específica se disponível, senão fazer JOIN
        const viewName = role === 'orientador' ? 'orientadores_ativos' : 
                        role === 'autor' ? 'autores_ativos' : null;

        let query;
        
        if (viewName) {
          // Usar VIEW otimizada
          query = supabase.from(viewName).select('id, nome, email, cpf');
        } else {
          // Fazer JOIN apenas quando necessário
          query = supabase
            .from('users')
            .select(`
              id, nome, email, cpf,
              user_roles!inner(role_type, status)
            `)
            .eq('is_active', true)
            .eq('user_roles.role_type', role)
            .eq('user_roles.status', 'ativo');
        }

        if (searchTerm && searchTerm.length >= 2) {
          const cleanTerm = searchTerm.replace(/[^0-9]/g, '');
          if (cleanTerm.length >= 3) {
            // Busca por CPF se tiver números suficientes
            query = query.ilike('cpf', `%${cleanTerm}%`);
          } else {
            // Busca por nome se for texto
            query = query.ilike('nome', `%${searchTerm}%`);
          }
        }

        const { data, error } = await query.order('nome').limit(15);

        if (error) {
          console.error(`❌ Erro ao buscar ${role}:`, error);
          throw error;
        }

        // Mapear dados se veio de JOIN
        const result = viewName ? data : (data || []).map(user => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          cpf: user.cpf
        }));

        console.log(`👥 ${role} encontrados:`, result?.length || 0);
        return result || [];

      } catch (error) {
        console.error(`💥 Erro geral ${role}:`, error);
        return [];
      }
    },
    enabled: !searchTerm || searchTerm.length >= 2,
    staleTime: 1000 * 60 * 3, // 3 minutos
    cacheTime: 1000 * 60 * 8 // 8 minutos
  });
}