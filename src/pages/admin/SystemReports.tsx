import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/hooks/useAdmin';
import { BarChart3, Download, Calendar, FileSpreadsheet, Filter, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const SystemReports = () => {
  const { stats, loading } = useAdmin();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
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
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dados não disponíveis</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar os dados para gerar os relatórios.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preparar dados para diferentes tipos de relatórios
  const categoryData = Object.entries(stats.projectsByCategory).map(([category, count]) => ({
    name: `Categoria ${category}`,
    value: count,
    percentage: Math.round((count / stats.totalProjects) * 100),
  }));

  const statusData = Object.entries(stats.projectsByStatus).map(([status, count]) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: count,
    percentage: Math.round((count / stats.totalProjects) * 100),
  }));

  const evaluationData = Object.entries(stats.evaluationsByEtapa).map(([etapa, count]) => ({
    name: etapa.charAt(0).toUpperCase() + etapa.slice(1),
    value: count,
    percentage: stats.totalEvaluations > 0 ? Math.round((count / stats.totalEvaluations) * 100) : 0,
  }));

  const exportReport = (type: string) => {
    // Implementar exportação de relatórios
    console.log(`Exporting ${type} report...`);
    // Aqui você pode implementar a lógica de exportação para PDF, Excel, etc.
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Relatórios do Sistema</h1>
        <p className="text-muted-foreground">
          Análises e estatísticas detalhadas da FEBIC
        </p>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Configurações
          </CardTitle>
          <CardDescription>
            Configure os parâmetros do relatório que deseja visualizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Relatório</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="projects">Projetos</SelectItem>
                  <SelectItem value="evaluations">Avaliações</SelectItem>
                  <SelectItem value="users">Usuários</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os dados</SelectItem>
                  <SelectItem value="current_year">Ano atual</SelectItem>
                  <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last_month">Último mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={() => exportReport('pdf')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button onClick={() => exportReport('excel')} variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Participação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProjects > 0 ? Math.round((stats.totalEvaluations / stats.totalProjects) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Projetos com avaliação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categoria Mais Popular</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryData.length > 0 
                ? categoryData.reduce((max, cat) => cat.value > max.value ? cat : max).name.replace('Categoria ', '')
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {categoryData.length > 0 
                ? `${categoryData.reduce((max, cat) => cat.value > max.value ? cat : max).value} projetos`
                : 'Nenhum projeto'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingEvaluations}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando avaliação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência do Sistema</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.pendingEvaluations === 0 ? '100%' : 
               Math.round(((stats.totalEvaluations) / (stats.totalEvaluations + stats.pendingEvaluations)) * 100) + '%'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações concluídas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projetos por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>
              Número e percentual de projetos em cada categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name.replace('Categoria ', '')} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="grid gap-2">
                  {categoryData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.value} projetos</Badge>
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhum projeto cadastrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status dos Projetos */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Projetos</CardTitle>
            <CardDescription>
              Distribuição dos projetos pelos diferentes status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="grid gap-2">
                  {statusData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.value} projetos</Badge>
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhum projeto cadastrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Avaliações por Etapa */}
        <Card>
          <CardHeader>
            <CardTitle>Avaliações por Etapa</CardTitle>
            <CardDescription>
              Número de avaliações realizadas em cada etapa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evaluationData.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={evaluationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="grid gap-2">
                  {evaluationData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.value} avaliações</Badge>
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhuma avaliação realizada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo Executivo */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Executivo</CardTitle>
            <CardDescription>
              Principais indicadores do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Participação Geral</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Total de {stats.totalUsers} usuários cadastrados no sistema, 
                  com {stats.totalProjects} projetos submetidos.
                </p>
                <div className="flex gap-2">
                  <Badge variant="default">{stats.totalUsers} usuários</Badge>
                  <Badge variant="default">{stats.totalProjects} projetos</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Processo de Avaliação</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {stats.totalEvaluations} avaliações concluídas, 
                  com {stats.pendingEvaluations} ainda pendentes.
                </p>
                <div className="flex gap-2">
                  <Badge variant="default">{stats.totalEvaluations} concluídas</Badge>
                  {stats.pendingEvaluations > 0 && (
                    <Badge variant="destructive">{stats.pendingEvaluations} pendentes</Badge>
                  )}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Distribuição</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Projetos distribuídos em {Object.keys(stats.projectsByCategory).length} categorias diferentes,
                  com {Object.keys(stats.projectsByStatus).length} status distintos.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">{Object.keys(stats.projectsByCategory).length} categorias</Badge>
                  <Badge variant="outline">{Object.keys(stats.projectsByStatus).length} status</Badge>
                </div>
              </div>

              {stats.pendingEvaluations > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold mb-2 text-orange-800">Ação Necessária</h4>
                  <p className="text-sm text-orange-700 mb-2">
                    Existem {stats.pendingEvaluations} avaliações pendentes que precisam de atenção.
                  </p>
                  <Badge variant="destructive">Urgente</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemReports;