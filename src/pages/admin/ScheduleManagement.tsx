import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/hooks/useAdmin';
import { Calendar, Plus, Edit, Save, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const scheduleSchema = z.object({
  fase: z.string().min(1, 'Nome da fase é obrigatório'),
  descricao: z.string().optional(),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().min(1, 'Data de fim é obrigatória'),
  is_active: z.boolean(),
}).refine((data) => {
  const inicio = new Date(data.data_inicio);
  const fim = new Date(data.data_fim);
  return fim >= inicio;
}, {
  message: "Data de fim deve ser igual ou posterior à data de início",
  path: ["data_fim"],
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

const ScheduleManagement = () => {
  const { schedule, loading, updateSchedulePhase, createSchedulePhase } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      fase: '',
      descricao: '',
      data_inicio: '',
      data_fim: '',
      is_active: true,
    },
  });

  const onSubmit = async (data: ScheduleFormData) => {
    setSubmitting(true);
    
    let success = false;
    
    if (editingId) {
      success = await updateSchedulePhase(editingId, data);
    } else {
      success = await createSchedulePhase(data as any);
    }
    
    if (success) {
      form.reset();
      setEditingId(null);
      setShowAddForm(false);
    }
    
    setSubmitting(false);
  };

  const handleEdit = (phase: any) => {
    form.reset({
      fase: phase.fase,
      descricao: phase.descricao || '',
      data_inicio: phase.data_inicio,
      data_fim: phase.data_fim,
      is_active: phase.is_active,
    });
    setEditingId(phase.id);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    form.reset();
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    form.reset({
      fase: '',
      descricao: '',
      data_inicio: '',
      data_fim: '',
      is_active: true,
    });
    setEditingId(null);
    setShowAddForm(true);
  };

  const getPhaseStatus = (phase: any) => {
    const now = new Date();
    const start = new Date(phase.data_inicio);
    const end = new Date(phase.data_fim);
    
    if (!phase.is_active) return 'inactive';
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Em Andamento</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Próxima</Badge>;
      case 'completed':
        return <Badge variant="outline">Concluída</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inativa</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cronograma FEBIC</h1>
          <p className="text-muted-foreground">
            Gerencie as fases e datas importantes da feira
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fase
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className={`lg:col-span-1 ${(editingId || showAddForm) ? 'block' : 'hidden lg:block'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? 'Editar Fase' : 'Nova Fase'}
            </CardTitle>
            <CardDescription>
              {editingId 
                ? 'Edite as informações da fase selecionada'
                : 'Adicione uma nova fase ao cronograma'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Fase *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Submissão de Projetos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva os objetivos e atividades desta fase..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_fim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Fim *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Fase Ativa</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Apenas fases ativas são exibidas publicamente
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-pulse" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingId ? 'Atualizar' : 'Criar'}
                      </>
                    )}
                  </Button>
                  
                  {(editingId || showAddForm) && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Schedule List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fases do Cronograma
            </CardTitle>
            <CardDescription>
              Lista de todas as fases configuradas para a FEBIC
            </CardDescription>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma fase cadastrada</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Comece criando a primeira fase do cronograma da FEBIC.
                </p>
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Fase
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {schedule.map((phase) => {
                  const status = getPhaseStatus(phase);
                  return (
                    <div 
                      key={phase.id} 
                      className={`p-4 border rounded-lg transition-all ${
                        editingId === phase.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{phase.fase}</h3>
                            {getStatusBadge(status)}
                          </div>
                          
                          {phase.descricao && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {phase.descricao}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(phase.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
                              </span>
                            </div>
                            <span>até</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(phase.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {Math.ceil((new Date(phase.data_fim).getTime() - new Date(phase.data_inicio).getTime()) / (1000 * 60 * 60 * 24))} dias
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(phase)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline View */}
      {schedule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Timeline do Cronograma</CardTitle>
            <CardDescription>
              Visualização cronológica das fases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-6">
                {schedule
                  .sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime())
                  .map((phase, index) => {
                    const status = getPhaseStatus(phase);
                    return (
                      <div key={phase.id} className="relative flex items-start gap-4">
                        {/* Timeline dot */}
                        <div className={`relative z-10 w-3 h-3 rounded-full border-2 ${
                          status === 'active' ? 'bg-green-500 border-green-500' :
                          status === 'completed' ? 'bg-gray-400 border-gray-400' :
                          status === 'upcoming' ? 'bg-blue-500 border-blue-500' :
                          'bg-red-500 border-red-500'
                        }`}></div>
                        
                        <div className="flex-1 min-w-0 pb-6">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium">{phase.fase}</h4>
                            {getStatusBadge(status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {format(new Date(phase.data_inicio), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(phase.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                          {phase.descricao && (
                            <p className="text-sm text-muted-foreground">
                              {phase.descricao}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScheduleManagement;