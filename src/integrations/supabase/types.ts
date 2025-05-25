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
      app_feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          active: boolean | null
          category: string
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          points: number | null
          rarity: string | null
          requirement_count: number | null
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          points?: number | null
          rarity?: string | null
          requirement_count?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number | null
          rarity?: string | null
          requirement_count?: number | null
        }
        Relationships: []
      }
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
          user_id: string
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
      challenge_progress: {
        Row: {
          challenge_id: string
          created_at: string
          days_completed: number
          id: string
          last_completed_at: string
          total_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          days_completed?: number
          id?: string
          last_completed_at?: string
          total_days: number
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          days_completed?: number
          id?: string
          last_completed_at?: string
          total_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "nutrition_challenges"
            referencedColumns: ["id"]
          },
        ]
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
      daily_streaks: {
        Row: {
          created_at: string | null
          date: string
          id: string
          streak_count: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          streak_count?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          streak_count?: number
          updated_at?: string | null
          user_id?: string
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
      favorites: {
        Row: {
          created_at: string
          id: string
          meal_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
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
      meal_moods: {
        Row: {
          created_at: string
          id: string
          meal_id: string
          meal_name: string
          mood: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_id: string
          meal_name: string
          mood: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_id?: string
          meal_name?: string
          mood?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_moods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          day_of_week: string
          id?: string
          meal_id: string
          meal_plan_id: string
          meal_time: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          day_of_week?: string
          id?: string
          meal_id?: string
          meal_plan_id?: string
          meal_time?: string
          updated_at?: string
          user_id?: string | null
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
      notification_settings: {
        Row: {
          current_type: string
          id: number
          updated_at: string | null
        }
        Insert: {
          current_type?: string
          id: number
          updated_at?: string | null
        }
        Update: {
          current_type?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      nutrition_challenges: {
        Row: {
          created_at: string
          difficulty_level: number
          duration_days: number
          id: string
          name: string
          types: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty_level: number
          duration_days: number
          id?: string
          name: string
          types: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty_level?: number
          duration_days?: number
          id?: string
          name?: string
          types?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          meal_id: string | null
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
          meal_id?: string | null
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
          meal_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "fk_meal"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_quests: {
        Row: {
          active: boolean
          category: string
          created_at: string | null
          description: string
          difficulty: string
          icon: string | null
          id: string
          is_daily: boolean
          points: number
          requirements: Json
          reset_frequency: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string | null
          description: string
          difficulty?: string
          icon?: string | null
          id?: string
          is_daily?: boolean
          points?: number
          requirements?: Json
          reset_frequency?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          icon?: string | null
          id?: string
          is_daily?: boolean
          points?: number
          requirements?: Json
          reset_frequency?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          points: number
          reason: string
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points: number
          reason: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points?: number
          reason?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
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
      quests: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string
          difficulty: string
          duration_days: number
          icon: string | null
          id: string
          quest_type: string | null
          rewards: Json
          steps: Json
          title: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description: string
          difficulty?: string
          duration_days?: number
          icon?: string | null
          id?: string
          quest_type?: string | null
          rewards: Json
          steps: Json
          title: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string
          duration_days?: number
          icon?: string | null
          id?: string
          quest_type?: string | null
          rewards?: Json
          steps?: Json
          title?: string
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
          recipe_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          meal?: string | null
          quantity?: string | null
          recipe_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          meal?: string | null
          quantity?: string | null
          recipe_id?: string
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
          ingredients: string | null
          instructions: string | null
          meal_id: string | null
          meal_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredients?: string | null
          instructions?: string | null
          meal_id?: string | null
          meal_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredients?: string | null
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
      user_badges: {
        Row: {
          badge_id: string
          id: string
          is_equipped: boolean | null
          progress: number | null
          total: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          is_equipped?: boolean | null
          progress?: number | null
          total?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          is_equipped?: boolean | null
          progress?: number | null
          total?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_levels: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          level: number
          max_points: number
          min_points: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          level: number
          max_points: number
          min_points: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          level?: number
          max_points?: number
          min_points?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_nutrition_quests: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          quest_id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          quest_id: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          quest_id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_nutrition_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "nutrition_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string | null
          current_level: number
          id: string
          level: number
          points_to_next_level: number
          total_points: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_level?: number
          id?: string
          level?: number
          points_to_next_level?: number
          total_points?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_level?: number
          id?: string
          level?: number
          points_to_next_level?: number
          total_points?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_quests: {
        Row: {
          completed_at: string | null
          current_step: number | null
          id: string
          progress: Json | null
          quest_id: string
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          id?: string
          progress?: Json | null
          quest_id: string
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          id?: string
          progress?: Json | null
          quest_id?: string
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          p_user_id: string
          p_points: number
          p_reason: string
          p_reference_id?: string
          p_reference_type?: string
          p_metadata?: Json
        }
        Returns: string
      }
      calculate_bmi: {
        Args: { height_cm: number; weight_kg: number }
        Returns: number
      }
      calculate_user_level: {
        Args: { points: number }
        Returns: number
      }
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      complete_challenge_task: {
        Args: { p_user_id: string; p_challenge_id: string }
        Returns: boolean
      }
      create_app_feedback_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_nutrition_challenge: {
        Args: {
          p_user_id: string
          p_name: string
          p_types: string[]
          p_duration_days: number
          p_difficulty_level: number
        }
        Returns: string
      }
      create_user_points_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_bmi_status: {
        Args: { bmi: number }
        Returns: string
      }
      get_meal_image_url: {
        Args: { image_path: string }
        Returns: string
      }
      record_points_transaction: {
        Args:
          | {
              p_user_id: string
              p_points: number
              p_transaction_type: string
              p_reason: string
              p_reference_id?: string
              p_reference_type?: string
              p_metadata?: Json
            }
          | {
              p_user_id: string
              p_points: number
              p_transaction_type: string
              p_reason: string
              p_reference_id?: string
              p_reference_type?: string
              p_metadata?: Json
            }
        Returns: string
      }
      update_daily_progress: {
        Args: { user_id_param: string }
        Returns: undefined
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
