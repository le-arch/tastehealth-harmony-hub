import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// BMI Tracking
export interface BMIRecord {
  id?: string;
  user_id: string;
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  status: 'underweight' | 'normal' | 'overweight' | 'obese';
  recorded_at?: string;
}

// Water Intake Tracking
export interface WaterIntakeRecord {
  id?: string;
  user_id: string;
  cups_consumed: number;
  daily_goal: number;
  recorded_at?: string;
}

// Sleep Tracking
export interface SleepRecord {
  id?: string;
  user_id: string;
  hours_slept: number;
  sleep_quality?: 'poor' | 'fair' | 'good' | 'excellent';
  sleep_start?: string;
  sleep_end?: string;
  recorded_at?: string;
}

// Calories Tracking
export interface CalorieRecord {
  id?: string;
  user_id: string;
  calories_consumed: number;
  calories_goal: number;
  protein_grams?: number;
  carbs_grams?: number;
  fat_grams?: number;
  recorded_date?: string;
  created_at?: string;
}

// Exercise Tracking
export interface ExerciseRecord {
  id?: string;
  user_id: string;
  exercise_type: string;
  duration_minutes: number;
  calories_burned?: number;
  intensity?: 'low' | 'medium' | 'high';
  recorded_at?: string;
}

// Daily Progress Summary
export interface DailyProgress {
  id?: string;
  user_id: string;
  date?: string;
  water_goal_percentage?: number;
  sleep_goal_percentage?: number;
  calories_goal_percentage?: number;
  exercise_goal_percentage?: number;
  overall_progress_percentage?: number;
  created_at?: string;
}

// BMI Functions
export const calculateBMI = (height: number, weight: number): { bmi: number, status: BMIRecord['status'] } => {
  // Height in cm, weight in kg
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let status: BMIRecord['status'];
  if (bmi < 18.5) {
    status = 'underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    status = 'normal';
  } else if (bmi >= 25 && bmi < 30) {
    status = 'overweight';
  } else {
    status = 'obese';
  }
  
  return { bmi: parseFloat(bmi.toFixed(2)), status };
};

export const saveBMIRecord = async (height: number, weight: number): Promise<BMIRecord | null> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      toast.error("Authentication Error", {
        description: "You must be logged in to track your BMI."
      });
      return null;
    }
    
    const { bmi, status } = calculateBMI(height, weight);
    
    const record: BMIRecord = {
      user_id: userId,
      height,
      weight,
      bmi,
      status,
    };
    
    const { data, error } = await supabase
      .from('bmi_records')
      .insert(record)
      .select()
      .single();
      
    if (error) {
      toast.error("Error Saving BMI Record", {
        description: error.message
      });
      return null;
    }
    
    toast.success("BMI Record Saved", {
      description: `Your BMI is ${bmi} (${status})`
    });
    
    return {
      ...data,
      status: data.status as BMIRecord['status']
    };
  } catch (error: any) {
    toast.error("Error Saving BMI Record", {
      description: error.message
    });
    return null;
  }
};

export const getBMIHistory = async (limit = 10): Promise<BMIRecord[]> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('bmi_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      toast.error("Error Fetching BMI History", {
        description: error.message
      });
      return [];
    }
    
    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      status: item.status as BMIRecord['status']
    }));
  } catch (error: any) {
    console.error("Error fetching BMI history:", error);
    return [];
  }
};

// Water Intake Functions
export const saveWaterIntake = async (cups: number): Promise<WaterIntakeRecord | null> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      toast.error("Authentication Error", {
        description: "You must be logged in to track your water intake."
      });
      return null;
    }
    
    const record: WaterIntakeRecord = {
      user_id: userId,
      cups_consumed: cups,
      daily_goal: 8, // Default value
    };
    
    const { data, error } = await supabase
      .from('water_intake_records')
      .insert(record)
      .select()
      .single();
      
    if (error) {
      toast.error("Error Saving Water Intake", {
        description: error.message
      });
      return null;
    }
    
    toast.success("Water Intake Recorded", {
      description: `You've consumed ${cups} cups of water.`
    });
    
    return data;
  } catch (error: any) {
    toast.error("Error Saving Water Intake", {
      description: error.message
    });
    return null;
  }
};

