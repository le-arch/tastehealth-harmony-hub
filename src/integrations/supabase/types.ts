export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bmi_records: {
        Row: {
          bmi: number
          height: number
          id: string
          recorded_at: string
          status: string
          user_id: string
          weight: number
        }
        Insert: {
          bmi: number
          height: number
          id?: string
          recorded_at?: string
          status: string
          user_id: string
          weight: number
        }
        Update: {
          bmi?: number
          height?: number
          id?: string
          recorded_at?: string
          status?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      calorie_records: {
        Row: {
          calories_consumed: number
          calories_goal: number
          carbs_grams: number | null
          created_at: string
          fat_grams: number | null
          id: string
          protein_grams: number | null
          recorded_date: string
          user_id: string
        }
        Insert: {
          calories_consumed?: number
          calories_goal?: number
          carbs_grams?: number | null
          created_at?: string
          fat_grams?: number | null
          id?: string
          protein_grams?: number | null
          recorded_date?: string
          user_id?: string
        }
        Update: {
          calories_consumed?: number
          calories_goal?: number
          carbs_grams?: number | null
          created_at?: string
          fat_grams?: number | null
          id?: string
          protein_grams?: number | null
          recorded_date?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_progress: {
        Row: {
          calories_goal_percentage: number | null
          created_at: string
          date: string
          exercise_goal_percentage: number | null
          id: string
          overall_progress_percentage: number | null
          sleep_goal_percentage: number | null
          user_id: string
          water_goal_percentage: number | null
        }
        Insert: {
          calories_goal_percentage?: number | null
          created_at?: string
          date?: string
          exercise_goal_percentage?: number | null
          id?: string
          overall_progress_percentage?: number | null
          sleep_goal_percentage?: number | null
          user_id: string
          water_goal_percentage?: number | null
        }
        Update: {
          calories_goal_percentage?: number | null
          created_at?: string
          date?: string
          exercise_goal_percentage?: number | null
          id?: string
          overall_progress_percentage?: number | null
          sleep_goal_percentage?: number | null
          user_id?: string
          water_goal_percentage?: number | null
        }
        Relationships: []
      }
      exercise_records: {
        Row: {
          calories_burned: number | null
          duration_minutes: number
          exercise_type: string
          id: string
          intensity: string | null
          recorded_at: string
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          duration_minutes: number
          exercise_type: string
          id?: string
          intensity?: string | null
          recorded_at?: string
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          duration_minutes?: number
          exercise_type?: string
          id?: string
          intensity?: string | null
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          created_at: string
          id: string
          ingredients: string
          meal_id: string | null
          meals: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ingredients: string
          meal_id?: string | null
          meals?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ingredients?: string
          meal_id?: string | null
          meals?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      meal_plan_items: {
        Row: {
          created_at: string
          day_of_week: string
          id: string
          meal_id: string
          meal_plan_id: string
          meal_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: string
          id?: string
          meal_id: string
          meal_plan_id: string
          meal_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: string
          id?: string
          meal_id?: string
          meal_plan_id?: string
          meal_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
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
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      meal_subcategories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          image_url: string | null
          meal_name: string
          subcategory_id: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          meal_name: string
          subcategory_id?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          meal_name?: string
          subcategory_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "meal_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meals_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "meal_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_facts: {
        Row: {
          added_sugars: string | null
          additional_nutrients: Json | null
          calcium: string | null
          calories: string | null
          cholesterol: string | null
          created_at: string
          dietary_fiber: string | null
          folate: string | null
          id: string
          iron: string | null
          magnesium: string | null
          meal_name: string
          niacin: string | null
          potassium: string | null
          protein: string | null
          saturated_fat: string | null
          serving_size: string | null
          serving_size_gram: string | null
          sodium: string | null
          thiamin: string | null
          total_carbohydrate: string | null
          total_fat: string | null
          total_sugars: string | null
          trans_fat: string | null
          updated_at: string
          vitamin_a: string | null
          vitamin_c: string | null
          vitamin_e: string | null
          vitamin_k: string | null
        }
        Insert: {
          added_sugars?: string | null
          additional_nutrients?: Json | null
          calcium?: string | null
          calories?: string | null
          cholesterol?: string | null
          created_at?: string
          dietary_fiber?: string | null
          folate?: string | null
          id?: string
          iron?: string | null
          magnesium?: string | null
          meal_name: string
          niacin?: string | null
          potassium?: string | null
          protein?: string | null
          saturated_fat?: string | null
          serving_size?: string | null
          serving_size_gram?: string | null
          sodium?: string | null
          thiamin?: string | null
          total_carbohydrate?: string | null
          total_fat?: string | null
          total_sugars?: string | null
          trans_fat?: string | null
          updated_at?: string
          vitamin_a?: string | null
          vitamin_c?: string | null
          vitamin_e?: string | null
          vitamin_k?: string | null
        }
        Update: {
          added_sugars?: string | null
          additional_nutrients?: Json | null
          calcium?: string | null
          calories?: string | null
          cholesterol?: string | null
          created_at?: string
          dietary_fiber?: string | null
          folate?: string | null
          id?: string
          iron?: string | null
          magnesium?: string | null
          meal_name?: string
          niacin?: string | null
          potassium?: string | null
          protein?: string | null
          saturated_fat?: string | null
          serving_size?: string | null
          serving_size_gram?: string | null
          sodium?: string | null
          thiamin?: string | null
          total_carbohydrate?: string | null
          total_fat?: string | null
          total_sugars?: string | null
          trans_fat?: string | null
          updated_at?: string
          vitamin_a?: string | null
          vitamin_c?: string | null
          vitamin_e?: string | null
          vitamin_k?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: string | null
          allergies: string | null
          calorie_goal: string | null
          created_at: string | null
          dietary_restrictions: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          health_goals: string | null
          height: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
          username: string | null
          weight: string | null
        }
        Insert: {
          activity_level?: string | null
          age?: string | null
          allergies?: string | null
          calorie_goal?: string | null
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          health_goals?: string | null
          height?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
          weight?: string | null
        }
        Update: {
          activity_level?: string | null
          age?: string | null
          allergies?: string | null
          calorie_goal?: string | null
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          health_goals?: string | null
          height?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string | null
          meal: string | null
          quantity: string | null
          recipe_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          meal?: string | null
          quantity?: string | null
          recipe_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          meal?: string | null
          quantity?: string | null
          recipe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string
          id: string
          instructions: string | null
          meal_id: string | null
          meal_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instructions?: string | null
          meal_id?: string | null
          meal_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instructions?: string | null
          meal_id?: string | null
          meal_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          achieved: boolean
          date_achieved: string
          description: string
          icon: string
          id: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          achieved?: boolean
          date_achieved?: string
          description: string
          icon: string
          id?: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          achieved?: boolean
          date_achieved?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_records: {
        Row: {
          hours_slept: number
          id: string
          recorded_at: string
          sleep_end: string | null
          sleep_quality: string | null
          sleep_start: string | null
          user_id: string
        }
        Insert: {
          hours_slept: number
          id?: string
          recorded_at?: string
          sleep_end?: string | null
          sleep_quality?: string | null
          sleep_start?: string | null
          user_id: string
        }
        Update: {
          hours_slept?: number
          id?: string
          recorded_at?: string
          sleep_end?: string | null
          sleep_quality?: string | null
          sleep_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          dark_mode: boolean
          email_notifications: boolean
          id: string
          language: string
          notifications: boolean
          use_metric_system: boolean
          user_id: string
        }
        Insert: {
          dark_mode?: boolean
          email_notifications?: boolean
          id?: string
          language?: string
          notifications?: boolean
          use_metric_system?: boolean
          user_id: string
        }
        Update: {
          dark_mode?: boolean
          email_notifications?: boolean
          id?: string
          language?: string
          notifications?: boolean
          use_metric_system?: boolean
          user_id?: string
        }
        Relationships: []
      }
      water_intake_records: {
        Row: {
          cups_consumed: number
          daily_goal: number
          id: string
          recorded_at: string
          user_id: string
        }
        Insert: {
          cups_consumed: number
          daily_goal?: number
          id?: string
          recorded_at?: string
          user_id: string
        }
        Update: {
          cups_consumed?: number
          daily_goal?: number
          id?: string
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      meal_moods: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          mood: string;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          mood: string;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          mood?: string;
          recorded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meal_moods_meal_id_fkey";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "meals";
            referencedColumns: ["id"];
          }
        ];
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_meal_image_url: {
        Args: { image_path: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
