import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProjectCategory, KnowledgeArea, InstitutionType } from '@/types/project';
import { Upload, FileText, Users, Building, BookOpen, Award, AlertCircle } from 'lucide-react';

interface ProjectSubmissionForm {
  title: string;
  category: ProjectCategory;
  area: KnowledgeArea;
  institutionName: string;
  institutionType: InstitutionType;
  institutionState: string;
  institutionCity: string;
  isPublicInstitution: boolean;
  isFullTimeInstitution: boolean;
  researchSummary: string;
  keywords: string;
  objectives: string;
  methodology: string;
  expectedResults: string;
  references: string;
  authors: string;
  advisor: string;
  coAdvisor?: string;
  specialRequirements: string[];
}

const categoryLabels = {
  [ProjectCategory.CATEGORY_I]: 'Categoria I - Educação Infantil (Pré I e Pré II)',
  [ProjectCategory.CATEGORY_II_A]: 'Categoria II-A - Ensino Fundamental (1º ao 3º ano)',
  [ProjectCategory.CATEGORY_II_B]: 'Categoria II-B - Ensino Fundamental (4º ao 6º ano)',
  [ProjectCategory.CATEGORY_III]: 'Categoria III - Ensino Fundamental (7º ao 9º ano)',
  [ProjectCategory.CATEGORY_IV]: 'Categoria IV - Ensino Técnico Subsequente',
  [ProjectCategory.CATEGORY_V]: 'Categoria V - Educação de Jovens e Adultos',
  [ProjectCategory.CATEGORY_VI]: 'Categoria VI - Ensino Médio e/ou Profissionalizante',
  [ProjectCategory.CATEGORY_VII]: 'Categoria VII - Ensino Superior',
  [ProjectCategory.CATEGORY_VIII]: 'Categoria VIII - Pós-graduação',
  [ProjectCategory.EXPERIENCE_REPORT]: 'Relato de Experiência Científico-Pedagógica'
};

const areaLabels = {
  [KnowledgeArea.BIOLOGICAL_SCIENCES]: 'Ciências Biológicas',
  [KnowledgeArea.HEALTH_SCIENCES]: 'Ciências da Saúde',
  [KnowledgeArea.AGRICULTURAL_SCIENCES]: 'Ciências Agrárias',
  [KnowledgeArea.EXACT_EARTH_SCIENCES]: 'Ciências Exatas e da Terra',
  [KnowledgeArea.ENGINEERING]: 'Engenharias',
  [KnowledgeArea.HUMAN_SCIENCES]: 'Ciências Humanas',
  [KnowledgeArea.SOCIAL_SCIENCES]: 'Ciências Sociais',
  [KnowledgeArea.APPLIED_SOCIAL_SCIENCES]: 'Ciências Sociais Aplicadas'
};

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
  const form = useForm<ProjectSubmissionForm>();

  const onSubmit = (data: ProjectSubmissionForm) => {
    console.log('Submitting project:', data);
    // Implementar submissão do projeto
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Informações Básicas', icon: FileText },
    { number: 2, title: 'Instituição', icon: Building },
    { number: 3, title: 'Equipe', icon: Users },
    { number: 4, title: 'Plano de Pesquisa', icon: BookOpen },
    { number: 5, title: 'Documentos', icon: Upload }
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(categoryLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área do Conhecimento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a área do conhecimento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(areaLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={form.control}
                    name="institutionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Instituição</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={InstitutionType.MUNICIPAL_PUBLIC}>Pública Municipal</SelectItem>
                            <SelectItem value={InstitutionType.STATE_PUBLIC}>Pública Estadual</SelectItem>
                            <SelectItem value={InstitutionType.FEDERAL_PUBLIC}>Pública Federal</SelectItem>
                            <SelectItem value={InstitutionType.PRIVATE}>Privada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < 5 ? (
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