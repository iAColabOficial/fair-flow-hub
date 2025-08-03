export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      areas_conhecimento: {
        Row: {
          codigo_cnpq: string | null
          created_at: string
          id: string
          is_active: boolean
          nivel: Database["public"]["Enums"]["area_nivel"]
          nome: string
          parent_id: string | null
        }
        Insert: {
          codigo_cnpq?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          nivel: Database["public"]["Enums"]["area_nivel"]
          nome: string
          parent_id?: string | null
        }
        Update: {
          codigo_cnpq?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          nivel?: Database["public"]["Enums"]["area_nivel"]
          nome?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "areas_conhecimento_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          id: string
          joined_at: string
          project_id: string
          role: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          project_id: string
          role: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          project_id?: string
          role?: Database["public"]["Enums"]["member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_orientadores: {
        Row: {
          added_at: string
          id: string
          project_id: string
          tipo: Database["public"]["Enums"]["orientador_tipo"]
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          project_id: string
          tipo: Database["public"]["Enums"]["orientador_tipo"]
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          project_id?: string
          tipo?: Database["public"]["Enums"]["orientador_tipo"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_orientadores_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_orientadores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          area_conhecimento_id: string
          categoria: Database["public"]["Enums"]["project_categoria"]
          created_at: string
          created_by: string
          id: string
          is_credenciado: boolean
          palavras_chave: string | null
          resumo: string | null
          status: Database["public"]["Enums"]["project_status"]
          subcategoria:
            | Database["public"]["Enums"]["project_subcategoria"]
            | null
          titulo: string
          token_feira: string | null
          updated_at: string
        }
        Insert: {
          area_conhecimento_id: string
          categoria: Database["public"]["Enums"]["project_categoria"]
          created_at?: string
          created_by: string
          id?: string
          is_credenciado?: boolean
          palavras_chave?: string | null
          resumo?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          subcategoria?:
            | Database["public"]["Enums"]["project_subcategoria"]
            | null
          titulo: string
          token_feira?: string | null
          updated_at?: string
        }
        Update: {
          area_conhecimento_id?: string
          categoria?: Database["public"]["Enums"]["project_categoria"]
          created_at?: string
          created_by?: string
          id?: string
          is_credenciado?: boolean
          palavras_chave?: string | null
          resumo?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          subcategoria?:
            | Database["public"]["Enums"]["project_subcategoria"]
            | null
          titulo?: string
          token_feira?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_area_conhecimento_id_fkey"
            columns: ["area_conhecimento_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          area_atuacao: string | null
          created_at: string
          curriculo_lattes: string | null
          formacao_academica: string | null
          id: string
          instituicao: string | null
          nivel_escolar: Database["public"]["Enums"]["nivel_escolar"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area_atuacao?: string | null
          created_at?: string
          curriculo_lattes?: string | null
          formacao_academica?: string | null
          id?: string
          instituicao?: string | null
          nivel_escolar?: Database["public"]["Enums"]["nivel_escolar"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area_atuacao?: string | null
          created_at?: string
          curriculo_lattes?: string | null
          formacao_academica?: string | null
          id?: string
          instituicao?: string | null
          nivel_escolar?: Database["public"]["Enums"]["nivel_escolar"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          role_type: Database["public"]["Enums"]["role_type"]
          status: Database["public"]["Enums"]["role_status"]
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          role_type: Database["public"]["Enums"]["role_type"]
          status?: Database["public"]["Enums"]["role_status"]
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          role_type?: Database["public"]["Enums"]["role_type"]
          status?: Database["public"]["Enums"]["role_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          cpf: string
          created_at: string
          data_nascimento: string | null
          email: string
          email_verified: boolean
          endereco_completo: string | null
          id: string
          is_active: boolean
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf: string
          created_at?: string
          data_nascimento?: string | null
          email: string
          email_verified?: boolean
          endereco_completo?: string | null
          id?: string
          is_active?: boolean
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string
          created_at?: string
          data_nascimento?: string | null
          email?: string
          email_verified?: boolean
          endereco_completo?: string | null
          id?: string
          is_active?: boolean
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      area_nivel: "area" | "subarea"
      member_role: "autor_principal" | "autor"
      nivel_escolar:
        | "educacao_infantil"
        | "fundamental_1_3"
        | "fundamental_4_6"
        | "fundamental_7_9"
        | "medio"
        | "tecnico"
        | "eja"
        | "superior"
        | "pos_graduacao"
      orientador_tipo: "orientador" | "coorientador"
      project_categoria:
        | "I"
        | "II"
        | "III"
        | "IV"
        | "V"
        | "VI"
        | "VII"
        | "VIII"
        | "RELATO"
      project_status:
        | "rascunho"
        | "submetido"
        | "selecionado"
        | "confirmado_virtual"
        | "finalista"
        | "confirmado_presencial"
        | "avaliado"
        | "premiado"
        | "desclassificado"
      project_subcategoria: "II_a" | "II_b"
      role_status: "ativo" | "pendente" | "rejeitado" | "inativo"
      role_type:
        | "autor"
        | "orientador"
        | "coorientador"
        | "avaliador"
        | "voluntario"
        | "feira_afiliada"
        | "coordenador"
        | "coordenador_admin"
        | "diretor"
        | "financeiro"
        | "admin_staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      area_nivel: ["area", "subarea"],
      member_role: ["autor_principal", "autor"],
      nivel_escolar: [
        "educacao_infantil",
        "fundamental_1_3",
        "fundamental_4_6",
        "fundamental_7_9",
        "medio",
        "tecnico",
        "eja",
        "superior",
        "pos_graduacao",
      ],
      orientador_tipo: ["orientador", "coorientador"],
      project_categoria: [
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "RELATO",
      ],
      project_status: [
        "rascunho",
        "submetido",
        "selecionado",
        "confirmado_virtual",
        "finalista",
        "confirmado_presencial",
        "avaliado",
        "premiado",
        "desclassificado",
      ],
      project_subcategoria: ["II_a", "II_b"],
      role_status: ["ativo", "pendente", "rejeitado", "inativo"],
      role_type: [
        "autor",
        "orientador",
        "coorientador",
        "avaliador",
        "voluntario",
        "feira_afiliada",
        "coordenador",
        "coordenador_admin",
        "diretor",
        "financeiro",
        "admin_staff",
      ],
    },
  },
} as const
