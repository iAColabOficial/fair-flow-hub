import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardStats } from "@/components/DashboardStats";
import { ModuleCards } from "@/components/ModuleCards";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Painel FEBIC
            </h1>
            <p className="text-muted-foreground text-lg">
              Bem-vindo à Plataforma de Gestão da Feira de Iniciação Científica
            </p>
          </div>

          <DashboardStats />
          <ModuleCards />
        </main>
      </div>
    </div>
  );
};

export default Index;
