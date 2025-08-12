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
      avaliador_areas: {
        Row: {
          area_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          area_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          area_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliador_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliador_areas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliador_disponibilidade: {
        Row: {
          created_at: string
          data_disponivel: string
          horario_fim: string
          horario_inicio: string
          id: string
          is_available: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          data_disponivel: string
          horario_fim: string
          horario_inicio: string
          id?: string
          is_available?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          data_disponivel?: string
          horario_fim?: string
          horario_inicio?: string
          id?: string
          is_available?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliador_disponibilidade_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categoria_precos: {
        Row: {
          categoria: Database["public"]["Enums"]["project_categoria"]
          created_at: string
          created_by: string | null
          etapa: Database["public"]["Enums"]["etapa_tipo"]
          id: string
          is_active: boolean
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: Database["public"]["Enums"]["project_categoria"]
          created_at?: string
          created_by?: string | null
          etapa: Database["public"]["Enums"]["etapa_tipo"]
          id?: string
          is_active?: boolean
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: Database["public"]["Enums"]["project_categoria"]
          created_at?: string
          created_by?: string | null
          etapa?: Database["public"]["Enums"]["etapa_tipo"]
          id?: string
          is_active?: boolean
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "categoria_precos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cronograma_febic: {
        Row: {
          created_at: string
          created_by: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          fase: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          fase: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          fase?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cronograma_febic_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feira_tokens: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          feira_id: string
          id: string
          is_active: boolean
          quantidade_credenciais: number
          quantidade_usada: number
          token: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          feira_id: string
          id?: string
          is_active?: boolean
          quantidade_credenciais: number
          quantidade_usada?: number
          token: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          feira_id?: string
          id?: string
          is_active?: boolean
          quantidade_credenciais?: number
          quantidade_usada?: number
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "feira_tokens_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
          cnpj: string | null
          created_at: string
          estado: string | null
          id: string
          instituicao_organizadora: string | null
          is_active: boolean
          nome_feira: string
          user_id: string
        }
        Insert: {
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          instituicao_organizadora?: string | null
          is_active?: boolean
          nome_feira: string
          user_id: string
        }
        Update: {
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          instituicao_organizadora?: string | null
          is_active?: boolean
          nome_feira?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feiras_afiliadas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      premio_tipos: {
        Row: {
          area_especifica_id: string | null
          categoria_especifica:
            | Database["public"]["Enums"]["project_categoria"]
            | null
          created_at: string
          descricao: string | null
          id: string
          is_active: boolean
          nome: string
        }
        Insert: {
          area_especifica_id?: string | null
          categoria_especifica?:
            | Database["public"]["Enums"]["project_categoria"]
            | null
          created_at?: string
          descricao?: string | null
          id?: string
          is_active?: boolean
          nome: string
        }
        Update: {
          area_especifica_id?: string | null
          categoria_especifica?:
            | Database["public"]["Enums"]["project_categoria"]
            | null
          created_at?: string
          descricao?: string | null
          id?: string
          is_active?: boolean
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "premio_tipos_area_especifica_id_fkey"
            columns: ["area_especifica_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
        ]
      }
      project_avaliacoes: {
        Row: {
          avaliado_at: string
          avaliador_id: string
          comentarios: string | null
          comentarios_publicos: string | null
          etapa: Database["public"]["Enums"]["etapa_avaliacao"]
          id: string
          is_comentarios_liberados: boolean
          nota_apresentacao: number | null
          nota_argumentacao: number | null
          nota_clareza: number | null
          nota_comunicacao_escrita: number | null
          nota_comunicacao_oral: number | null
          nota_comunidade: number | null
          nota_conhecimento: number | null
          nota_final: number
          nota_metodo_cientifico: number | null
          nota_objetivo_pedagogico: number | null
          nota_originalidade: number | null
          nota_referencias: number | null
          project_id: string
        }
        Insert: {
          avaliado_at?: string
          avaliador_id: string
          comentarios?: string | null
          comentarios_publicos?: string | null
          etapa: Database["public"]["Enums"]["etapa_avaliacao"]
          id?: string
          is_comentarios_liberados?: boolean
          nota_apresentacao?: number | null
          nota_argumentacao?: number | null
          nota_clareza?: number | null
          nota_comunicacao_escrita?: number | null
          nota_comunicacao_oral?: number | null
          nota_comunidade?: number | null
          nota_conhecimento?: number | null
          nota_final: number
          nota_metodo_cientifico?: number | null
          nota_objetivo_pedagogico?: number | null
          nota_originalidade?: number | null
          nota_referencias?: number | null
          project_id: string
        }
        Update: {
          avaliado_at?: string
          avaliador_id?: string
          comentarios?: string | null
          comentarios_publicos?: string | null
          etapa?: Database["public"]["Enums"]["etapa_avaliacao"]
          id?: string
          is_comentarios_liberados?: boolean
          nota_apresentacao?: number | null
          nota_argumentacao?: number | null
          nota_clareza?: number | null
          nota_comunicacao_escrita?: number | null
          nota_comunicacao_oral?: number | null
          nota_comunidade?: number | null
          nota_conhecimento?: number | null
          nota_final?: number
          nota_metodo_cientifico?: number | null
          nota_objetivo_pedagogico?: number | null
          nota_originalidade?: number | null
          nota_referencias?: number | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_avaliacoes_avaliador_id_fkey"
            columns: ["avaliador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
          assigned_at: string
          assigned_by: string
          avaliador_id: string
          data_avaliacao: string | null
          etapa: Database["public"]["Enums"]["etapa_tipo"]
          horario_avaliacao: string | null
          id: string
          project_id: string
          sala_meet_url: string | null
          status: Database["public"]["Enums"]["avaliacao_status"]
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          avaliador_id: string
          data_avaliacao?: string | null
          etapa: Database["public"]["Enums"]["etapa_tipo"]
          horario_avaliacao?: string | null
          id?: string
          project_id: string
          sala_meet_url?: string | null
          status?: Database["public"]["Enums"]["avaliacao_status"]
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          avaliador_id?: string
          data_avaliacao?: string | null
          etapa?: Database["public"]["Enums"]["etapa_tipo"]
          horario_avaliacao?: string | null
          id?: string
          project_id?: string
          sala_meet_url?: string | null
          status?: Database["public"]["Enums"]["avaliacao_status"]
        }
        Relationships: [
          {
            foreignKeyName: "project_avaliadores_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_avaliadores_avaliador_id_fkey"
            columns: ["avaliador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          project_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          project_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          project_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
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
      project_pagamentos: {
        Row: {
          asaas_invoice_url: string | null
          asaas_payment_id: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string | null
          etapa: Database["public"]["Enums"]["etapa_tipo"]
          id: string
          is_isento: boolean
          liberado_by: string | null
          motivo_isencao: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          project_id: string
          solicitado_by: string
          status_pagamento: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          valor_final: number
          valor_original: number
        }
        Insert: {
          asaas_invoice_url?: string | null
          asaas_payment_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          etapa: Database["public"]["Enums"]["etapa_tipo"]
          id?: string
          is_isento?: boolean
          liberado_by?: string | null
          motivo_isencao?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project_id: string
          solicitado_by: string
          status_pagamento?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          valor_final: number
          valor_original: number
        }
        Update: {
          asaas_invoice_url?: string | null
          asaas_payment_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          etapa?: Database["public"]["Enums"]["etapa_tipo"]
          id?: string
          is_isento?: boolean
          liberado_by?: string | null
          motivo_isencao?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project_id?: string
          solicitado_by?: string
          status_pagamento?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          valor_final?: number
          valor_original?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_pagamentos_liberado_by_fkey"
            columns: ["liberado_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_pagamentos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_pagamentos_solicitado_by_fkey"
            columns: ["solicitado_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_premios: {
        Row: {
          awarded_at: string
          awarded_by: string
          id: string
          observacoes: string | null
          posicao: number | null
          premio_tipo_id: string
          project_id: string
        }
        Insert: {
          awarded_at?: string
          awarded_by: string
          id?: string
          observacoes?: string | null
          posicao?: number | null
          premio_tipo_id: string
          project_id: string
        }
        Update: {
          awarded_at?: string
          awarded_by?: string
          id?: string
          observacoes?: string | null
          posicao?: number | null
          premio_tipo_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_premios_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_premios_premio_tipo_id_fkey"
            columns: ["premio_tipo_id"]
            isOneToOne: false
            referencedRelation: "premio_tipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_premios_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_timeline: {
        Row: {
          changed_at: string
          changed_by: string
          id: string
          observacoes: string | null
          project_id: string
          status_anterior: Database["public"]["Enums"]["project_status"] | null
          status_novo: Database["public"]["Enums"]["project_status"]
        }
        Insert: {
          changed_at?: string
          changed_by: string
          id?: string
          observacoes?: string | null
          project_id: string
          status_anterior?: Database["public"]["Enums"]["project_status"] | null
          status_novo: Database["public"]["Enums"]["project_status"]
        }
        Update: {
          changed_at?: string
          changed_by?: string
          id?: string
          observacoes?: string | null
          project_id?: string
          status_anterior?: Database["public"]["Enums"]["project_status"] | null
          status_novo?: Database["public"]["Enums"]["project_status"]
        }
        Relationships: [
          {
            foreignKeyName: "project_timeline_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
        ]
      }
      system_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_notices: {
        Row: {
          conteudo: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
          is_urgent: boolean
          target_roles: Json | null
          titulo: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_urgent?: boolean
          target_roles?: Json | null
          titulo: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_urgent?: boolean
          target_roles?: Json | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_notices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          mensagem: string
          related_project_id: string | null
          tipo: Database["public"]["Enums"]["notification_tipo"]
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          mensagem: string
          related_project_id?: string | null
          tipo?: Database["public"]["Enums"]["notification_tipo"]
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          mensagem?: string
          related_project_id?: string | null
          tipo?: Database["public"]["Enums"]["notification_tipo"]
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
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
      avaliacao_status: "atribuido" | "em_avaliacao" | "concluido"
      document_type:
        | "plano_pesquisa"
        | "termo_autenticidade"
        | "relatorio_sucinto"
        | "video_apresentacao"
        | "banner"
        | "diario_bordo"
        | "termo_autorizacao_imagem"
        | "termo_autorizacao_menor"
        | "documento_especial"
      etapa_avaliacao: "cias" | "virtual" | "presencial"
      etapa_tipo: "virtual" | "presencial"
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
      notification_tipo: "info" | "warning" | "error" | "success"
      orientador_tipo: "orientador" | "coorientador"
      payment_method: "boleto" | "pix" | "cartao"
      payment_status: "pendente" | "pago" | "vencido" | "cancelado" | "isento"
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
      avaliacao_status: ["atribuido", "em_avaliacao", "concluido"],
      document_type: [
        "plano_pesquisa",
        "termo_autenticidade",
        "relatorio_sucinto",
        "video_apresentacao",
        "banner",
        "diario_bordo",
        "termo_autorizacao_imagem",
        "termo_autorizacao_menor",
        "documento_especial",
      ],
      etapa_avaliacao: ["cias", "virtual", "presencial"],
      etapa_tipo: ["virtual", "presencial"],
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
      notification_tipo: ["info", "warning", "error", "success"],
      orientador_tipo: ["orientador", "coorientador"],
      payment_method: ["boleto", "pix", "cartao"],
      payment_status: ["pendente", "pago", "vencido", "cancelado", "isento"],
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
