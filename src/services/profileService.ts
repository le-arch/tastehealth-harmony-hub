
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  age?: string;
  height?: string;
  weight?: string;
  gender?: string;
  activity_level?: string;
  health_goals?: string;
  dietary_restrictions?: string;
  allergies?: string;
  calorie_goal?: string;
}

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error('Failed to fetch profile', {
      description: error.message || 'Please try again'
    });
    return null;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    toast.success('Profile Updated', {
      description: 'Your profile has been successfully updated'
    });

    return data;
  } catch (error: any) {
    toast.error('Failed to update profile', {
      description: error.message || 'Please try again'
    });
    return null;
  }
};
