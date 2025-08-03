import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useProjects } from '@/hooks/useProjects';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectList = () => {
  const { projects, loading, deleteProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.resumo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.palavras_chave?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.categoria === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este projeto?')) {
      await deleteProject(id);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Projetos</h1>
          <p className="text-muted-foreground">Gerencie seus projetos FEBIC</p>
        </div>
        <Button asChild>
          <Link to="/projects/submission">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtre seus projetos por título, status ou categoria
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
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="submetido">Submetido</SelectItem>
                <SelectItem value="selecionado">Selecionado</SelectItem>
                <SelectItem value="finalista">Finalista</SelectItem>
                <SelectItem value="premiado">Premiado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="I">Categoria I</SelectItem>
                <SelectItem value="II">Categoria II</SelectItem>
                <SelectItem value="III">Categoria III</SelectItem>
                <SelectItem value="IV">Categoria IV</SelectItem>
                <SelectItem value="V">Categoria V</SelectItem>
                <SelectItem value="VI">Categoria VI</SelectItem>
                <SelectItem value="VII">Categoria VII</SelectItem>
                <SelectItem value="VIII">Categoria VIII</SelectItem>
                <SelectItem value="RELATO">Relato de Experiência</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {projects.length === 0 
                  ? 'Você ainda não criou nenhum projeto.'
                  : 'Nenhum projeto corresponde aos filtros aplicados.'
                }
              </p>
              {projects.length === 0 && (
                <Button asChild>
                  <Link to="/projects/submission">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Projeto
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;