import { ProjectCategoria } from '@/types/database';

export interface CategoryLimits {
  maxMembers: number;
  requiresAdvisor: boolean;
  allowsCoAdvisor: boolean;
  description: string;
}

export const CATEGORY_LIMITS: Record<ProjectCategoria, CategoryLimits> = {
  'I': {
    maxMembers: 6,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Educação Infantil (Pré I e Pré II) - até 6 integrantes'
  },
  'II': {
    maxMembers: 5,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Ensino Fundamental (1º ao 6º ano) - até 5 integrantes'
  },
  'III': {
    maxMembers: 3,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Ensino Fundamental (7º ao 9º ano) - máximo 3 estudantes autores'
  },
  'IV': {
    maxMembers: 3,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Ensino Técnico Subsequente - máximo 3 estudantes autores'
  },
  'V': {
    maxMembers: 3,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Educação de Jovens e Adultos - máximo 3 estudantes autores'
  },
  'VI': {
    maxMembers: 3,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Ensino Médio/Profissionalizante - máximo 3 estudantes autores'
  },
  'VII': {
    maxMembers: 3,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Ensino Superior - máximo 3 estudantes autores'
  },
  'VIII': {
    maxMembers: 3,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Pós-graduação - máximo 3 integrantes'
  },
  'IX': {
    maxMembers: 3,
    requiresAdvisor: true,
    allowsCoAdvisor: true,
    description: 'Categoria IX - máximo 3 integrantes'
  },
  'RELATO': {
    maxMembers: 1,
    requiresAdvisor: false,
    allowsCoAdvisor: false,
    description: 'Relato de Experiência Científico-Pedagógica - professores e discentes'
  }
};

export function getCategoryLimits(category: ProjectCategoria): CategoryLimits {
  return CATEGORY_LIMITS[category];
}