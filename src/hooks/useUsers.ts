import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
}

export function useUsers(searchTerm?: string) {
  return useQuery({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('id, nome, email, cpf')
        .eq('is_active', true);

      if (searchTerm && searchTerm.length >= 2) {
        query = query.or(`nome.ilike.%${searchTerm}%, email.ilike.%${searchTerm}%, cpf.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('nome').limit(20);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !searchTerm || searchTerm.length >= 2
  });
}