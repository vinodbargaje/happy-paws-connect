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
      caregiver_profiles: {
        Row: {
          availability: Json | null
          bio: string | null
          created_at: string
          daily_rate: number | null
          hourly_rate: number | null
          id: string
          is_background_checked: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          portfolio_images: string[] | null
          rating: number | null
          service_radius: number | null
          services_offered: string[] | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          created_at?: string
          daily_rate?: number | null
          hourly_rate?: number | null
          id?: string
          is_background_checked?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          portfolio_images?: string[] | null
          rating?: number | null
          service_radius?: number | null
          services_offered?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          created_at?: string
          daily_rate?: number | null
          hourly_rate?: number | null
          id?: string
          is_background_checked?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          portfolio_images?: string[] | null
          rating?: number | null
          service_radius?: number | null
          services_offered?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      pets: {
        Row: {
          age: number | null
          behavior_notes: string | null
          breed: string | null
          created_at: string
          feeding_schedule: string | null
          id: string
          medical_conditions: string | null
          name: string
          owner_id: string
          pet_type: string
          photo_url: string | null
          sex: string | null
          special_needs: string | null
          temperament: string | null
          updated_at: string
          vaccination_status: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          behavior_notes?: string | null
          breed?: string | null
          created_at?: string
          feeding_schedule?: string | null
          id?: string
          medical_conditions?: string | null
          name: string
          owner_id: string
          pet_type: string
          photo_url?: string | null
          sex?: string | null
          special_needs?: string | null
          temperament?: string | null
          updated_at?: string
          vaccination_status?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          behavior_notes?: string | null
          breed?: string | null
          created_at?: string
          feeding_schedule?: string | null
          id?: string
          medical_conditions?: string | null
          name?: string
          owner_id?: string
          pet_type?: string
          photo_url?: string | null
          sex?: string | null
          special_needs?: string | null
          temperament?: string | null
          updated_at?: string
          vaccination_status?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          pincode: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          pincode?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          pincode?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          razorpay_payment_id: string | null
          razorpay_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          razorpay_payment_id?: string | null
          razorpay_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          razorpay_payment_id?: string | null
          razorpay_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
    }
    Enums: {
      app_role: "owner" | "caregiver" | "admin"
      subscription_tier: "free" | "basic" | "premium"
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
      app_role: ["owner", "caregiver", "admin"],
      subscription_tier: ["free", "basic", "premium"],
    },
  },
} as const
