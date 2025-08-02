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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
        }
        Relationships: []
      }
      areas_conhecimento: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      assistant_configs: {
        Row: {
          business_description: string | null
          business_hours: Json | null
          created_at: string
          faq: Json | null
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          business_description?: string | null
          business_hours?: Json | null
          created_at?: string
          faq?: Json | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          business_description?: string | null
          business_hours?: Json | null
          created_at?: string
          faq?: Json | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      avaliador_areas: {
        Row: {
          area_conhecimento_id: number | null
          avaliador_id: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          area_conhecimento_id?: number | null
          avaliador_id?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          area_conhecimento_id?: number | null
          avaliador_id?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliador_areas_area_conhecimento_id_fkey"
            columns: ["area_conhecimento_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliador_disponibilidade: {
        Row: {
          avaliador_id: string | null
          created_at: string | null
          data_fim: string
          data_inicio: string
          id: string
          observacoes: string | null
        }
        Insert: {
          avaliador_id?: string | null
          created_at?: string | null
          data_fim: string
          data_inicio: string
          id?: string
          observacoes?: string | null
        }
        Update: {
          avaliador_id?: string | null
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          id?: string
          observacoes?: string | null
        }
        Relationships: []
      }
      categoria_precos: {
        Row: {
          ano: number
          categoria: string
          created_at: string | null
          etapa: string
          id: number
          valor: number
        }
        Insert: {
          ano: number
          categoria: string
          created_at?: string | null
          etapa: string
          id?: number
          valor: number
        }
        Update: {
          ano?: number
          categoria?: string
          created_at?: string | null
          etapa?: string
          id?: number
          valor?: number
        }
        Relationships: []
      }
      conversations: {
        Row: {
          customer_contact: string | null
          customer_name: string | null
          ended_at: string | null
          id: string
          started_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          customer_contact?: string | null
          customer_name?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          customer_contact?: string | null
          customer_name?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feira_tokens: {
        Row: {
          created_at: string | null
          current_uses: number | null
          expires_at: string | null
          feira_id: string | null
          id: string
          max_uses: number | null
          token: string
        }
        Insert: {
          created_at?: string | null
          current_uses?: number | null
          expires_at?: string | null
          feira_id?: string | null
          id?: string
          max_uses?: number | null
          token: string
        }
        Update: {
          created_at?: string | null
          current_uses?: number | null
          expires_at?: string | null
          feira_id?: string | null
          id?: string
          max_uses?: number | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "feira_tokens_feira_id_fkey"
            columns: ["feira_id"]
            isOneToOne: false
            referencedRelation: "feiras_afiliadas"
            referencedColumns: ["id"]
          },
        ]
      }
      feiras_afiliadas: {
        Row: {
          cidade: string | null
          contato_email: string | null
          contato_telefone: string | null
          created_at: string | null
          estado: string | null
          id: string
          nome: string
          responsavel_id: string | null
          status: string | null
        }
        Insert: {
          cidade?: string | null
          contato_email?: string | null
          contato_telefone?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          nome: string
          responsavel_id?: string | null
          status?: string | null
        }
        Update: {
          cidade?: string | null
          contato_email?: string | null
          contato_telefone?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          nome?: string
          responsavel_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      gringo_chat_historico: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      medical_information: {
        Row: {
          id: number
          medical_data: Json
          session_id: string
          timestamp: string | null
        }
        Insert: {
          id?: number
          medical_data?: Json
          session_id: string
          timestamp?: string | null
        }
        Update: {
          id?: number
          medical_data?: Json
          session_id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          additional_kwargs: Json | null
          created_at: string | null
          id: number
          message: string
          message_type: string
          session_id: string
        }
        Insert: {
          additional_kwargs?: Json | null
          created_at?: string | null
          id?: number
          message: string
          message_type?: string
          session_id: string
        }
        Update: {
          additional_kwargs?: Json | null
          created_at?: string | null
          id?: number
          message?: string
          message_type?: string
          session_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_status: string | null
          avatar_url: string | null
          company_name: string | null
          cpf: string | null
          cpf_encrypted: string | null
          created_at: string
          data_nascimento: string | null
          email: string
          endereco_encrypted: string | null
          failed_login_attempts: number | null
          full_name: string | null
          gdpr_consent_at: string | null
          id: string
          instituicao: string | null
          is_minor: boolean | null
          last_login_at: string | null
          locked_until: string | null
          marketing_consent: boolean | null
          n8n_webhook_url: string | null
          parent_consent_email: string | null
          parent_consent_verified_at: string | null
          phone: string | null
          phone_formatted: string | null
          plan: Database["public"]["Enums"]["plan_type"]
          role: string | null
          status: Database["public"]["Enums"]["user_status"]
          telefone_encrypted: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          ai_status?: string | null
          avatar_url?: string | null
          company_name?: string | null
          cpf?: string | null
          cpf_encrypted?: string | null
          created_at?: string
          data_nascimento?: string | null
          email: string
          endereco_encrypted?: string | null
          failed_login_attempts?: number | null
          full_name?: string | null
          gdpr_consent_at?: string | null
          id: string
          instituicao?: string | null
          is_minor?: boolean | null
          last_login_at?: string | null
          locked_until?: string | null
          marketing_consent?: boolean | null
          n8n_webhook_url?: string | null
          parent_consent_email?: string | null
          parent_consent_verified_at?: string | null
          phone?: string | null
          phone_formatted?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          role?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          telefone_encrypted?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          ai_status?: string | null
          avatar_url?: string | null
          company_name?: string | null
          cpf?: string | null
          cpf_encrypted?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string
          endereco_encrypted?: string | null
          failed_login_attempts?: number | null
          full_name?: string | null
          gdpr_consent_at?: string | null
          id?: string
          instituicao?: string | null
          is_minor?: boolean | null
          last_login_at?: string | null
          locked_until?: string | null
          marketing_consent?: boolean | null
          n8n_webhook_url?: string | null
          parent_consent_email?: string | null
          parent_consent_verified_at?: string | null
          phone?: string | null
          phone_formatted?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          role?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          telefone_encrypted?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_avaliacoes: {
        Row: {
          avaliador_id: string | null
          created_at: string | null
          criterios: Json | null
          etapa: string
          id: string
          nota_total: number | null
          observacoes: string | null
          project_id: string | null
          tempo_avaliacao: number | null
        }
        Insert: {
          avaliador_id?: string | null
          created_at?: string | null
          criterios?: Json | null
          etapa: string
          id?: string
          nota_total?: number | null
          observacoes?: string | null
          project_id?: string | null
          tempo_avaliacao?: number | null
        }
        Update: {
          avaliador_id?: string | null
          created_at?: string | null
          criterios?: Json | null
          etapa?: string
          id?: string
          nota_total?: number | null
          observacoes?: string | null
          project_id?: string | null
          tempo_avaliacao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_avaliacoes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_avaliadores: {
        Row: {
          assigned_at: string | null
          avaliador_id: string | null
          etapa: string
          id: string
          project_id: string | null
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          avaliador_id?: string | null
          etapa: string
          id?: string
          project_id?: string | null
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          avaliador_id?: string | null
          etapa?: string
          id?: string
          project_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_avaliadores_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          project_id: string | null
          upload_date: string | null
          uploaded_by: string | null
        }
        Insert: {
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          project_id?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
        }
        Update: {
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          project_id?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string | null
          id: string
          is_presenter: boolean | null
          project_id: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_presenter?: boolean | null
          project_id?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_presenter?: boolean | null
          project_id?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_pagamentos: {
        Row: {
          created_at: string | null
          etapa: string
          external_id: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          project_id: string | null
          status: string | null
          valor: number
        }
        Insert: {
          created_at?: string | null
          etapa: string
          external_id?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          project_id?: string | null
          status?: string | null
          valor: number
        }
        Update: {
          created_at?: string | null
          etapa?: string
          external_id?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          project_id?: string | null
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_pagamentos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_timeline: {
        Row: {
          created_by: string | null
          description: string | null
          event_date: string | null
          event_type: string
          id: string
          project_id: string | null
        }
        Insert: {
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          event_type: string
          id?: string
          project_id?: string | null
        }
        Update: {
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          event_type?: string
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_timeline_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          area_conhecimento_id: number | null
          categoria: string
          created_at: string | null
          created_by: string
          id: string
          palavras_chave: string | null
          resumo: string
          status: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          area_conhecimento_id?: number | null
          categoria: string
          created_at?: string | null
          created_by: string
          id?: string
          palavras_chave?: string | null
          resumo: string
          status?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          area_conhecimento_id?: number | null
          categoria?: string
          created_at?: string | null
          created_by?: string
          id?: string
          palavras_chave?: string | null
          resumo?: string
          status?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_area_conhecimento_id_fkey"
            columns: ["area_conhecimento_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
        ]
      }
      system_notices: {
        Row: {
          active: boolean | null
          content: string
          created_by: string | null
          expires_at: string | null
          id: string
          published_at: string | null
          target_roles: Database["public"]["Enums"]["febic_role"][] | null
          title: string
          type: string | null
        }
        Insert: {
          active?: boolean | null
          content: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          target_roles?: Database["public"]["Enums"]["febic_role"][] | null
          title: string
          type?: string | null
        }
        Update: {
          active?: boolean | null
          content?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          target_roles?: Database["public"]["Enums"]["febic_role"][] | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      threads: {
        Row: {
          created_at: string | null
          id: string
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      usage_stats: {
        Row: {
          conversations_count: number | null
          created_at: string
          date: string
          id: string
          messages_count: number | null
          user_id: string
        }
        Insert: {
          conversations_count?: number | null
          created_at?: string
          date?: string
          id?: string
          messages_count?: number | null
          user_id: string
        }
        Update: {
          conversations_count?: number | null
          created_at?: string
          date?: string
          id?: string
          messages_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          requested_at: string | null
          role: Database["public"]["Enums"]["febic_role"]
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          requested_at?: string | null
          role: Database["public"]["Enums"]["febic_role"]
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          requested_at?: string | null
          role?: Database["public"]["Enums"]["febic_role"]
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_febic_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["febic_role"]
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_evaluator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_data_access: {
        Args: { table_name: string; operation: string; record_id?: string }
        Returns: undefined
      }
      set_session_context: {
        Args: { session_id: string }
        Returns: undefined
      }
    }
    Enums: {
      febic_role:
        | "admin_staff"
        | "diretor"
        | "coordenador_admin"
        | "coordenador"
        | "financeiro"
        | "avaliador"
        | "feira_afiliada"
        | "orientador"
        | "coorientador"
        | "autor"
        | "voluntario"
      plan_type: "free" | "essential" | "professional" | "full_colab"
      user_status: "active" | "inactive" | "trial" | "suspended"
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
      febic_role: [
        "admin_staff",
        "diretor",
        "coordenador_admin",
        "coordenador",
        "financeiro",
        "avaliador",
        "feira_afiliada",
        "orientador",
        "coorientador",
        "autor",
        "voluntario",
      ],
      plan_type: ["free", "essential", "professional", "full_colab"],
      user_status: ["active", "inactive", "trial", "suspended"],
    },
  },
} as const
