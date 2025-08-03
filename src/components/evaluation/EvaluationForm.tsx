import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

const evaluationSchema = z.object({
  project_id: z.string(),
  etapa: z.string(),
  nota_metodo_cientifico: z.number().min(0).max(10),
  nota_clareza: z.number().min(0).max(10),
  nota_originalidade: z.number().min(0).max(10),
  nota_referencias: z.number().min(0).max(10),
  nota_objetivo_pedagogico: z.number().min(0).max(10).optional(),
  nota_conhecimento: z.number().min(0).max(10).optional(),
  nota_comunicacao_escrita: z.number().min(0).max(10).optional(),
  nota_comunicacao_oral: z.number().min(0).max(10).optional(),
  nota_comunidade: z.number().min(0).max(10).optional(),
  nota_apresentacao: z.number().min(0).max(10).optional(),
  nota_argumentacao: z.number().min(0).max(10).optional(),
  comentarios: z.string().optional(),
  comentarios_publicos: z.string().optional(),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

interface EvaluationFormProps {
  projectId: string;
  projectTitle: string;
  categoria: string;
  etapa: string;
  onSubmit: (data: any) => Promise<boolean>;
  initialData?: Partial<EvaluationFormData>;
}

export const EvaluationForm = ({ 
  projectId, 
  projectTitle, 
  categoria, 
  etapa, 
  onSubmit,
  initialData 
}: EvaluationFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      project_id: projectId,
      etapa,
      nota_metodo_cientifico: 0,
      nota_clareza: 0,
      nota_originalidade: 0,
      nota_referencias: 0,
      nota_objetivo_pedagogico: 0,
      nota_conhecimento: 0,
      nota_comunicacao_escrita: 0,
      nota_comunicacao_oral: 0,
      nota_comunidade: 0,
      nota_apresentacao: 0,
      nota_argumentacao: 0,
      comentarios: '',
      comentarios_publicos: '',
      ...initialData,
    },
  });

  const handleSubmit = async (data: EvaluationFormData) => {
    setSubmitting(true);
    
    // Calcular nota final baseada na categoria
    let notaFinal = 0;
    
    if (categoria === 'I' || categoria === 'II') {
      // Categorias I e II têm critérios específicos
      notaFinal = (
        (data.nota_metodo_cientifico * 0.30) +
        (data.nota_conhecimento! * 0.38) +
        (data.nota_comunicacao_escrita! * 0.12) +
        (data.nota_comunidade! * 0.12) +
        (data.nota_apresentacao! * 0.08)
      );
    } else {
      // Outras categorias
      notaFinal = (
        (data.nota_metodo_cientifico * 0.35) +
        (data.nota_clareza * 0.25) +
        (data.nota_originalidade * 0.15) +
        (data.nota_referencias * 0.10) +
        (data.nota_argumentacao! * 0.15)
      );
    }

    const evaluationData = {
      ...data,
      nota_final: Math.round(notaFinal * 100) / 100, // Arredondar para 2 casas decimais
    };

    const success = await onSubmit(evaluationData);
    setSubmitting(false);
    
    if (success) {
      form.reset();
    }
  };

  const isBasicCategory = categoria === 'I' || categoria === 'II';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliação do Projeto</CardTitle>
        <p className="text-sm text-muted-foreground">
          Projeto: <span className="font-medium">{projectTitle}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Categoria: <span className="font-medium">{categoria}</span> | 
          Etapa: <span className="font-medium">{etapa}</span>
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Critérios Básicos */}
            <div className="space-y-4">
              <h3 className="font-semibold">Critérios de Avaliação</h3>
              
              <FormField
                control={form.control}
                name="nota_metodo_cientifico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Método Científico ({isBasicCategory ? '30%' : '35%'})
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          max={10}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>0</span>
                          <span className="font-medium">{field.value}</span>
                          <span>10</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isBasicCategory && (
                <>
                  <FormField
                    control={form.control}
                    name="nota_clareza"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clareza na Dissertação (25%)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>0</span>
                              <span className="font-medium">{field.value}</span>
                              <span>10</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nota_originalidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Originalidade e Relevância (15%)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>0</span>
                              <span className="font-medium">{field.value}</span>
                              <span>10</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nota_referencias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adequação das Referências (10%)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>0</span>
                              <span className="font-medium">{field.value}</span>
                              <span>10</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nota_argumentacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidade Argumentativa (15%)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>0</span>
                              <span className="font-medium">{field.value}</span>
                              <span>10</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {isBasicCategory && (
                <>
                  <FormField
                    control={form.control}
                    name="nota_conhecimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conhecimento e Desenvoltura (38%)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value || 0]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>0</span>
                              <span className="font-medium">{field.value || 0}</span>
                              <span>10</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nota_comunicacao_escrita"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comunicação Escrita (12%)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value || 0]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>0</span>
                              <span className="font-medium">{field.value || 0}</span>
                              <span>10</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nota_comunidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impacto na Comunidade (12%)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value || 0]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>0</span>
                              <span className="font-medium">{field.value || 0}</span>
                              <span>10</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nota_apresentacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apresentação (8%)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value || 0]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>0</span>
                              <span className="font-medium">{field.value || 0}</span>
                              <span>10</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <Separator />

            {/* Comentários */}
            <div className="space-y-4">
              <h3 className="font-semibold">Comentários</h3>
              
              <FormField
                control={form.control}
                name="comentarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentários Privados (apenas para organizadores)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações internas sobre a avaliação..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comentarios_publicos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentários Públicos (visíveis para os autores)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Feedback construtivo para os autores do projeto..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando Avaliação...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Avaliação
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};