export const getWaterIntakeToday = async (): Promise<number> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      return 0;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('water_intake_records')
      .select('cups_consumed')
      .eq('user_id', userId)
      .gte('recorded_at', today.toISOString());
      
    if (error) {
      console.error("Error fetching water intake:", error);
      return 0;
    }
    
    // Sum up all cups consumed today
    return data?.reduce((sum, record) => sum + (record.cups_consumed || 0), 0) || 0;
  } catch (error: any) {
    console.error("Error fetching water intake:", error);
    return 0;
  }
};

// Sleep Tracking Functions
export const saveSleepRecord = async (
  hoursSlept: number, 
  quality?: SleepRecord['sleep_quality'],
  sleepStart?: Date,
  sleepEnd?: Date
): Promise<SleepRecord | null> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      toast.error("Authentication Error", {
        description: "You must be logged in to track your sleep."
      });
      return null;
    }
    
    const record: SleepRecord = {
      user_id: userId,
      hours_slept: hoursSlept,
      sleep_quality: quality,
      sleep_start: sleepStart?.toISOString(),
      sleep_end: sleepEnd?.toISOString(),
    };
    
    const { data, error } = await supabase
      .from('sleep_records')
      .insert(record)
      .select()
      .single();
      
    if (error) {
      toast.error("Error Saving Sleep Record", {
        description: error.message
      });
      return null;
    }
    
    toast.success("Sleep Record Saved", {
      description: `You slept for ${hoursSlept} hours.`
    });
    
    // Cast the data to the correct type
    return {
      ...data,
      sleep_quality: data.sleep_quality as SleepRecord['sleep_quality'] | undefined
    };
  } catch (error: any) {
    toast.error("Error Saving Sleep Record", {
      description: error.message
    });
    return null;
  }
};

export const getSleepHistory = async (limit = 7): Promise<SleepRecord[]> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('sleep_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching sleep history:", error);
      return [];
    }
    
    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      sleep_quality: item.sleep_quality as SleepRecord['sleep_quality'] | undefined
    }));
  } catch (error: any) {
    console.error("Error fetching sleep history:", error);
    return [];
  }
};

// Calories Tracking Functions
export const saveCalorieRecord = async (
  caloriesConsumed: number,
  caloriesGoal = 2000,
  protein?: number,
  carbs?: number,
  fat?: number
): Promise<CalorieRecord | null> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      toast.error("Authentication Error", {
        description: "You must be logged in to track your calories."
      });
      return null;
    }
    
    const record: CalorieRecord = {
      user_id: userId,
      calories_consumed: caloriesConsumed,
      calories_goal: caloriesGoal,
      protein_grams: protein,
      carbs_grams: carbs,
      fat_grams: fat,
    };
    
    const { data, error } = await supabase
      .from('calorie_records')
      .insert(record)
      .select()
      .single();
      
    if (error) {
      toast.error("Error Saving Calorie Record", {
        description: error.message
      });
      return null;
    }
    
    toast.success("Calorie Record Saved", {
      description: `You've consumed ${caloriesConsumed} calories today.`
    });
    
    return data;
  } catch (error: any) {
    toast.error("Error Saving Calorie Record", {
      description: error.message
    });
    return null;
  }
};

export const getCalorieHistory = async (days = 7): Promise<CalorieRecord[]> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      return [];
    }
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const { data, error } = await supabase
      .from('calorie_records')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_date', daysAgo.toISOString().split('T')[0])
      .order('recorded_date', { ascending: false });
      
    if (error) {
      console.error("Error fetching calorie history:", error);
      return [];
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching calorie history:", error);
    return [];
  }
};

