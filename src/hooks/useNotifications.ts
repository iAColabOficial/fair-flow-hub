import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: async (): Promise<number> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count } = await supabase
        .from('user_notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      return count || 0;
    },
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  });
};
