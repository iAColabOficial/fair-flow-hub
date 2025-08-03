import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEvaluation } from '@/hooks/useEvaluation';
import { Calendar, FileText, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const EvaluatorDashboard = () => {
  const { assignments, evaluations, loading } = useEvaluation();

  const pendingAssignments = assignments.filter(a => a.status === 'atribuido');
  const completedEvaluations = evaluations.length;
  const totalAssignments = assignments.length;

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
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Painel do Avaliador</h1>
        <p className="text-muted-foreground">
          Gerencie suas avaliações e disponibilidade para a FEBIC
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingAssignments.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedEvaluations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atribuições</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAssignments}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAssignments > 0 ? Math.round((completedEvaluations / totalAssignments) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Avaliações Pendentes
            </CardTitle>
            <CardDescription>
              Projetos aguardando sua avaliação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAssignments.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Todas as avaliações em dia!</h3>
                <p className="text-muted-foreground text-sm">
                  Você não possui avaliações pendentes no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAssignments.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{assignment.projects.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Cat. {assignment.projects.categoria}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {assignment.etapa}
                        </Badge>
                        {assignment.data_avaliacao && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(assignment.data_avaliacao).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/evaluation/evaluate/${assignment.project_id}`}>
                        Avaliar
                      </Link>
                    </Button>
                  </div>
                ))}
                
                {pendingAssignments.length > 5 && (
                  <div className="text-center pt-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/evaluation/my">
                        Ver todas ({pendingAssignments.length - 5} mais)
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Avaliações Recentes
            </CardTitle>
            <CardDescription>
              Suas últimas avaliações submetidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evaluations.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma avaliação ainda</h3>
                <p className="text-muted-foreground text-sm">
                  Suas avaliações aparecerão aqui após serem submetidas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {evaluations.slice(0, 5).map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{evaluation.projects.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Cat. {evaluation.projects.categoria}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {evaluation.etapa}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Nota: {evaluation.nota_final.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(evaluation.avaliado_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
                
                {evaluations.length > 5 && (
                  <div className="text-center pt-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/evaluation/my">
                        Ver todas ({evaluations.length - 5} mais)
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/evaluation/my" className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Minhas Avaliações</div>
                  <div className="text-xs text-muted-foreground">
                    Ver todas as avaliações
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/evaluation/availability" className="flex flex-col items-center gap-2">
                <Calendar className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Disponibilidade</div>
                  <div className="text-xs text-muted-foreground">
                    Gerenciar agenda
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/profile" className="flex flex-col items-center gap-2">
                <Users className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Meu Perfil</div>
                  <div className="text-xs text-muted-foreground">
                    Editar informações
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

export default EvaluatorDashboard;