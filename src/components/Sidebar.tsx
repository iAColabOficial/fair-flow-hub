import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FlaskConical, 
  ClipboardCheck, 
  CreditCard, 
  MessageSquare, 
  Settings,
  BarChart3,
  Award,
  Calendar,
  FileText,
  Home,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useUserPermissions } from "@/hooks/useUserRole";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { canManageUsers, canManageProjects, canEvaluate, canManageFinancial, canViewReports } = useUserPermissions();

  const navigation = [
    {
      name: "Painel",
      icon: Home,
      href: "/dashboard",
      current: location.pathname === "/dashboard",
      show: true,
    },
    {
      name: "Gestão de Usuários",
      icon: Users,
      href: "/users",
      current: location.pathname === "/users",
      badge: "12",
      show: canManageUsers,
    },
    {
      name: "Atribuir Cargos",
      icon: UserPlus,
      href: "/assign-roles",
      current: location.pathname === "/assign-roles",
      show: canManageUsers,
    },
    {
      name: "Projetos",
      icon: FlaskConical,
      href: "/projects",
      current: location.pathname.startsWith("/projects"),
      badge: "45",
      show: canManageProjects,
    },
    {
      name: "Avaliações",
      icon: ClipboardCheck,
      href: "/evaluations",
      current: location.pathname.startsWith("/evaluations"),
      badge: "8",
      show: canEvaluate,
    },
    {
      name: "Financeiro",
      icon: CreditCard,
      href: "/financial",
      current: location.pathname.startsWith("/financial"),
      show: canManageFinancial,
    },
    {
      name: "Comunicação",
      icon: MessageSquare,
      href: "/communication",
      current: location.pathname.startsWith("/communication"),
      show: true,
    },
    {
      name: "Eventos",
      icon: Calendar,
      href: "/events",
      current: location.pathname.startsWith("/events"),
      show: true,
    },
    {
      name: "Relatórios",
      icon: BarChart3,
      href: "/reports",
      current: location.pathname.startsWith("/reports"),
      show: canViewReports,
    },
    {
      name: "Certificados",
      icon: Award,
      href: "/certificates",
      current: location.pathname.startsWith("/certificates"),
      show: true,
    },
  ].filter(item => item.show);

  const quickActions = [
    {
      name: "Novo Projeto",
      icon: FlaskConical,
      href: "/projects/new",
      show: canManageProjects,
    },
    {
      name: "Adicionar Usuário",
      icon: Users,
      href: "/users/new",
      show: canManageUsers,
    },
    {
      name: "Criar Evento",
      icon: Calendar,
      href: "/events/new",
      show: true,
    },
  ].filter(action => action.show);
  return (
    <div className={cn("pb-12 w-64 bg-card border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-foreground">
              Navegação Principal
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={item.current ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-2 h-10",
                    item.current && "bg-primary/10 text-primary border-l-2 border-primary"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {!item.current && <ChevronRight className="w-3 h-3 opacity-50" />}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
              Ações Rápidas
            </h2>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 px-4"
                  asChild
                >
                  <Link to={action.href}>
                    <action.icon className="w-3 h-3" />
                    {action.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Status da Feira</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              FEBIC 2025 está atualmente na fase de avaliação
            </p>
            <Button size="sm" variant="gradient" className="w-full">
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};