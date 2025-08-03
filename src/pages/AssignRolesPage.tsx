import { useUserPermissions } from "@/hooks/useUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import AssignRolesComponent from "@/components/admin/AssignRolesPage";
import { Shield } from "lucide-react";

const AssignRolesPage = () => {
  const { canManageUsers, isAdmin } = useUserPermissions();

  if (!canManageUsers && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Card>
              <CardHeader className="text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle>Acesso Negado</CardTitle>
                <CardDescription>
                  Você não tem permissão para acessar esta página.
                </CardDescription>
              </CardHeader>
            </Card>
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
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Atribuir Cargos</h1>
              <p className="text-muted-foreground">
                Gerencie e atribua cargos aos usuários do sistema
              </p>
            </div>
            
            <AssignRolesComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignRolesPage;