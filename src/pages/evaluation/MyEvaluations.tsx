import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEvaluation } from '@/hooks/useEvaluation';
import { Search, Edit, Eye, Clock, CheckCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const MyEvaluations = () => {
  const { assignments, evaluations, loading } = useEvaluation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [etapaFilter, setEtapaFilter] = useState('all');

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.projects.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesEtapa = etapaFilter === 'all' || assignment.etapa === etapaFilter;
    
    return matchesSearch && matchesStatus && matchesEtapa;
  });

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.projects.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEtapa = etapaFilter === 'all' || evaluation.etapa === etapaFilter;
    
    return matchesSearch && matchesEtapa;
  });

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
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
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
        <h1 className="text-2xl font-bold">Minhas Avaliações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas atribuições e avaliações realizadas
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre suas avaliações por título, status ou etapa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="atribuido">Atribuído</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <Select value={etapaFilter} onValueChange={setEtapaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendentes ({filteredAssignments.filter(a => a.status === 'atribuido').length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Concluídas ({filteredEvaluations.length})
          </TabsTrigger>
          <TabsTrigger value="all-assignments" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Todas Atribuições ({filteredAssignments.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Evaluations */}
        <TabsContent value="pending" className="space-y-4">
          {filteredAssignments.filter(a => a.status === 'atribuido').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma avaliação pendente</h3>
                <p className="text-muted-foreground text-center">
                  Você está em dia com todas as suas avaliações!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments
              .filter(assignment => assignment.status === 'atribuido')
              .map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assignment.projects.titulo}</CardTitle>
                        <CardDescription>
                          Categoria {assignment.projects.categoria} • Etapa {assignment.etapa}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Pendente
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {assignment.projects.resumo && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {assignment.projects.resumo}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {assignment.data_avaliacao && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(assignment.data_avaliacao).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                        {assignment.horario_avaliacao && (
                          <span>às {assignment.horario_avaliacao}</span>
                        )}
                        <span>Atribuído em {new Date(assignment.assigned_at).toLocaleDateString('pt-BR')}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild>
                          <Link to={`/evaluation/evaluate/${assignment.project_id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Avaliar Projeto
                          </Link>
                        </Button>
                        
                        <Button asChild variant="outline">
                          <Link to={`/projects/${assignment.project_id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Link>
                        </Button>

                        {assignment.sala_meet_url && (
                          <Button asChild variant="outline">
                            <a href={assignment.sala_meet_url} target="_blank" rel="noopener noreferrer">
                              Sala Virtual
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Completed Evaluations */}
        <TabsContent value="completed" className="space-y-4">
          {filteredEvaluations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma avaliação concluída</h3>
                <p className="text-muted-foreground text-center">
                  Suas avaliações concluídas aparecerão aqui.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEvaluations.map((evaluation) => (
              <Card key={evaluation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{evaluation.projects.titulo}</CardTitle>
                      <CardDescription>
                        Categoria {evaluation.projects.categoria} • Etapa {evaluation.etapa}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Concluída
                      </Badge>
                      <Badge variant="secondary">
                        Nota: {evaluation.nota_final.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {evaluation.comentarios_publicos && (
                      <div>
                        <p className="text-sm font-medium mb-1">Comentários Públicos:</p>
                        <p className="text-sm text-muted-foreground">
                          {evaluation.comentarios_publicos}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Avaliado em {new Date(evaluation.avaliado_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="outline">
                        <Link to={`/evaluation/evaluate/${evaluation.project_id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Avaliação
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline">
                        <Link to={`/projects/${evaluation.project_id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Projeto
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* All Assignments */}
        <TabsContent value="all-assignments" className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma atribuição encontrada</h3>
                <p className="text-muted-foreground text-center">
                  Suas atribuições de avaliação aparecerão aqui.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => {
              const isCompleted = evaluations.some(e => e.project_id === assignment.project_id);
              const evaluation = evaluations.find(e => e.project_id === assignment.project_id);
              
              return (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assignment.projects.titulo}</CardTitle>
                        <CardDescription>
                          Categoria {assignment.projects.categoria} • Etapa {assignment.etapa}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isCompleted ? "default" : "outline"} 
                               className={isCompleted ? "text-green-600 border-green-600" : "text-orange-600 border-orange-600"}>
                          {isCompleted ? 'Concluída' : 'Pendente'}
                        </Badge>
                        {evaluation && (
                          <Badge variant="secondary">
                            Nota: {evaluation.nota_final.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {assignment.data_avaliacao && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(assignment.data_avaliacao).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                        {assignment.horario_avaliacao && (
                          <span>às {assignment.horario_avaliacao}</span>
                        )}
                        <span>Atribuído em {new Date(assignment.assigned_at).toLocaleDateString('pt-BR')}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild variant={isCompleted ? "outline" : "default"}>
                          <Link to={`/evaluation/evaluate/${assignment.project_id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            {isCompleted ? 'Editar Avaliação' : 'Avaliar Projeto'}
                          </Link>
                        </Button>
                        
                        <Button asChild variant="outline">
                          <Link to={`/projects/${assignment.project_id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Projeto
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyEvaluations;