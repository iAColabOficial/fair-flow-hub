import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as CustomUser, UserRole, UserProfile } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  customUser: CustomUser | null;
  userRoles: UserRole[];
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  cleanupAuthState: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Buscar dados do usuário customizado
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userData) {
        setCustomUser(userData);
      }

      // Buscar roles do usuário
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'ativo');

      if (rolesData) {
        setUserRoles(rolesData);
      }

      // Buscar perfil do usuário
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileData) {
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer database calls to prevent auth state change deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setCustomUser(null);
          setUserRoles([]);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserData(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Credenciais inválidas. Verifique seu email e senha.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Email não confirmado. Verifique sua caixa de entrada.');
        } else {
          toast.error(error.message);
        }
        return { error };
      }

      if (data.user) {
        toast.success('Login realizado com sucesso!');
        // Force page reload for clean state
        window.location.href = '/dashboard';
      }

      return { error: null };
    } catch (error: any) {
      toast.error('Erro inesperado. Tente novamente.');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      
      // Clean up existing state
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.fullName,
            cpf: userData.cpf,
            phone: userData.phone,
            instituicao: userData.instituicao,
            role: userData.role,
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('Este email já está cadastrado. Faça login.');
        } else if (error.message.includes('Password should be')) {
          toast.error('A senha deve ter pelo menos 6 caracteres.');
        } else if (error.message.includes('CPF já cadastrado')) {
          toast.error('Este CPF já está cadastrado no sistema.');
        } else if (error.message.includes('unique_violation')) {
          toast.error('Email ou CPF já cadastrado no sistema.');
        } else {
          toast.error(error.message);
        }
        return { error };
      }

      if (data.user) {
        toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
      }

      return { error: null };
    } catch (error: any) {
      if (error.message?.includes('CPF já cadastrado')) {
        toast.error('Este CPF já está cadastrado no sistema.');
      } else if (error.message?.includes('unique_violation')) {
        toast.error('Email ou CPF já cadastrado no sistema.');
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      toast.success('Logout realizado com sucesso!');
      
      setCustomUser(null);
      setUserRoles([]);
      setUserProfile(null);
      
      // Force page reload for clean state
      window.location.href = '/auth/login';
    } catch (error) {
      toast.error('Erro ao fazer logout.');
    }
  };

  const hasRole = (role: string) => {
    return userRoles.some(userRole => userRole.role_type === role);
  };

  const isAdmin = hasRole('admin_staff') || hasRole('diretor') || hasRole('coordenador_admin');

  const value = {
    user,
    session,
    customUser,
    userRoles,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    cleanupAuthState,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};