import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { EvaluationForm } from '@/components/evaluation/EvaluationForm';
import { useProjects } from '@/hooks/useProjects';
import { useEvaluation } from '@/hooks/useEvaluation';
import { ProjectStatusBadge } from '@/components/projects/ProjectStatusBadge';

const EvaluateProject = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [existingEvaluation, setExistingEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { getProject } = useProjects();
  const { assignments, evaluations, submitEvaluation, updateEvaluation } = useEvaluation();

  useEffect(() => {
    if (id) {
      loadProjectData(id);
    }
  }, [id, assignments, evaluations]);

  const loadProjectData = async (projectId: string) => {
    setLoading(true);
    
    // Carregar dados do projeto
    const projectData = await getProject(projectId);
    setProject(projectData);

    // Encontrar atribuição
    const assignmentData = assignments.find(a => a.project_id === projectId);
    setAssignment(assignmentData);

    // Verificar se já existe avaliação
    const evaluationData = evaluations.find(e => e.project_id === projectId);
    setExistingEvaluation(evaluationData);

    setLoading(false);
  };

  const handleSubmitEvaluation = async (evaluationData: any) => {
    if (existingEvaluation) {
      return await updateEvaluation(existingEvaluation.id, evaluationData);
    } else {
      return await submitEvaluation(evaluationData);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!project || !assignment) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              O projeto solicitado não foi encontrado ou você não tem permissão para avaliá-lo.
            </p>
            <Button asChild>
              <Link to="/evaluation">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Painel
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link to="/evaluation">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {existingEvaluation ? 'Editar Avaliação' : 'Avaliar Projeto'}
          </h1>
          <p className="text-muted-foreground">
            {project.titulo}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Evaluation Form */}
        <div className="lg:col-span-2">
          <EvaluationForm
            projectId={project.id}
            projectTitle={project.titulo}
            categoria={project.categoria}
            etapa={assignment.etapa}
            onSubmit={handleSubmitEvaluation}
            initialData={existingEvaluation}
          />
        </div>

        {/* Project Info Sidebar */}
        <div className="space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Título</p>
                <p className="text-sm text-muted-foreground">
                  {project.titulo}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Status</p>
                <ProjectStatusBadge status={project.status} />
              </div>

              <div>
                <p className="text-sm font-medium">Categoria</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline">
                    {project.categoria}
                  </Badge>
                  {project.subcategoria && (
                    <Badge variant="outline">
                      {project.subcategoria}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Área do Conhecimento</p>
                <p className="text-sm text-muted-foreground">
                  {project.areas_conhecimento?.nome || 'Não informado'}
                </p>
              </div>

              {project.is_credenciado && (
                <div>
                  <Badge variant="secondary">Projeto Credenciado</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações da Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Etapa</p>
                <Badge variant="outline">{assignment.etapa}</Badge>
              </div>

              <div>
                <p className="text-sm font-medium">Status da Atribuição</p>
                <Badge variant={assignment.status === 'atribuido' ? 'default' : 'secondary'}>
                  {assignment.status === 'atribuido' ? 'Pendente' : assignment.status}
                </Badge>
              </div>

              {assignment.data_avaliacao && (
                <div>
                  <p className="text-sm font-medium">Data da Avaliação</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(assignment.data_avaliacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}

              {assignment.horario_avaliacao && (
                <div>
                  <p className="text-sm font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.horario_avaliacao}
                  </p>
                </div>
              )}

              {assignment.sala_meet_url && (
                <div>
                  <p className="text-sm font-medium">Sala Virtual</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href={assignment.sala_meet_url} target="_blank" rel="noopener noreferrer">
                      Acessar Sala
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Summary */}
          {project.resumo && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {project.resumo}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          {project.palavras_chave && (
            <Card>
              <CardHeader>
                <CardTitle>Palavras-chave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.palavras_chave.split(',').map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team */}
          {((project.project_members && project.project_members.length > 0) ||
            (project.project_orientadores && project.project_orientadores.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Equipe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.project_orientadores && project.project_orientadores.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Orientadores</p>
                    {project.project_orientadores.map((orientador: any, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {orientador.users.nome} ({orientador.tipo})
                      </div>
                    ))}
                  </div>
                )}

                {project.project_members && project.project_members.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Membros</p>
                    {project.project_members.map((member: any, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {member.users.nome} ({member.role})
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluateProject;