import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { Users, FileText, ClipboardCheck, AlertTriangle, TrendingUp, Calendar, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { stats, loading } = useAdmin();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar as estatísticas do sistema.
            </p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preparar dados para gráficos
  const categoryData = Object.entries(stats.projectsByCategory).map(([category, count]) => ({
    name: `Categoria ${category}`,
    value: count,
  }));

  const statusData = Object.entries(stats.projectsByStatus).map(([status, count]) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: count,
  }));

  const evaluationData = Object.entries(stats.evaluationsByEtapa).map(([etapa, count]) => ({
    name: etapa.charAt(0).toUpperCase() + etapa.slice(1),
    value: count,
  }));

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral e estatísticas do sistema FEBIC
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuários cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projetos submetidos à FEBIC
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Realizadas</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Avaliações concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando avaliação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projects by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Projetos por Categoria</CardTitle>
            <CardDescription>
              Distribuição de projetos pelas categorias FEBIC
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhum projeto cadastrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Projetos por Status</CardTitle>
            <CardDescription>
              Distribuição de projetos pelos diferentes status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhum projeto cadastrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evaluations by Etapa */}
        <Card>
          <CardHeader>
            <CardTitle>Avaliações por Etapa</CardTitle>
            <CardDescription>
              Número de avaliações realizadas em cada etapa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evaluationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={evaluationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhuma avaliação realizada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Rápidas</CardTitle>
            <CardDescription>
              Métricas importantes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Taxa de Avaliação</span>
              <Badge variant="outline">
                {stats.totalProjects > 0 
                  ? Math.round((stats.totalEvaluations / stats.totalProjects) * 100)
                  : 0
                }%
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Categorias Ativas</span>
              <Badge variant="outline">
                {Object.keys(stats.projectsByCategory).length}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Status Diferentes</span>
              <Badge variant="outline">
                {Object.keys(stats.projectsByStatus).length}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Etapas de Avaliação</span>
              <Badge variant="outline">
                {Object.keys(stats.evaluationsByEtapa).length}
              </Badge>
            </div>
            
            {stats.pendingEvaluations > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-sm text-orange-800">Avaliações Urgentes</span>
                <Badge variant="destructive">
                  {stats.pendingEvaluations}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Administrativas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades administrativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/users" className="flex flex-col items-center gap-2">
                <Users className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Gerenciar Usuários</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.totalUsers} usuários
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/admin/assign-roles" className="flex flex-col items-center gap-2">
                <ClipboardCheck className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Atribuir Permissões</div>
                  <div className="text-xs text-muted-foreground">
                    Gerenciar roles
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/admin/schedule" className="flex flex-col items-center gap-2">
                <Calendar className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Cronograma FEBIC</div>
                  <div className="text-xs text-muted-foreground">
                    Gerenciar fases
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/admin/reports" className="flex flex-col items-center gap-2">
                <TrendingUp className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Relatórios</div>
                  <div className="text-xs text-muted-foreground">
                    Análises detalhadas
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;