export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  area: KnowledgeArea;
  status: ProjectStatus;
  stage: ProjectStage;
  authors: Author[];
  advisor?: Advisor;
  coAdvisor?: Advisor;
  institution: Institution;
  researchPlan: ResearchPlan;
  submissionDate: Date;
  virtualPresentationDate?: Date;
  presentialPresentationDate?: Date;
  score?: {
    submission?: number;
    virtual?: number;
    presential?: number;
    final?: number;
  };
  documents: ProjectDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectCategory {
  CATEGORY_I = 'CATEGORY_I', // Educação Infantil (Pré I e Pré II)
  CATEGORY_II_A = 'CATEGORY_II_A', // Ensino Fundamental – 1º ao 3º ano
  CATEGORY_II_B = 'CATEGORY_II_B', // Ensino Fundamental – 4º ao 6º ano
  CATEGORY_III = 'CATEGORY_III', // Ensino Fundamental – 7º ao 9º ano
  CATEGORY_IV = 'CATEGORY_IV', // Ensino Técnico subsequente
  CATEGORY_V = 'CATEGORY_V', // Educação de Jovens e Adultos
  CATEGORY_VI = 'CATEGORY_VI', // Ensino Médio e/ou Profissionalizante
  CATEGORY_VII = 'CATEGORY_VII', // Ensino Superior
  CATEGORY_VIII = 'CATEGORY_VIII', // Pós-graduação
  EXPERIENCE_REPORT = 'EXPERIENCE_REPORT' // Relato de Experiência Científico-Pedagógica
}

export enum KnowledgeArea {
  BIOLOGICAL_SCIENCES = 'BIOLOGICAL_SCIENCES',
  HEALTH_SCIENCES = 'HEALTH_SCIENCES',
  AGRICULTURAL_SCIENCES = 'AGRICULTURAL_SCIENCES',
  EXACT_EARTH_SCIENCES = 'EXACT_EARTH_SCIENCES',
  ENGINEERING = 'ENGINEERING',
  HUMAN_SCIENCES = 'HUMAN_SCIENCES',
  SOCIAL_SCIENCES = 'SOCIAL_SCIENCES',
  APPLIED_SOCIAL_SCIENCES = 'APPLIED_SOCIAL_SCIENCES'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  SELECTED = 'SELECTED',
  FINALIST = 'FINALIST',
  REJECTED = 'REJECTED',
  WINNER = 'WINNER'
}

export enum ProjectStage {
  SUBMISSION = 'SUBMISSION',
  VIRTUAL_EVALUATION = 'VIRTUAL_EVALUATION',
  PRESENTIAL_EVALUATION = 'PRESENTIAL_EVALUATION',
  COMPLETED = 'COMPLETED'
}

export interface Author {
  id: string;
  name: string;
  email: string;
  birthDate: Date;
  cpf: string;
  phone: string;
  address: Address;
  schoolYear: string;
  isMainAuthor: boolean;
}

export interface Advisor {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  qualification: string;
  institution: string;
  isMainAdvisor: boolean;
}

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  state: string;
  city: string;
  isPublic: boolean;
  isFullTime?: boolean;
}

export enum InstitutionType {
  MUNICIPAL_PUBLIC = 'MUNICIPAL_PUBLIC',
  STATE_PUBLIC = 'STATE_PUBLIC',
  FEDERAL_PUBLIC = 'FEDERAL_PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ResearchPlan {
  title: string;
  summary: string;
  keywords: string[];
  introduction: string;
  objectives: {
    general: string;
    specific: string[];
  };
  methodology: string;
  results?: string;
  discussion?: string;
  conclusion?: string;
  references: string[];
}

export enum DocumentType {
  AUTHENTICITY_TERM = 'AUTHENTICITY_TERM',
  HUMAN_RESEARCH = 'HUMAN_RESEARCH',
  ANIMAL_RESEARCH = 'ANIMAL_RESEARCH',
  TISSUE_RESEARCH = 'TISSUE_RESEARCH',
  DANGEROUS_EQUIPMENT = 'DANGEROUS_EQUIPMENT',
  TOXIC_SUBSTANCES = 'TOXIC_SUBSTANCES',
  BIOLOGICAL_AGENTS = 'BIOLOGICAL_AGENTS',
  IMAGE_RIGHTS = 'IMAGE_RIGHTS',
  PARTICIPATION_AUTHORIZATION = 'PARTICIPATION_AUTHORIZATION',
  RESEARCH_REPORT = 'RESEARCH_REPORT',
  PRESENTATION_VIDEO = 'PRESENTATION_VIDEO',
  BANNER = 'BANNER',
  RESEARCH_DIARY = 'RESEARCH_DIARY'
}

export interface ProjectDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  isRequired: boolean;
  isApproved?: boolean;
}

export interface EvaluationCriteria {
  category: ProjectCategory;
  stage: ProjectStage;
  criteria: {
    name: string;
    weight: number;
    description: string;
  }[];
}

export interface Award {
  id: string;
  name: string;
  description: string;
  type: AwardType;
  category?: ProjectCategory;
  area?: KnowledgeArea;
  criteria: string;
}

export enum AwardType {
  CATEGORY_WINNER = 'CATEGORY_WINNER',
  SPECIAL_AWARD = 'SPECIAL_AWARD',
  REGIONAL_AWARD = 'REGIONAL_AWARD',
  INSTITUTIONAL_AWARD = 'INSTITUTIONAL_AWARD'
}