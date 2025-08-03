import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FlaskConical, 
  ClipboardCheck, 
  CreditCard, 
  MessageSquare, 
  BarChart3,
  Calendar,
  Award,
  Settings,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useModulesData } from "./ModuleCardsData";

const getModulesWithData = (modulesData: any) => [
  {
    title: "Gestão de Usuários",
    description: "Gerencie registros de estudantes, professores e avaliadores com permissões baseadas em funções",
    icon: Users,
    status: "active" as const,
    stats: { 
      total: `${modulesData.usersData?.total || 0} usuários`, 
      pending: `${modulesData.usersData?.pending || 0} aprovações pendentes` 
    },
    color: "bg-blue-500",
    href: "/users",
    actions: ["Ver Usuários", "Aprovações Pendentes", "Adicionar Usuário"],
    loading: modulesData.usersData?.loading || false,
  },
  {
    title: "Sistema de Projetos",
    description: "Ciclo completo de projetos desde criação até submissão com documentação",
    icon: FlaskConical,
    status: "active" as const,
    stats: { 
      total: `${modulesData.projectsData?.total || 0} projetos`, 
      pending: `${modulesData.projectsData?.pending || 0} aguardando revisão` 
    },
    color: "bg-green-500",
    href: "/projects",
    actions: ["Ver Projetos", "Fila de Revisão", "Criar Projeto"],
    loading: modulesData.projectsData?.loading || false,
  },
  {
    title: "Sistema de Avaliação",
    description: "Distribuição automatizada de avaliações com interface abrangente de notas",
    icon: ClipboardCheck,
    status: "active" as const,
    stats: { 
      total: `${modulesData.evaluationsData?.total || 0} concluídas`, 
      pending: `${modulesData.evaluationsData?.pending || 0} restantes` 
    },
    color: "bg-orange-500",
    href: "/evaluation",
    actions: ["Ver Avaliações", "Atribuir Avaliadores", "Resultados"],
    loading: modulesData.evaluationsData?.loading || false,
  },
  {
    title: "Gestão Financeira",
    description: "Integração ASAAS para cobrança automática, pagamentos e relatórios financeiros",
    icon: CreditCard,
    status: "active" as const,
    stats: { 
      total: `R$ ${(modulesData.paymentsData?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      pending: `${modulesData.paymentsData?.pending || 0} pagamentos pendentes` 
    },
    color: "bg-purple-500",
    href: "/finance",
    actions: ["Ver Transações", "Gerar Relatórios", "Links de Pagamento"],
    loading: modulesData.paymentsData?.loading || false,
  },
  {
    title: "Centro de Comunicação",
    description: "Gestão de cronograma, notificações e logs completos de auditoria",
    icon: MessageSquare,
    status: "active" as const,
    stats: { 
      total: `${modulesData.notificationsData?.total || 0} mensagens`, 
      pending: `${modulesData.notificationsData?.pending || 0} ativas` 
    },
    color: "bg-pink-500",
    href: "/communication",
    actions: ["Enviar Mensagem", "Ver Logs", "Agendar"],
    loading: modulesData.notificationsData?.loading || false,
  },
  {
    title: "Eventos e Calendário",
    description: "Gerencie eventos da feira, prazos e datas importantes",
    icon: Calendar,
    status: "active" as const,
    stats: { 
      total: `${modulesData.eventsData?.total || 0} eventos`, 
      pending: `${modulesData.eventsData?.pending || 0} próximos` 
    },
    color: "bg-indigo-500",
    href: "/admin/schedule",
    actions: ["Ver Calendário", "Criar Evento", "Gerenciar Prazos"],
    loading: modulesData.eventsData?.loading || false,
  },
  {
    title: "Analytics e BI",
    description: "Business intelligence abrangente e análises de desempenho",
    icon: BarChart3,
    status: "active" as const,
    stats: { 
      total: "Relatórios em tempo real", 
      pending: "Dashboard atualizado" 
    },
    color: "bg-cyan-500",
    href: "/admin/reports",
    actions: ["Ver Dashboard", "Gerar Relatório", "Exportar Dados"],
    loading: false,
  },
  {
    title: "Atribuições e Papéis",
    description: "Gerencie roles de usuários e atribuições de avaliadores",
    icon: Award,
    status: "active" as const,
    stats: { 
      total: "Sistema ativo", 
      pending: "Funcional" 
    },
    color: "bg-yellow-500",
    href: "/assign-roles",
    actions: ["Atribuir Roles", "Gerenciar Permissões", "Avaliadores"],
    loading: false,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "in-progress":
      return <Clock className="w-4 h-4 text-warning" />;
    case "pending":
      return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    default:
      return <CheckCircle className="w-4 h-4 text-success" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "in-progress":
      return "warning";
    case "pending":
      return "secondary";
    default:
      return "secondary";
  }
};

export const ModuleCards = () => {
  const navigate = useNavigate();
  const modulesData = useModulesData();
  const modules = getModulesWithData(modulesData);

  const handleModuleClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Módulos do Sistema</h2>
          <p className="text-muted-foreground">Gerencie todos os aspectos da sua feira de ciências</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => navigate('/admin/reports')}>
          <Settings className="w-4 h-4" />
          Configurações do Sistema
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary cursor-pointer" onClick={() => handleModuleClick(module.href)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${module.color}/10`}>
                    <module.icon className={`w-5 h-5 text-primary`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(module.status)}
                      <Badge variant={getStatusColor(module.status) as any} className="text-xs">
                        {module.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm mt-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  {module.loading ? (
                    <Skeleton className="h-4 w-16" />
                  ) : (
                    <span className="font-medium">{module.stats.total}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {module.loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <span className="font-medium text-primary">{module.stats.pending}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {module.actions.slice(0, 2).map((action, actionIndex) => (
                  <Badge key={actionIndex} variant="outline" className="text-xs">
                    {action}
                  </Badge>
                ))}
                {module.actions.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{module.actions.length - 2} more
                  </Badge>
                )}
              </div>

              <Button 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModuleClick(module.href);
                }}
              >
                Abrir Módulo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};