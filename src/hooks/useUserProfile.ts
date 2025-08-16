import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  // Dados da tabela users
  id: string;
  email: string;
  cpf: string;
  nome: string;
  telefone?: string;
  data_nascimento?: string;
  endereco_completo?: string;
  
  // Dados da tabela user_profiles
  profile_id?: string;
  instituicao?: string;
  nivel_escolar?: string;
  formacao_academica?: string;
  area_atuacao?: string;
  curriculo_lattes?: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      // Buscar dados do usuário e perfil em uma query
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, email, cpf, nome, telefone, data_nascimento, endereco_completo,
          user_profiles (
            id, instituicao, nivel_escolar, formacao_academica, area_atuacao, curriculo_lattes
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        throw error;
      }

      if (!data) return null;

      const profile = Array.isArray(data.user_profiles) ? data.user_profiles[0] : data.user_profiles;

      return {
        id: data.id,
        email: data.email,
        cpf: data.cpf,
        nome: data.nome,
        telefone: data.telefone,
        data_nascimento: data.data_nascimento,
        endereco_completo: data.endereco_completo,
        profile_id: profile?.id,
        instituicao: profile?.instituicao,
        nivel_escolar: profile?.nivel_escolar,
        formacao_academica: profile?.formacao_academica,
        area_atuacao: profile?.area_atuacao,
        curriculo_lattes: profile?.curriculo_lattes,
      };
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // Separar dados de users e user_profiles
      const userData = {
        nome: profileData.nome,
        telefone: profileData.telefone,
        data_nascimento: profileData.data_nascimento,
        endereco_completo: profileData.endereco_completo,
        updated_at: new Date().toISOString(),
      };

      const profileUpdateData = {
        instituicao: profileData.instituicao,
        nivel_escolar: profileData.nivel_escolar,
        formacao_academica: profileData.formacao_academica,
        area_atuacao: profileData.area_atuacao,
        curriculo_lattes: profileData.curriculo_lattes,
        updated_at: new Date().toISOString(),
      };

      // Atualizar dados na tabela users
      const { error: userError } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id);

      if (userError) throw userError;

      // Verificar se o perfil já existe
      if (profileData.profile_id) {
        // Atualizar perfil existente
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update(profileUpdateData)
          .eq('id', profileData.profile_id);

        if (profileError) throw profileError;
      } else {
        // Criar novo perfil
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            ...profileUpdateData,
          });

        if (profileError) throw profileError;
      }

      return profileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    },
  });

  return {
    userProfile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};
