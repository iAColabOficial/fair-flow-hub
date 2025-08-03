import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Users, Calendar, FileText, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectStatusBadge } from '@/components/projects/ProjectStatusBadge';
import { useProjects } from '@/hooks/useProjects';
import type { Project } from '@/hooks/useProjects';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { getProject } = useProjects();

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    const data = await getProject(projectId);
    setProject(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              O projeto solicitado não foi encontrado ou você não tem permissão para visualizá-lo.
            </p>
            <Button asChild>
              <Link to="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Projetos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = project.status === 'rascunho' || project.status === 'submetido';

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.titulo}</h1>
            <p className="text-muted-foreground">Detalhes do projeto</p>
          </div>
        </div>
        
        {canEdit && (
          <Button asChild>
            <Link to={`/projects/${project.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Projeto
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{project.titulo}</CardTitle>
                  <CardDescription>
                    Categoria {project.categoria}
                    {project.subcategoria && ` - ${project.subcategoria}`}
                  </CardDescription>
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {project.areas_conhecimento?.nome || 'Área não informada'}
                </Badge>
                {project.is_credenciado && (
                  <Badge variant="secondary">Projeto Credenciado</Badge>
                )}
                {project.token_feira && (
                  <Badge variant="outline">Token: {project.token_feira}</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {project.resumo && (
                <div>
                  <h3 className="font-semibold mb-2">Resumo</h3>
                  <p className="text-sm leading-relaxed">{project.resumo}</p>
                </div>
              )}

              {project.palavras_chave && (
                <div>
                  <h3 className="font-semibold mb-2">Palavras-chave</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.palavras_chave.split(',').map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Atualizado em {new Date(project.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipe do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Orientadores */}
                {project.project_orientadores && project.project_orientadores.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Orientadores</h4>
                    <div className="space-y-2">
                      {project.project_orientadores.map((orientador, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{orientador.users.nome}</p>
                            <p className="text-sm text-muted-foreground">{orientador.users.email}</p>
                          </div>
                          <Badge variant="outline">
                            {orientador.tipo === 'orientador' ? 'Orientador' : 'Coorientador'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Membros */}
                {project.project_members && project.project_members.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Membros</h4>
                    <div className="space-y-2">
                      {project.project_members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{member.users.nome}</p>
                            <p className="text-sm text-muted-foreground">{member.users.email}</p>
                          </div>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!project.project_orientadores || project.project_orientadores.length === 0) &&
                 (!project.project_members || project.project_members.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum membro da equipe cadastrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canEdit && (
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/projects/${project.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Projeto
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload de Documentos
              </Button>
              
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          {/* Project Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(project as any).project_documents && (project as any).project_documents.length > 0 ? (
                <div className="space-y-2">
                  {(project as any).project_documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.file_name}</p>
                        <p className="text-xs text-muted-foreground">{doc.document_type}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Nenhum documento enviado
                </p>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Status</p>
                <ProjectStatusBadge status={project.status} />
              </div>
              
              <div>
                <p className="text-sm font-medium">Categoria</p>
                <p className="text-sm text-muted-foreground">
                  {project.categoria}
                  {project.subcategoria && ` - ${project.subcategoria}`}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Área do Conhecimento</p>
                <p className="text-sm text-muted-foreground">
                  {project.areas_conhecimento?.nome || 'Não informado'}
                </p>
              </div>
              
              {project.areas_conhecimento?.codigo_cnpq && (
                <div>
                  <p className="text-sm font-medium">Código CNPq</p>
                  <p className="text-sm text-muted-foreground">
                    {project.areas_conhecimento.codigo_cnpq}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;