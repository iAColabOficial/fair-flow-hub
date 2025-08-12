import { useUserPermissions } from "@/hooks/useUserRole";
import { Navigate, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardStats } from "@/components/DashboardStats";
import { ModuleCards } from "@/components/ModuleCards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, FlaskConical, Plus } from "lucide-react";

const Dashboard = () => {
  const { userRole, status, isAdmin } = useUserPermissions();
  const navigate = useNavigate();

  // Se o usuário está pendente de aprovação
  if (status === 'pendente') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">Aguardando Aprovação</CardTitle>
                  <CardDescription>
                    Sua conta foi criada com sucesso como <strong>{userRole}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Sua solicitação de acesso está sendo analisada pela equipe administrativa. 
                      Você receberá um email quando sua conta for aprovada.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium">Próximos passos:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Aguarde a aprovação da sua conta</li>
                      <li>• Verifique seu email regularmente</li>
                      <li>• Em caso de dúvidas, entre em contato conosco</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Se o usuário está inativo
  if (status === 'inativo') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Conta Inativa</CardTitle>
                  <CardDescription>
                    Sua conta está atualmente inativa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive">
                    <AlertDescription>
                      Sua conta foi desativada. Entre em contato com o administrador para mais informações.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Dashboard normal para usuários ativos
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Painel FEBIC - {userRole}
            </h1>
            <p className="text-muted-foreground text-lg">
              Bem-vindo à Plataforma de Gestão da Feira de Iniciação Científica
            </p>
          </div>

          {status === 'ativo' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Sua conta está ativa e você tem acesso completo às funcionalidades do sistema.
              </AlertDescription>
            </Alert>
          )}

          {/* Conditional dashboard components based on user role */}
          {isAdmin() && (
            <>
              <DashboardStats />
              <ModuleCards />
            </>
          )}
          
          {/* Limited cards for autor/orientador */}
          {(userRole === 'autor' || userRole === 'orientador' || userRole === 'coorientador') && !isAdmin() && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Seus Módulos</h2>
                <p className="text-muted-foreground">Gerencie seus projetos</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary cursor-pointer" onClick={() => navigate('/projects')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <FlaskConical className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Meus Projetos</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm mt-2">
                      Visualize e gerencie seus projetos submetidos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline" onClick={(e) => { e.stopPropagation(); navigate('/projects'); }}>
                      Ver Projetos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary cursor-pointer" onClick={() => navigate('/projects/new')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Plus className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Novo Projeto</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm mt-2">
                      Crie e submeta um novo projeto para a feira
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline" onClick={(e) => { e.stopPropagation(); navigate('/projects/new'); }}>
                      Criar Projeto
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;