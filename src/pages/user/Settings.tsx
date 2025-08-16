import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Settings, Bell, Globe, Palette, Loader2, RotateCcw } from "lucide-react";

export const UserSettings = () => {
  const { settings, isLoading, updateSetting, saveAllSettings, resetSettings } = useUserSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50">
        <Header />
        <div className="flex h-screen pt-16">
          <Sidebar className="w-64 border-r" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar className="w-64 border-r" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold">Configurações</h1>
                  <p className="text-muted-foreground">Personalize sua experiência na plataforma</p>
                </div>
              </div>
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restaurar Padrão
              </Button>
            </div>

            {/* Aparência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Aparência
                </CardTitle>
                <CardDescription>
                  Personalize a aparência da interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">☀️ Claro</SelectItem>
                      <SelectItem value="dark">🌙 Escuro</SelectItem>
                      <SelectItem value="system">🖥️ Automático (Sistema)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {settings.theme === 'system' && 'O tema será alterado automaticamente baseado nas configurações do seu dispositivo'}
                    {settings.theme === 'light' && 'Interface clara para melhor visibilidade durante o dia'}
                    {settings.theme === 'dark' && 'Interface escura para reduzir cansaço visual'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notificações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure como e quando você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push</Label>
                    <p className="text-sm text-muted-foreground">Notificações push no navegador</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-digest">Resumo Semanal</Label>
                    <p className="text-sm text-muted-foreground">Receber resumo das atividades semanalmente</p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => updateSetting('weeklyDigest', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="project-updates">Atualizações de Projetos</Label>
                    <p className="text-sm text-muted-foreground">Notificações sobre mudanças em seus projetos</p>
                  </div>
                  <Switch
                    id="project-updates"
                    checked={settings.projectUpdates}
                    onCheckedChange={(checked) => updateSetting('projectUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Idioma e Região */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Idioma e Região
                </CardTitle>
                <CardDescription>
                  Configure idioma e configurações regionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                        <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fuso horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                        <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                        <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Estado Atual */}
            <Card>
              <CardHeader>
                <CardTitle>Estado Atual das Configurações</CardTitle>
                <CardDescription>
                  Resumo das suas configurações atuais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Tema:</strong> {
                      settings.theme === 'system' ? 'Automático' : 
                      settings.theme === 'dark' ? 'Escuro' : 'Claro'
                    }</p>
                    <p><strong>Idioma:</strong> {
                      settings.language === 'pt-BR' ? 'Português (Brasil)' :
                      settings.language === 'en-US' ? 'English (US)' : 'Español'
                    }</p>
                  </div>
                  <div>
                    <p><strong>Notificações Email:</strong> {settings.emailNotifications ? 'Ativadas' : 'Desativadas'}</p>
                    <p><strong>Notificações Push:</strong> {settings.pushNotifications ? 'Ativadas' : 'Desativadas'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={saveAllSettings}>
                Salvar Todas as Configurações
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserSettings;
