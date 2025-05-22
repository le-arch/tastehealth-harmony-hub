
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GenderSelect } from '@/components/profile/GenderSelect';
import { ActivityLevelSelect } from '@/components/profile/ActivityLevelSelect';
import { HealthGoalsSelect } from '@/components/profile/HealthGoalsSelect';
import { DietaryRestrictionsSelect } from '@/components/profile/DietaryRestrictionsSelect';
import { UserProfile, fetchUserProfile, updateUserProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/settings/LanguageSelector';

interface ProfileValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  age: string;
  height: string;
  weight: string;
  gender: string;
  activityLevel: string;
  healthGoals: string;
  dietaryRestrictions: string;
  allergies: string;
  calorieGoal: string;
}

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<ProfileValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    activityLevel: '',
    healthGoals: '',
    dietaryRestrictions: '',
    allergies: '',
    calorieGoal: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      pageTitle: "Profile",
      personalInfo: "Personal Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone Number",
      username: "Username",
      healthMetrics: "Health Metrics",
      age: "Age",
      height: "Height (cm)",
      weight: "Weight (kg)",
      gender: "Gender",
      activityLevel: "Activity Level",
      nutritionPreferences: "Nutrition Preferences",
      healthGoals: "Health Goals",
      dietaryRestrictions: "Dietary Restrictions",
      allergies: "Allergies",
      calorieGoal: "Daily Calorie Goal",
      languagePreference: "Language Preference",
      english: "English",
      french: "French",
      saveChanges: "Save Changes",
      profileUpdated: "Profile Updated",
      profileUpdateSuccess: "Your profile has been successfully updated",
      notAuthenticated: "You need to be logged in to view this page",
      errorLoading: "Error loading profile",
      errorUpdating: "Error updating profile"
    },
    fr: {
      pageTitle: "Profil",
      personalInfo: "Informations Personnelles",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Numéro de Téléphone",
      username: "Nom d'Utilisateur",
      healthMetrics: "Mesures de Santé",
      age: "Âge",
      height: "Taille (cm)",
      weight: "Poids (kg)",
      gender: "Genre",
      activityLevel: "Niveau d'Activité",
      nutritionPreferences: "Préférences Nutritionnelles",
      healthGoals: "Objectifs de Santé",
      dietaryRestrictions: "Restrictions Alimentaires",
      allergies: "Allergies",
      calorieGoal: "Objectif Calorique Quotidien",
      languagePreference: "Préférence de Langue",
      english: "Anglais",
      french: "Français",
      saveChanges: "Sauvegarder les Modifications",
      profileUpdated: "Profil Mis à Jour",
      profileUpdateSuccess: "Votre profil a été mis à jour avec succès",
      notAuthenticated: "Vous devez être connecté pour voir cette page",
      errorLoading: "Erreur lors du chargement du profil",
      errorUpdating: "Erreur lors de la mise à jour du profil"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          const profile = await fetchUserProfile(user.id);
          
          if (profile) {
            setProfileData({
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              email: profile.email || '',
              phone: profile.phone || '',
              username: profile.username || '',
              age: profile.age || '',
              height: profile.height || '',
              weight: profile.weight || '',
              gender: profile.gender || '',
              activityLevel: profile.activity_level || '',
              healthGoals: profile.health_goals || '',
              dietaryRestrictions: profile.dietary_restrictions || '',
              allergies: profile.allergies || '',
              calorieGoal: profile.calorie_goal || ''
            });
          }
        } else {
          toast({
            title: t.notAuthenticated,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: t.errorLoading,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, [language, t, toast]);
  
  const handleSaveProfile = async () => {
    if (!userId) return;
    
    try {
      await updateUserProfile(userId, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        username: profileData.username,
        age: profileData.age,
        height: profileData.height,
        weight: profileData.weight,
        gender: profileData.gender,
        activity_level: profileData.activityLevel,
        health_goals: profileData.healthGoals,
        dietary_restrictions: profileData.dietaryRestrictions,
        allergies: profileData.allergies,
        calorie_goal: profileData.calorieGoal
      });
      
      toast({
        title: t.profileUpdated,
        description: t.profileUpdateSuccess
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t.errorUpdating,
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    
    // Save language preference to user_settings if user is authenticated
    if (userId) {
      try {
        const { data: existingSettings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (existingSettings) {
          // Update existing settings
          await supabase
            .from('user_settings')
            .update({ language: newLanguage })
            .eq('user_id', userId);
        } else {
          // Create new settings
          await supabase
            .from('user_settings')
            .insert({ user_id: userId, language: newLanguage });
        }
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 flex">
      <ProfileSidebar activePage="profile" />
      
      <div className="flex-1 p-6 md:ml-64 mt-16 md:mt-0 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.pageTitle}</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.personalInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.firstName}</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.lastName}</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input 
                    id="email" 
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">{t.username}</Label>
                <Input 
                  id="username" 
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t.healthMetrics}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">{t.age}</Label>
                  <Input 
                    id="age" 
                    name="age"
                    type="number"
                    value={profileData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">{t.height}</Label>
                  <Input 
                    id="height" 
                    name="height"
                    type="number"
                    value={profileData.height}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">{t.weight}</Label>
                  <Input 
                    id="weight" 
                    name="weight"
                    type="number"
                    value={profileData.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.gender}</Label>
                  <GenderSelect
                    value={profileData.gender}
                    onChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.activityLevel}</Label>
                  <ActivityLevelSelect 
                    value={profileData.activityLevel}
                    onChange={(value) => setProfileData(prev => ({ ...prev, activityLevel: value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t.nutritionPreferences}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t.healthGoals}</Label>
                <HealthGoalsSelect 
                  value={profileData.healthGoals}
                  onChange={(value) => setProfileData(prev => ({ ...prev, healthGoals: value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t.dietaryRestrictions}</Label>
                <DietaryRestrictionsSelect 
                  value={profileData.dietaryRestrictions}
                  onChange={(value) => setProfileData(prev => ({ ...prev, dietaryRestrictions: value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">{t.allergies}</Label>
                <Input 
                  id="allergies" 
                  name="allergies"
                  value={profileData.allergies}
                  onChange={handleChange}
                  placeholder="e.g., nuts, shellfish, dairy"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calorieGoal">{t.calorieGoal}</Label>
                <Input 
                  id="calorieGoal" 
                  name="calorieGoal"
                  type="number"
                  value={profileData.calorieGoal}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 pt-4">
                <LanguageSelector 
                  currentLanguage={language}
                  onLanguageChange={handleLanguageChange}
                  label={t.languagePreference}
                  englishLabel={t.english}
                  frenchLabel={t.french}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} className="px-8">
              {t.saveChanges}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
