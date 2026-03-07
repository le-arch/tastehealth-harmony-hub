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
      badges: {
        Row: {
          created_at: string
          description: string | null
          earned_at: string
          icon: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      bmi_log: {
        Row: {
          bmi: number
          created_at: string
          date: string
          height: number
          id: string
          status: string
          user_id: string
          weight: number
        }
        Insert: {
          bmi: number
          created_at?: string
          date?: string
          height: number
          id?: string
          status?: string
          user_id: string
          weight: number
        }
        Update: {
          bmi?: number
          created_at?: string
          date?: string
          height?: number
          id?: string
          status?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      calorie_log: {
        Row: {
          calories: number
          created_at: string
          date: string
          id: string
          meal: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          calories?: number
          created_at?: string
          date?: string
          id?: string
          meal?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          calories?: number
          created_at?: string
          date?: string
          id?: string
          meal?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          completed: boolean
          created_at: string
          difficulty: number
          duration: number
          id: string
          name: string
          progress: number
          start_date: string
          target: number
          types: string[]
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          difficulty?: number
          duration?: number
          id?: string
          name: string
          progress?: number
          start_date?: string
          target?: number
          types?: string[]
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          difficulty?: number
          duration?: number
          id?: string
          name?: string
          progress?: number
          start_date?: string
          target?: number
          types?: string[]
          user_id?: string
        }
        Relationships: []
      }
      daily_meals: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          date: string
          fats: number
          id: string
          meal_name: string
          meal_type: string
          protein: number
          user_id: string
        }
        Insert: {
          calories?: number
          carbs?: number
          created_at?: string
          date?: string
          fats?: number
          id?: string
          meal_name: string
          meal_type: string
          protein?: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          date?: string
          fats?: number
          id?: string
          meal_name?: string
          meal_type?: string
          protein?: number
          user_id?: string
        }
        Relationships: []
      }
      exercise_log: {
        Row: {
          calories_burned: number
          created_at: string
          date: string
          duration: number
          id: string
          type: string
          user_id: string
        }
        Insert: {
          calories_burned?: number
          created_at?: string
          date?: string
          duration?: number
          id?: string
          type?: string
          user_id: string
        }
        Update: {
          calories_burned?: number
          created_at?: string
          date?: string
          duration?: number
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          text: string
          user_id: string
          week: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          text: string
          user_id: string
          week?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          text?: string
          user_id?: string
          week?: string
        }
        Relationships: []
      }
      hydration_log: {
        Row: {
          created_at: string
          cups: number
          date: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cups?: number
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cups?: number
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          date: string
          id: string
          mood: string | null
          tags: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          date?: string
          id?: string
          mood?: string | null
          tags?: string[] | null
          title?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          date?: string
          id?: string
          mood?: string | null
          tags?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_plan_items: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          day_of_week: string
          fats: number
          id: string
          meal_name: string
          meal_plan_id: string
          meal_type: string
          protein: number
          user_id: string
        }
        Insert: {
          calories?: number
          carbs?: number
          created_at?: string
          day_of_week: string
          fats?: number
          id?: string
          meal_name: string
          meal_plan_id: string
          meal_type: string
          protein?: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          day_of_week?: string
          fats?: number
          id?: string
          meal_name?: string
          meal_plan_id?: string
          meal_type?: string
          protein?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_items_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number
          carbs: number
          category: string | null
          created_at: string
          fats: number
          id: string
          image_url: string | null
          is_favorite: boolean
          name: string
          protein: number
          user_id: string
        }
        Insert: {
          calories?: number
          carbs?: number
          category?: string | null
          created_at?: string
          fats?: number
          id?: string
          image_url?: string | null
          is_favorite?: boolean
          name: string
          protein?: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          category?: string | null
          created_at?: string
          fats?: number
          id?: string
          image_url?: string | null
          is_favorite?: boolean
          name?: string
          protein?: number
          user_id?: string
        }
        Relationships: []
      }
      mood_log: {
        Row: {
          created_at: string
          date: string
          id: string
          meal_name: string | null
          mood: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          meal_name?: string | null
          mood: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          meal_name?: string | null
          mood?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          date: string
          id: string
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          message?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      nutrition_settings: {
        Row: {
          carbs_percentage: number
          created_at: string
          daily_calories: number
          fats_percentage: number
          id: string
          preferences: string[] | null
          protein_percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          carbs_percentage?: number
          created_at?: string
          daily_calories?: number
          fats_percentage?: number
          id?: string
          preferences?: string[] | null
          protein_percentage?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          carbs_percentage?: number
          created_at?: string
          daily_calories?: number
          fats_percentage?: number
          id?: string
          preferences?: string[] | null
          protein_percentage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          created_at: string
          date: string
          id: string
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          points?: number
          reason?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: string | null
          allergies: string | null
          avatar_url: string | null
          calorie_goal: string | null
          created_at: string
          dietary_restrictions: string | null
          email: string
          gender: string | null
          health_goals: string | null
          height: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
          weight: string | null
        }
        Insert: {
          activity_level?: string | null
          age?: string | null
          allergies?: string | null
          avatar_url?: string | null
          calorie_goal?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string
          gender?: string | null
          health_goals?: string | null
          height?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id: string
          weight?: string | null
        }
        Update: {
          activity_level?: string | null
          age?: string | null
          allergies?: string | null
          avatar_url?: string | null
          calorie_goal?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string
          gender?: string | null
          health_goals?: string | null
          height?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          weight?: string | null
        }
        Relationships: []
      }
      quiz_scores: {
        Row: {
          created_at: string
          date: string
          id: string
          percentage: number
          score: number
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          percentage?: number
          score?: number
          total?: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          percentage?: number
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          calories: number | null
          carbs: number | null
          category: string | null
          created_at: string
          fats: number | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          method: string | null
          name: string
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          category?: string | null
          created_at?: string
          fats?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          method?: string | null
          name: string
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          category?: string | null
          created_at?: string
          fats?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          method?: string | null
          name?: string
          protein?: number | null
          user_id?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          claimed: boolean
          claimed_at: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          points_cost: number
          user_id: string
        }
        Insert: {
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points_cost?: number
          user_id: string
        }
        Update: {
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points_cost?: number
          user_id?: string
        }
        Relationships: []
      }
      saved_tips: {
        Row: {
          id: string
          saved_at: string
          tip_category: string | null
          tip_content: string
          tip_title: string
          user_id: string
        }
        Insert: {
          id?: string
          saved_at?: string
          tip_category?: string | null
          tip_content: string
          tip_title: string
          user_id: string
        }
        Update: {
          id?: string
          saved_at?: string
          tip_category?: string | null
          tip_content?: string
          tip_title?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_log: {
        Row: {
          created_at: string
          date: string
          hours: number
          id: string
          quality: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          hours?: number
          id?: string
          quality?: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          hours?: number
          id?: string
          quality?: number
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string
          id: string
          last_streak_date: string | null
          level: number
          points: number
          streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_streak_date?: string | null
          level?: number
          points?: number
          streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_streak_date?: string | null
          level?: number
          points?: number
          streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
