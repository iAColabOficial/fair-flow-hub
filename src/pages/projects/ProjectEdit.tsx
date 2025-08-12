import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/hooks/useProjects';
import { toast } from '@/hooks/use-toast';

const projectSchema = z.object({
  titulo: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  resumo: z.string().optional(),
  palavras_chave: z.string().optional(),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const ProjectEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { getProject, updateProject } = useProjects();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      titulo: '',
      resumo: '',
      palavras_chave: '',
      categoria: '',
    },
  });

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    const project = await getProject(projectId);
    
    if (project) {
      form.reset({
        titulo: project.titulo,
        resumo: project.resumo || '',
        palavras_chave: project.palavras_chave || '',
        categoria: project.categoria,
      });
    } else {
      navigate('/projects');
    }
    
    setLoading(false);
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!id) return;
    
    setSubmitting(true);
    
    const success = await updateProject(id, data);
    
    if (success) {
      navigate(`/projects/${id}`);
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
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
          <Link to={`/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar Projeto</h1>
          <p className="text-muted-foreground">Atualize as informações do seu projeto</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para atualizar seu projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Título */}
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Projeto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do projeto" {...field} />
                    </FormControl>
                    <FormDescription>
                      O título deve ser claro e descritivo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="I">Categoria I - Educação Infantil</SelectItem>
                          <SelectItem value="II">Categoria II - Ensino Fundamental (1º ao 6º ano)</SelectItem>
                          <SelectItem value="III">Categoria III - Ensino Fundamental (7º ao 9º ano)</SelectItem>
                          <SelectItem value="IV">Categoria IV - Ensino Técnico Subsequente</SelectItem>
                          <SelectItem value="V">Categoria V - Educação de Jovens e Adultos</SelectItem>
                          <SelectItem value="VI">Categoria VI - Ensino Médio</SelectItem>
                          <SelectItem value="VII">Categoria VII - Ensino Superior</SelectItem>
                          <SelectItem value="VIII">Categoria VIII - Pós-graduação</SelectItem>
                          <SelectItem value="RELATO">Relato de Experiência Científico-Pedagógica</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              {/* Resumo */}
              <FormField
                control={form.control}
                name="resumo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o objetivo, metodologia e principais resultados do projeto"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Entre 1000 e 2500 caracteres, incluindo espaços
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Palavras-chave */}
              <FormField
                control={form.control}
                name="palavras_chave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palavras-chave</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Separe as palavras-chave por vírgula"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo de 3 palavras-chave separadas por vírgula
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                
                <Button asChild type="button" variant="outline">
                  <Link to={`/projects/${id}`}>Cancelar</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectEdit;