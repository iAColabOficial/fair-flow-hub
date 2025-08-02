import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  FlaskConical, 
  ClipboardCheck, 
  TrendingUp,
  Calendar,
  Award,
  DollarSign,
  Target
} from "lucide-react";

const stats = [
  {
    title: "Total de Usuários",
    value: "1.247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "Participantes ativos",
  },
  {
    title: "Projetos Ativos",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: FlaskConical,
    description: "Submetidos este mês",
  },
  {
    title: "Avaliações",
    value: "89",
    change: "57%",
    changeType: "neutral" as const,
    icon: ClipboardCheck,
    description: "Taxa de conclusão",
  },
  {
    title: "Receita",
    value: "R$ 24.580",
    change: "+15%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Este mês",
  },
];

const recentActivity = [
  {
    title: "Novo projeto submetido",
    description: "Eficiência Energética Solar por Maria Silva",
    time: "2 horas atrás",
    type: "project",
    icon: FlaskConical,
  },
  {
    title: "Avaliação concluída",
    description: "Projeto #127 avaliado pelo Dr. Santos",
    time: "4 horas atrás",
    type: "evaluation",
    icon: ClipboardCheck,
  },
  {
    title: "Novo usuário registrado",
    description: "João Pedro - Categoria estudante",
    time: "6 horas atrás",
    type: "user",
    icon: Users,
  },
  {
    title: "Pagamento recebido",
    description: "Taxa de inscrição - Escola ABC",
    time: "1 dia atrás",
    type: "payment",
    icon: DollarSign,
  },
];

export const DashboardStats = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={stat.changeType === "positive" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Progresso da Feira
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Submissões de Projetos</span>
                <span>156/200</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Avaliações</span>
                <span>89/156</span>
              </div>
              <Progress value={57} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pagamentos</span>
                <span>142/156</span>
              </div>
              <Progress value={91} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 bg-primary/10 rounded-md">
                    <activity.icon className="w-3 h-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};