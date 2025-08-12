import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import type { Project } from '@/hooks/useProjects';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const ProjectCard = ({ project, onDelete, showActions = true }: ProjectCardProps) => {
  const canEdit = project.status === 'rascunho' || project.status === 'submetido';
  const teamSize = (project.project_members?.length || 0) + (project.project_orientadores?.length || 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">
            {project.categoria}{project.id.slice(0, 8).toUpperCase()}{project.areas_conhecimento?.codigo_cnpq || 'XX'} - {project.titulo}
          </CardTitle>
          <ProjectStatusBadge status={project.status} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Categoria {project.categoria}</Badge>
          {project.is_credenciado && (
            <Badge variant="secondary">Credenciado</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Área do Conhecimento</p>
            <p className="text-sm font-medium">
              {project.areas_conhecimento?.nome || 'Não informado'}
            </p>
          </div>

          {project.resumo && (
            <div>
              <p className="text-sm text-muted-foreground">Resumo</p>
              <p className="text-sm line-clamp-3">{project.resumo}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{teamSize} membros</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/projects/${project.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Link>
          </Button>
          
          {canEdit && (
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to={`/projects/${project.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
          )}

          {onDelete && project.status === 'rascunho' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(project.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};