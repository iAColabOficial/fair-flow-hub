import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const modules = [
  {
    title: "Gestão de Usuários",
    description: "Gerencie registros de estudantes, professores e avaliadores com permissões baseadas em funções",
    icon: Users,
    status: "active",
    stats: { total: "1.247 usuários", pending: "12 aprovações pendentes" },
    color: "bg-blue-500",
    href: "/users",
    actions: ["Ver Usuários", "Aprovações Pendentes", "Adicionar Usuário"],
  },
  {
    title: "Sistema de Projetos",
    description: "Ciclo completo de projetos desde criação até submissão com documentação",
    icon: FlaskConical,
    status: "active",
    stats: { total: "156 projetos", pending: "23 aguardando revisão" },
    color: "bg-green-500",
    href: "/projects",
    actions: ["Ver Projetos", "Fila de Revisão", "Criar Projeto"],
  },
  {
    title: "Sistema de Avaliação",
    description: "Distribuição automatizada de avaliações com interface abrangente de notas",
    icon: ClipboardCheck,
    status: "in-progress",
    stats: { total: "89 concluídas", pending: "67 restantes" },
    color: "bg-orange-500",
    href: "/evaluations",
    actions: ["Ver Avaliações", "Atribuir Avaliadores", "Resultados"],
  },
  {
    title: "Gestão Financeira",
    description: "Integração ASAAS para cobrança automática, pagamentos e relatórios financeiros",
    icon: CreditCard,
    status: "active",
    stats: { total: "R$ 24.580", pending: "14 pagamentos pendentes" },
    color: "bg-purple-500",
    href: "/financial",
    actions: ["Ver Transações", "Gerar Relatórios", "Links de Pagamento"],
  },
  {
    title: "Centro de Comunicação",
    description: "Gestão de cronograma, notificações e logs completos de auditoria",
    icon: MessageSquare,
    status: "active",
    stats: { total: "348 mensagens", pending: "5 agendadas" },
    color: "bg-pink-500",
    href: "/communication",
    actions: ["Enviar Mensagem", "Ver Logs", "Agendar"],
  },
  {
    title: "Eventos e Calendário",
    description: "Gerencie eventos da feira, prazos e datas importantes",
    icon: Calendar,
    status: "active",
    stats: { total: "12 eventos", pending: "3 próximos" },
    color: "bg-indigo-500",
    href: "/events",
    actions: ["Ver Calendário", "Criar Evento", "Gerenciar Prazos"],
  },
  {
    title: "Analytics e BI",
    description: "Business intelligence abrangente e análises de desempenho",
    icon: BarChart3,
    status: "active",
    stats: { total: "15 relatórios", pending: "Relatório semanal devido" },
    color: "bg-cyan-500",
    href: "/analytics",
    actions: ["Ver Dashboard", "Gerar Relatório", "Exportar Dados"],
  },
  {
    title: "Certificados e Premiações",
    description: "Geração automatizada de certificados e sistema de gestão de premiações",
    icon: Award,
    status: "pending",
    stats: { total: "45 certificados", pending: "Pronto para geração" },
    color: "bg-yellow-500",
    href: "/certificates",
    actions: ["Gerar Certificados", "Ver Modelos", "Premiar Vencedores"],
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Módulos do Sistema</h2>
          <p className="text-muted-foreground">Gerencie todos os aspectos da sua feira de ciências</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Configurações do Sistema
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
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
                  <span className="font-medium">{module.stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-primary">{module.stats.pending}</span>
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