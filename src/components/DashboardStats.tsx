import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  FlaskConical, 
  ClipboardCheck,
  Calendar,
  DollarSign,
  Target,
  UserPlus
} from "lucide-react";
import { useDashboardStats, useRecentActivity } from "@/hooks/useDashboardStats";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatTimeAgo = (date: string) => {
  const now = new Date();
  const activityDate = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min atrás`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h atrás`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d atrás`;
  }
};

export const DashboardStats = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentActivity, isLoading: activitiesLoading } = useRecentActivity();

  const statsData = [
    {
      title: "Total de Usuários",
      value: stats?.totalUsuarios || 0,
      icon: Users,
      description: "Usuários registrados",
    },
    {
      title: "Projetos Ativos",
      value: stats?.projetosAtivos || 0,
      icon: FlaskConical,
      description: "Em avaliação ou aprovados",
    },
    {
      title: "Avaliações",
      value: stats?.avaliacoes || 0,
      icon: ClipboardCheck,
      description: "Avaliações realizadas",
    },
    {
      title: "Receita",
      value: formatCurrency(stats?.receita || 0),
      icon: DollarSign,
      description: "Total arrecadado",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20 mb-2" />
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString('pt-BR') : stat.value}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
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
            {statsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projetos Submetidos</span>
                    <span>{stats?.projetosAtivos || 0}</span>
                  </div>
                  <Progress value={Math.min((stats?.projetosAtivos || 0) * 10, 100)} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avaliações Realizadas</span>
                    <span>{stats?.avaliacoes || 0}</span>
                  </div>
                  <Progress value={Math.min((stats?.avaliacoes || 0) * 5, 100)} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usuários Cadastrados</span>
                    <span>{stats?.totalUsuarios || 0}</span>
                  </div>
                  <Progress value={Math.min((stats?.totalUsuarios || 0) * 2, 100)} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Permissões Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-6 h-6 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-primary/10 rounded-md">
                      <UserPlus className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma atividade recente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};