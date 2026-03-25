export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      invitation_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          invitation_id: string | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invitation_id?: string | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invitation_id?: string | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_requests_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          code: string
          created_at: string
          created_by: string | null
          email: string | null
          expires_at: string
          from_public_request: boolean
          id: string
          invitation_kind: string
          max_redemptions: number | null
          name: string | null
          redemption_count: number
          status: Database["public"]["Enums"]["invitation_status"]
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          expires_at?: string
          from_public_request?: boolean
          id?: string
          invitation_kind?: string
          max_redemptions?: number | null
          name?: string | null
          redemption_count?: number
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          expires_at?: string
          from_public_request?: boolean
          id?: string
          invitation_kind?: string
          max_redemptions?: number | null
          name?: string | null
          redemption_count?: number
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Relationships: []
      }
      invitation_redemptions: {
        Row: {
          created_at: string
          id: string
          invitation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitation_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invitation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_redemptions_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_children: {
        Row: {
          birthdate: string | null
          created_at: string
          custody_percent: number | null
          gender: string | null
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          birthdate?: string | null
          created_at?: string
          custody_percent?: number | null
          gender?: string | null
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          birthdate?: string | null
          created_at?: string
          custody_percent?: number | null
          gender?: string | null
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          bio: string | null
          birth_date: string | null
          blood_type: string | null
          cannabis: string | null
          causes: string[] | null
          city: string | null
          company: string | null
          conception_methods: string[] | null
          country: string | null
          created_at: string
          custody_further_info: string | null
          custody_school_arrangement: string | null
          custody_school_days: string | null
          custody_vacation_arrangement: string | null
          custody_vacation_conditions: string | null
          degree: string | null
          diet: string | null
          drinking: string | null
          drugs: string | null
          education: string | null
          email: string
          ethnicity: string | null
          exercise: string | null
          eye_colour: string | null
          family_situation: string | null
          family_support: string | null
          field_of_study: string | null
          financial_situation: string | null
          first_name: string
          first_name_old: string | null
          gender: string | null
          hair_colour: string | null
          height: number | null
          hometown: string | null
          hometown_country: string | null
          household_situation: string | null
          id: string
          interests: string[] | null
          involvement: string | null
          involvement_flexibility: string | null
          involvement_percent: number | null
          is_active: boolean | null
          is_public: boolean | null
          languages: string[] | null
          lifestyle_rhythm: string | null
          looking_for: string[] | null
          looking_for_text: string | null
          nationality: string | null
          occupation: string | null
          onboarding_completed: boolean | null
          open_to_relocation: boolean | null
          parenting_philosophy: string | null
          parenting_status: string | null
          pets: string | null
          phone: string | null
          photo_url: string | null
          politics: string | null
          preferred_method: string | null
          profession: string | null
          qualities: string[] | null
          relationship_status: string | null
          religion: string | null
          school: string | null
          sexuality: string | null
          show_last_active: boolean | null
          show_location: boolean | null
          show_online_status: boolean | null
          smoking: string | null
          star_sign: string | null
          studies: string | null
          updated_at: string
          user_id: string | null
          vaccinated: string | null
          values: string[] | null
          verified: boolean | null
          vision: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          birth_date?: string | null
          blood_type?: string | null
          cannabis?: string | null
          causes?: string[] | null
          city?: string | null
          company?: string | null
          conception_methods?: string[] | null
          country?: string | null
          created_at?: string
          custody_further_info?: string | null
          custody_school_arrangement?: string | null
          custody_school_days?: string | null
          custody_vacation_arrangement?: string | null
          custody_vacation_conditions?: string | null
          degree?: string | null
          diet?: string | null
          drinking?: string | null
          drugs?: string | null
          education?: string | null
          email: string
          ethnicity?: string | null
          exercise?: string | null
          eye_colour?: string | null
          family_situation?: string | null
          family_support?: string | null
          field_of_study?: string | null
          financial_situation?: string | null
          first_name?: string
          first_name_old?: string | null
          gender?: string | null
          hair_colour?: string | null
          height?: number | null
          hometown?: string | null
          hometown_country?: string | null
          household_situation?: string | null
          id?: string
          interests?: string[] | null
          involvement?: string | null
          involvement_flexibility?: string | null
          involvement_percent?: number | null
          is_active?: boolean | null
          is_public?: boolean | null
          languages?: string[] | null
          lifestyle_rhythm?: string | null
          looking_for?: string[] | null
          looking_for_text?: string | null
          nationality?: string | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          open_to_relocation?: boolean | null
          parenting_philosophy?: string | null
          parenting_status?: string | null
          pets?: string | null
          phone?: string | null
          photo_url?: string | null
          politics?: string | null
          preferred_method?: string | null
          profession?: string | null
          qualities?: string[] | null
          relationship_status?: string | null
          religion?: string | null
          school?: string | null
          sexuality?: string | null
          show_last_active?: boolean | null
          show_location?: boolean | null
          show_online_status?: boolean | null
          smoking?: string | null
          star_sign?: string | null
          studies?: string | null
          updated_at?: string
          user_id?: string | null
          vaccinated?: string | null
          values?: string[] | null
          verified?: boolean | null
          vision?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          birth_date?: string | null
          blood_type?: string | null
          cannabis?: string | null
          causes?: string[] | null
          city?: string | null
          company?: string | null
          conception_methods?: string[] | null
          country?: string | null
          created_at?: string
          custody_further_info?: string | null
          custody_school_arrangement?: string | null
          custody_school_days?: string | null
          custody_vacation_arrangement?: string | null
          custody_vacation_conditions?: string | null
          degree?: string | null
          diet?: string | null
          drinking?: string | null
          drugs?: string | null
          education?: string | null
          email?: string
          ethnicity?: string | null
          exercise?: string | null
          eye_colour?: string | null
          family_situation?: string | null
          family_support?: string | null
          field_of_study?: string | null
          financial_situation?: string | null
          first_name?: string
          first_name_old?: string | null
          gender?: string | null
          hair_colour?: string | null
          height?: number | null
          hometown?: string | null
          hometown_country?: string | null
          household_situation?: string | null
          id?: string
          interests?: string[] | null
          involvement?: string | null
          involvement_flexibility?: string | null
          involvement_percent?: number | null
          is_active?: boolean | null
          is_public?: boolean | null
          languages?: string[] | null
          lifestyle_rhythm?: string | null
          looking_for?: string[] | null
          looking_for_text?: string | null
          nationality?: string | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          open_to_relocation?: boolean | null
          parenting_philosophy?: string | null
          parenting_status?: string | null
          pets?: string | null
          phone?: string | null
          photo_url?: string | null
          politics?: string | null
          preferred_method?: string | null
          profession?: string | null
          qualities?: string[] | null
          relationship_status?: string | null
          religion?: string | null
          school?: string | null
          sexuality?: string | null
          show_last_active?: boolean | null
          show_location?: boolean | null
          show_online_status?: boolean | null
          smoking?: string | null
          star_sign?: string | null
          studies?: string | null
          updated_at?: string
          user_id?: string | null
          vaccinated?: string | null
          values?: string[] | null
          verified?: boolean | null
          vision?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      shortlist: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_email: { Args: { email: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      invitation_status: "pending" | "accepted" | "expired" | "revoked"
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
      app_role: ["admin", "user"],
      invitation_status: ["pending", "accepted", "expired", "revoked"],
    },
  },
} as const