// Exercise Tracking Functions
export const saveExerciseRecord = async (
  exerciseType: string,
  durationMinutes: number,
  caloriesBurned?: number,
  intensity?: ExerciseRecord['intensity']
): Promise<ExerciseRecord | null> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      toast.error("Authentication Error", {
        description: "You must be logged in to track your exercises."
      });
      return null;
    }
    
    const record: ExerciseRecord = {
      user_id: userId,
      exercise_type: exerciseType,
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
      intensity: intensity,
    };
    
    const { data, error } = await supabase
      .from('exercise_records')
      .insert(record)
      .select()
      .single();
      
    if (error) {
      toast.error("Error Saving Exercise Record", {
        description: error.message
      });
      return null;
    }
    
    toast.success("Exercise Record Saved", {
      description: `You've completed ${durationMinutes} minutes of ${exerciseType}.`
    });
    
    // Cast the data to the correct type
    return {
      ...data,
      intensity: data.intensity as ExerciseRecord['intensity'] | undefined
    };
  } catch (error: any) {
    toast.error("Error Saving Exercise Record", {
      description: error.message
    });
    return null;
  }
};

export const getExerciseHistory = async (limit = 10): Promise<ExerciseRecord[]> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('exercise_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching exercise history:", error);
      return [];
    }
    
    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      intensity: item.intensity as ExerciseRecord['intensity'] | undefined
    }));
  } catch (error: any) {
    console.error("Error fetching exercise history:", error);
    return [];
  }
};

// Daily Progress Functions
export const updateDailyProgress = async (): Promise<DailyProgress | null> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      return null;
    }
    
    // Fetch today's data
    const waterIntake = await getWaterIntakeToday();
    const waterPercentage = (waterIntake / 8) * 100; // 8 cups is the goal
    
    // Get today's sleep record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: sleepData } = await supabase
      .from('sleep_records')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', today.toISOString())
      .order('recorded_at', { ascending: false })
      .limit(1);
      
    const sleepPercentage = sleepData && sleepData.length > 0
      ? (sleepData[0].hours_slept / 8) * 100 // 8 hours is the goal
      : 0;
      
    // Get today's calorie record
    const { data: calorieData } = await supabase
      .from('calorie_records')
      .select('*')
      .eq('user_id', userId)
      .eq('recorded_date', today.toISOString().split('T')[0])
      .order('created_at', { ascending: false })
      .limit(1);
      
    const caloriePercentage = calorieData && calorieData.length > 0
      ? (calorieData[0].calories_consumed / calorieData[0].calories_goal) * 100
      : 0;
      
    // Get today's exercise records
    const { data: exerciseData } = await supabase
      .from('exercise_records')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', today.toISOString());
      
    const totalExerciseMinutes = exerciseData
      ? exerciseData.reduce((sum, record) => sum + record.duration_minutes, 0)
      : 0;
      
    const exercisePercentage = Math.min((totalExerciseMinutes / 30) * 100, 100); // 30 minutes is the goal
    
    // Calculate overall progress
    const overallPercentage = (waterPercentage + sleepPercentage + caloriePercentage + exercisePercentage) / 4;
    
    // Check if a record exists for today
    const { data: existingRecord } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today.toISOString().split('T')[0]);
      
    let result;
    
    if (existingRecord && existingRecord.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('daily_progress')
        .update({
          water_goal_percentage: waterPercentage,
          sleep_goal_percentage: sleepPercentage,
          calories_goal_percentage: caloriePercentage,
          exercise_goal_percentage: exercisePercentage,
          overall_progress_percentage: overallPercentage,
        })
        .eq('id', existingRecord[0].id)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating daily progress:", error);
        return null;
      }
      
      result = data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('daily_progress')
        .insert({
          user_id: userId,
          date: today.toISOString().split('T')[0],
          water_goal_percentage: waterPercentage,
          sleep_goal_percentage: sleepPercentage,
          calories_goal_percentage: caloriePercentage,
          exercise_goal_percentage: exercisePercentage,
          overall_progress_percentage: overallPercentage,
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error creating daily progress:", error);
        return null;
      }
      
      result = data;
    }
    
    return result;
  } catch (error: any) {
    console.error("Error updating daily progress:", error);
    return null;
  }
};

export const getProgressHistory = async (days = 7): Promise<DailyProgress[]> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      return [];
    }
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const { data, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('date', daysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });
      
    if (error) {
      console.error("Error fetching progress history:", error);
      return [];
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching progress history:", error);
    return [];
  }
};
