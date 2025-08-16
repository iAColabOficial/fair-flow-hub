import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  projectUpdates: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
  projectUpdates: true,
  theme: 'system',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo'
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('user-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Aplicar tema
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System theme
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listener para mudanças no tema do sistema
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const updateSetting = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Salvar no localStorage
    localStorage.setItem('user-settings', JSON.stringify(newSettings));
    
    // Feedback para o usuário
    if (key === 'theme') {
      toast.success(`Tema alterado para ${value === 'system' ? 'automático' : value === 'dark' ? 'escuro' : 'claro'}`);
    }
  };

  const saveAllSettings = () => {
    // Aqui poderia salvar no banco de dados no futuro
    localStorage.setItem('user-settings', JSON.stringify(settings));
    toast.success('Configurações salvas com sucesso!');
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('user-settings', JSON.stringify(defaultSettings));
    toast.success('Configurações restauradas para o padrão');
  };

  return {
    settings,
    isLoading,
    updateSetting,
    saveAllSettings,
    resetSettings
  };
};
