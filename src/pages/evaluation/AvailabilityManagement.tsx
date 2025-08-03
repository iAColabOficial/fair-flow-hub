import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useEvaluation } from '@/hooks/useEvaluation';
import { Calendar, Clock, Plus, Trash2, Save, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const availabilitySchema = z.object({
  data_disponivel: z.string().min(1, 'Data é obrigatória'),
  horario_inicio: z.string().min(1, 'Horário de início é obrigatório'),
  horario_fim: z.string().min(1, 'Horário de fim é obrigatório'),
}).refine((data) => {
  const inicio = new Date(`2000-01-01 ${data.horario_inicio}`);
  const fim = new Date(`2000-01-01 ${data.horario_fim}`);
  return fim > inicio;
}, {
  message: "Horário de fim deve ser após o horário de início",
  path: ["horario_fim"],
});

type AvailabilityFormData = z.infer<typeof availabilitySchema>;

const AvailabilityManagement = () => {
  const { availability, loading, addAvailability, updateAvailability } = useEvaluation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      data_disponivel: '',
      horario_inicio: '',
      horario_fim: '',
    },
  });

  const onSubmit = async (data: AvailabilityFormData) => {
    setSubmitting(true);
    
    let success = false;
    
    if (editingId) {
      success = await updateAvailability(editingId, {
        ...data,
        is_available: true,
      });
    } else {
      success = await addAvailability({
        ...data,
        is_available: true,
      });
    }
    
    if (success) {
      form.reset();
      setEditingId(null);
    }
    
    setSubmitting(false);
  };

  const handleEdit = (availabilitySlot: any) => {
    form.reset({
      data_disponivel: availabilitySlot.data_disponivel,
      horario_inicio: availabilitySlot.horario_inicio,
      horario_fim: availabilitySlot.horario_fim,
    });
    setEditingId(availabilitySlot.id);
  };

  const handleCancelEdit = () => {
    form.reset();
    setEditingId(null);
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    await updateAvailability(id, { is_available: !currentStatus });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
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

  const upcomingAvailability = availability.filter(slot => 
    new Date(slot.data_disponivel) >= new Date() && slot.is_available
  ).sort((a, b) => new Date(a.data_disponivel).getTime() - new Date(b.data_disponivel).getTime());

  const pastAvailability = availability.filter(slot => 
    new Date(slot.data_disponivel) < new Date()
  ).sort((a, b) => new Date(b.data_disponivel).getTime() - new Date(a.data_disponivel).getTime());

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Gerenciar Disponibilidade</h1>
        <p className="text-muted-foreground">
          Configure seus horários disponíveis para avaliações
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add/Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? 'Editar Disponibilidade' : 'Adicionar Disponibilidade'}
            </CardTitle>
            <CardDescription>
              {editingId 
                ? 'Edite as informações da disponibilidade selecionada'
                : 'Informe uma data e horário em que você estará disponível para avaliar'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="data_disponivel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="horario_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário de Início</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horario_fim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário de Fim</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                        {editingId ? 'Atualizar' : 'Adicionar'}
                      </>
                    )}
                  </Button>
                  
                  {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Upcoming Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Disponibilidades
            </CardTitle>
            <CardDescription>
              Seus horários disponíveis para avaliações futuras
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAvailability.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma disponibilidade cadastrada</h3>
                <p className="text-muted-foreground text-sm">
                  Adicione seus horários disponíveis para receber atribuições de avaliação.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAvailability.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(slot.data_disponivel), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{slot.horario_inicio} - {slot.horario_fim}</span>
                      </div>
                      <Badge variant={slot.is_available ? "default" : "secondary"}>
                        {slot.is_available ? 'Disponível' : 'Indisponível'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(slot)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAvailability(slot.id, slot.is_available)}
                        className={slot.is_available ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {slot.is_available ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Past Availability */}
      {pastAvailability.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Disponibilidades Anteriores
            </CardTitle>
            <CardDescription>
              Histórico de disponibilidades passadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastAvailability.slice(0, 10).map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg opacity-75">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(slot.data_disponivel), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{slot.horario_inicio} - {slot.horario_fim}</span>
                    </div>
                    <Badge variant="outline">
                      Passado
                    </Badge>
                  </div>
                </div>
              ))}
              
              {pastAvailability.length > 10 && (
                <p className="text-center text-sm text-muted-foreground">
                  ... e mais {pastAvailability.length - 10} disponibilidades anteriores
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilityManagement;