import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Users, Building, BookOpen, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectCategoria } from '@/types/database';
import { UserSearchSelect } from '@/components/UserSearchSelect';
import { User } from '@/hooks/useUsers';
import { getCategoryLimits } from '@/utils/categoryLimits';

interface ProjectSubmissionForm {
  title: string;
  category: ProjectCategoria;
  subcategory?: string;
  area_conhecimento_id: string;
  resumo: string;
  palavras_chave: string;
  institutionName: string;
  institutionState: string;
  institutionCity: string;
  isPublicInstitution: boolean;
  isFullTimeInstitution: boolean;
  members: User[];
  advisor: User | null;
  coAdvisor?: User | null;
  specialRequirements: string[];
}

const categories = [
  { value: "I", label: "Categoria I - Educação infantil (pré-escolar)" },
  { value: "II", label: "Categoria II - Estudantes do Ensino Fundamental (1º ao 3º ano)", hasSubcategory: true },
  { value: "III", label: "Categoria III - Estudantes do Ensino Fundamental (4º ao 6º ano)" },
  { value: "IV", label: "Categoria IV - Estudantes do Ensino Fundamental (7º ao 9º ano)" },
  { value: "V", label: "Categoria V - Ensino médio e/ou técnico profissionalizante concomitante" },
  { value: "VI", label: "Categoria VI - Cursos técnicos pós médio" },
  { value: "VII", label: "Categoria VII - Educação de Jovens e adultos" },
  { value: "VIII", label: "Categoria VIII - Ensino superior" },
  { value: "IX", label: "Categoria IX - Pós Graduações" }
];

const subcategories = [
  { value: "II_a", label: "Categoria II-a - Estudantes do Ensino Fundamental (1º ao 3º ano)" },
  { value: "II_b", label: "Categoria II-b - Estudantes do Ensino Fundamental (4º ao 6º ano)" }
];

const specialRequirements = [
  'Pesquisas que envolvam seres humanos',
  'Pesquisas que envolvam animais vertebrados ou invertebrados',
  'Pesquisas que envolvam tecidos humanos ou animais',
  'Pesquisas que envolvam equipamentos de alta periculosidade',
  'Pesquisas que envolvam substâncias tóxicas ou controladas',
  'Pesquisas que envolvam agentes biológicos potencialmente perigosos'
];

export default function ProjectSubmission() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const { toast } = useToast();
  
  const form = useForm<ProjectSubmissionForm>();

  // Fetch knowledge areas from database
  const { data: knowledgeAreas, isLoading: areasLoading } = useQuery({
    queryKey: ['knowledge-areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('areas_conhecimento')
        .select('*')
        .eq('nivel', 'area')
        .eq('is_active', true)
        .order('nome');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch subareas when an area is selected
  const { data: subAreas, isLoading: subAreasLoading } = useQuery({
    queryKey: ['sub-areas', selectedArea],
    queryFn: async () => {
      if (!selectedArea) return [];
      
      const { data, error } = await supabase
        .from('areas_conhecimento')
        .select('*')
        .eq('nivel', 'subarea')
        .eq('parent_id', selectedArea)
        .eq('is_active', true)
        .order('nome');
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedArea
  });

  const onSubmit = async (data: ProjectSubmissionForm) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      // Validate team composition based on category
      const categoryLimits = getCategoryLimits(data.category);
      
      if (categoryLimits.requiresAdvisor && !data.advisor) {
        toast({
          title: "Erro",
          description: "É obrigatório ter um orientador para esta categoria",
          variant: "destructive"
        });
        return;
      }

      if (data.members.length > categoryLimits.maxMembers) {
        toast({
          title: "Erro",
          description: `Esta categoria permite no máximo ${categoryLimits.maxMembers} integrantes`,
          variant: "destructive"
        });
        return;
      }

      if (data.members.length === 0) {
        toast({
          title: "Erro",
          description: "É necessário ter pelo menos um membro na equipe",
          variant: "destructive"
        });
        return;
      }

      const projectData = {
        titulo: data.title,
        categoria: data.category,
        subcategoria: data.subcategory as 'II_a' | 'II_b' | null,
        area_conhecimento_id: data.area_conhecimento_id,
        resumo: data.resumo,
        palavras_chave: data.palavras_chave,
        status: 'rascunho' as const,
        created_by: user.user.id
      };

      const { data: project, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;

      // Insert project members
      if (data.members.length > 0) {
        const membersData = data.members.map(member => ({
          project_id: project.id,
          user_id: member.id,
          role: 'autor' as const
        }));

        const { error: membersError } = await supabase
          .from('project_members')
          .insert(membersData);

        if (membersError) throw membersError;
      }

      // Insert advisor
      if (data.advisor) {
        const { error: advisorError } = await supabase
          .from('project_orientadores')
          .insert({
            project_id: project.id,
            user_id: data.advisor.id,
            tipo: 'orientador' as const
          });

        if (advisorError) throw advisorError;
      }

      // Insert co-advisor if exists
      if (data.coAdvisor) {
        const { error: coAdvisorError } = await supabase
          .from('project_orientadores')
          .insert({
            project_id: project.id,
            user_id: data.coAdvisor.id,
            tipo: 'coorientador' as const
          });

        if (coAdvisorError) throw coAdvisorError;
      }

      toast({
        title: "Sucesso!",
        description: "Projeto submetido com sucesso"
      });

      // Reset form
      form.reset();
      setCurrentStep(1);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Informações Básicas', icon: FileText },
    { number: 2, title: 'Instituição', icon: Building },
    { number: 3, title: 'Equipe', icon: Users },
    { number: 4, title: 'Plano de Pesquisa', icon: BookOpen }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Submissão de Projeto</h1>
          <p className="text-muted-foreground">
            Submeta seu projeto para participar da FEBIC - Feira Brasileira de Iniciação Científica
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-primary bg-primary text-primary-foreground' :
                    isCompleted ? 'border-primary bg-primary text-primary-foreground' :
                    'border-muted-foreground bg-background text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informações Básicas do Projeto
                  </CardTitle>
                  <CardDescription>
                    Defina as informações principais do seu projeto de pesquisa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Projeto</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o título do seu projeto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subcategory for Category II */}
                  {selectedCategory === 'II' && (
                    <FormField
                      control={form.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategoria</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma subcategoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.value} value={subcategory.value}>
                                  {subcategory.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="area_conhecimento_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área do Conhecimento CNPQ</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            setSelectedArea(value);
                            field.onChange(value);
                          }} 
                          defaultValue={field.value}
                          disabled={areasLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a área do conhecimento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {knowledgeAreas?.map((area) => (
                              <SelectItem key={area.id} value={area.id}>
                                {area.codigo_cnpq ? `${area.codigo_cnpq} - ` : ''}{area.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subareas when area is selected */}
                  {selectedArea && subAreas && subAreas.length > 0 && (
                    <FormField
                      control={form.control}
                      name="area_conhecimento_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subárea do Conhecimento</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={subAreasLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a subárea (opcional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subAreas.map((subarea) => (
                                <SelectItem key={subarea.id} value={subarea.id}>
                                  {subarea.codigo_cnpq ? `${subarea.codigo_cnpq} - ` : ''}{subarea.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Você pode escolher uma subárea mais específica ou manter a área principal
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Importante</h4>
                        <p className="text-sm text-muted-foreground">
                          A submissão inicial dos projetos é gratuita. Apenas projetos selecionados pelo CIAS participarão da Etapa Virtual.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Institution */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Informações da Instituição
                  </CardTitle>
                  <CardDescription>
                    Dados da instituição de ensino vinculada ao projeto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="institutionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Instituição</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome da instituição" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="institutionState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="UF" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institutionCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite a cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="isPublicInstitution"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Instituição Pública</FormLabel>
                            <FormDescription>
                              Marque se a instituição é pública (municipal, estadual ou federal)
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFullTimeInstitution"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ensino Integral</FormLabel>
                            <FormDescription>
                              Marque se a instituição oferece ensino em período integral
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Cotas de Seleção</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 55% das vagas para projetos de escolas públicas</li>
                      <li>• Até 15% das vagas para projetos de Santa Catarina</li>
                      <li>• Até 10% das vagas para escolas públicas de período integral</li>
                      <li>• Até 10% das vagas para grupos de diversidade</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Team */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Equipe do Projeto
                  </CardTitle>
                  <CardDescription>
                    Selecione os participantes do projeto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Limits Info */}
                  {selectedCategory && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm">Limites da Categoria</h4>
                          <p className="text-sm text-muted-foreground">
                            {getCategoryLimits(selectedCategory as ProjectCategoria).description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team Members */}
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Integrantes da Equipe
                          {selectedCategory && (
                            <span className="text-muted-foreground text-sm ml-2">
                              (máx. {getCategoryLimits(selectedCategory as ProjectCategoria).maxMembers})
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <UserSearchSelect
                            selectedUsers={field.value || []}
                            onUsersChange={field.onChange}
                            maxUsers={selectedCategory ? getCategoryLimits(selectedCategory as ProjectCategoria).maxMembers : undefined}
                            placeholder="Buscar integrantes..."
                            label=""
                          />
                        </FormControl>
                        <FormDescription>
                          Busque e selecione os integrantes da equipe pelo nome, email ou CPF
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Advisor */}
                  <FormField
                    control={form.control}
                    name="advisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Orientador
                          {selectedCategory && getCategoryLimits(selectedCategory as ProjectCategoria).requiresAdvisor && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <UserSearchSelect
                            selectedUsers={field.value ? [field.value] : []}
                            onUsersChange={(users) => field.onChange(users[0] || null)}
                            maxUsers={1}
                            placeholder="Buscar orientador..."
                            label=""
                          />
                        </FormControl>
                        <FormDescription>
                          Profissional da Educação responsável pela orientação do projeto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Co-Advisor */}
                  {selectedCategory && getCategoryLimits(selectedCategory as ProjectCategoria).allowsCoAdvisor && (
                    <FormField
                      control={form.control}
                      name="coAdvisor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coorientador (Opcional)</FormLabel>
                          <FormControl>
                            <UserSearchSelect
                              selectedUsers={field.value ? [field.value] : []}
                              onUsersChange={(users) => field.onChange(users[0] || null)}
                              maxUsers={1}
                              placeholder="Buscar coorientador..."
                              label=""
                            />
                          </FormControl>
                          <FormDescription>
                            Profissional que auxiliará na orientação do projeto (opcional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 4: Research Plan */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Plano de Pesquisa
                  </CardTitle>
                  <CardDescription>
                    Descreva sua pesquisa detalhadamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="resumo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumo</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Resumo do projeto (1000-2500 caracteres)"
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Entre 1000 e 2500 caracteres incluindo espaços
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="palavras_chave"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Palavras-chave</FormLabel>
                        <FormControl>
                          <Input placeholder="Três palavras-chave separadas por vírgula" {...field} />
                        </FormControl>
                        <FormDescription>
                          Três palavras ou termos chaves separados por vírgula
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <h4 className="font-medium mb-3">Requisitos Especiais</h4>
                    <div className="space-y-2">
                      {specialRequirements.map((requirement) => (
                        <FormField
                          key={requirement}
                          control={form.control}
                          name="specialRequirements"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(requirement)}
                                  onCheckedChange={(checked) => {
                                    const value = field.value || [];
                                    if (checked) {
                                      field.onChange([...value, requirement]);
                                    } else {
                                      field.onChange(value.filter((item) => item !== requirement));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {requirement}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit">
                    Submeter Projeto
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}