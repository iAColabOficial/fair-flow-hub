import { useUserPermissions } from "@/hooks/useUserRole";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import UserApprovalComponent from "@/components/admin/UserApprovalPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const UsersPage = () => {
  const { canManageUsers, isAdmin } = useUserPermissions();

  if (!canManageUsers || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Acesso Negado</CardTitle>
                  <CardDescription>
                    Você não tem permissão para acessar esta área
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Esta página é restrita a administradores do sistema.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Gestão de Usuários
            </h1>
            <p className="text-muted-foreground text-lg">
              Gerencie usuários e aprovações do sistema FEBIC
            </p>
          </div>

          <UserApprovalComponent />
        </main>
      </div>
    </div>
  );
};

export default UsersPage;