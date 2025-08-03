export type RoleType = 'autor' | 'orientador' | 'coorientador' | 'avaliador' | 'voluntario' | 'feira_afiliada' | 'coordenador' | 'coordenador_admin' | 'diretor' | 'financeiro' | 'admin_staff';

export type RoleStatus = 'ativo' | 'pendente' | 'rejeitado' | 'inativo';

export type NivelEscolar = 'educacao_infantil' | 'fundamental_1_3' | 'fundamental_4_6' | 'fundamental_7_9' | 'medio' | 'tecnico' | 'eja' | 'superior' | 'pos_graduacao';

export type ProjectCategoria = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'RELATO';

export type ProjectStatus = 'rascunho' | 'submetido' | 'selecionado' | 'confirmado_virtual' | 'finalista' | 'confirmado_presencial' | 'avaliado' | 'premiado' | 'desclassificado';

export interface User {
  id: string;
  email: string;
  cpf: string;
  nome: string;
  telefone?: string;
  data_nascimento?: string;
  endereco_completo?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_type: RoleType;
  status: RoleStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  instituicao?: string;
  nivel_escolar?: NivelEscolar;
  formacao_academica?: string;
  area_atuacao?: string;
  curriculo_lattes?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  titulo: string;
  categoria: ProjectCategoria;
  subcategoria?: 'II_a' | 'II_b';
  area_conhecimento_id: string;
  resumo?: string;
  palavras_chave?: string;
  status: ProjectStatus;
  is_credenciado: boolean;
  token_feira?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AreaConhecimento {
  id: string;
  codigo_cnpq?: string;
  nome: string;
  nivel: 'area' | 'subarea';
  parent_id?: string;
  is_active: boolean;
  created_at: string;
}