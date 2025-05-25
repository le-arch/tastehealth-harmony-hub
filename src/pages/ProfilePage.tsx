import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Calendar,
  Ruler,
  Leaf,
  Weight,
  Users,
  Activity,
  Target,
  Salad,
  Flame,
  ChevronLeft,
  Save,
} from "lucide-react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import GenderSelect from "@/components/profile/GenderSelect";
import ActivityLevelSelect from "@/components/profile/ActivityLevelSelect";
import HealthGoalsSelect from "@/components/profile/HealthGoalsSelect";
import DietaryRestrictionsSelect from "@/components/profile/DietaryRestrictionsSelect";
import { getCurrentUser } from "@/services/authService";
import {
  fetchUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/services/profileService";
//import TasteHealthLoader from '@/components/TastehealthLoader';

const formSchema = z.object({
  age: z.string().min(1, "Age is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  gender: z.string().min(1, "Gender is required"),
  activityLevel: z.string().min(1, "Activity level is required"),
  healthGoals: z.string().min(1, "Health goals are required"),
  dietaryRestrictions: z.string(),
  allergies: z.string(),
  calorieGoal: z.string().min(1, "Calorie goal is required"),
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  //const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      height: "",
      weight: "",
      gender: "",
      activityLevel: "",
      healthGoals: "",
      dietaryRestrictions: "",
      allergies: "",
      calorieGoal: "",
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        //setIsLoading(true);
        const user = await getCurrentUser();

        if (!user) {
          navigate("/");
          return;
        }

        const profile = await fetchUserProfile(user.id);

        if (profile) {
          setUserProfile(profile);

          form.reset({
            age: profile.age || "",
            height: profile.height || "",
            weight: profile.weight || "",
            gender: profile.gender || "",
            activityLevel: profile.activity_level || "",
            healthGoals: profile.health_goals || "",
            dietaryRestrictions: profile.dietary_restrictions || "",
            allergies: profile.allergies || "",
            calorieGoal: profile.calorie_goal || "",
          });
        } else {
          toast.error("Could not load profile data");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Error loading profile data");
      } finally {
        //setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      //setIsLoading(true);

      console.log("Saving profile data:", values);

      if (!userProfile?.id) {
        toast.error("User ID not found");
        return;
      }

      const updatedData = {
        age: values.age,
        height: values.height,
        weight: values.weight,
        gender: values.gender,
        activity_level: values.activityLevel,
        health_goals: values.healthGoals,
        dietary_restrictions: values.dietaryRestrictions,
        allergies: values.allergies,
        calorie_goal: values.calorieGoal,
      };

      const updated = await updateUserProfile(userProfile.id, updatedData);

      if (updated) {
        setUserProfile({
          ...userProfile,
          ...updatedData,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      // setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // if (isLoading && !userProfile) {
  //   return <TasteHealthLoader />;
  // }

  const formatActivityLevel = (level: string) => {
    if (!level) return "Not set";

    switch (level) {
      case "sedentary":
        return "Sedentary (little or no exercise)";
      case "lightly-active":
        return "Lightly Active (light exercise 1-3 days/week)";
      case "moderately-active":
        return "Moderately Active (moderate exercise 3-5 days/week)";
      case "very-active":
        return "Very Active (hard exercise 6-7 days/week)";
      case "extra-active":
        return "Extra Active (very hard exercise & physical job)";
      default:
        return level;
    }
  };

  const formatHealthGoals = (goal: string) => {
    if (!goal) return "Not set";

    switch (goal) {
      case "weight-loss":
        return "Weight Loss";
      case "weight-gain":
        return "Weight Gain";
      case "maintain":
        return "Maintain Weight";
      case "muscle-gain":
        return "Muscle Gain";
      case "overall-health":
        return "Overall Health";
      default:
        return goal;
    }
  };

  const formatDietaryRestrictions = (restrictions: string) => {
    if (!restrictions) return "None";

    const restrictionLabels: Record<string, string> = {
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      "gluten-free": "Gluten-Free",
      "dairy-free": "Dairy-Free",
      "nut-free": "Nut-Free",
      pescatarian: "Pescatarian",
      keto: "Keto",
      paleo: "Paleo",
    };

    return restrictions
      .split(",")
      .map((r) => restrictionLabels[r] || r)
      .join(", ");
  };

  return (
    <div className="min-h-screen flex">
      <ProfileSidebar activePage="profile" />

      <div className="flex-1 p-4 sm:ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center">
            <Button
              variant="ghost"
              className="mr-4"
              onClick={handleBackToDashboard}
            >
              {/* <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard */}
            </Button>
            <h1 className="text-2xl font-semibold flex items-center">
              <User className="mr-2 h-6 w-6 text-th-green-600" />
              Profile Management
            </h1>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Personal Information</span>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardTitle>
              <CardDescription>
                View and update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Name
                      </h3>
                      <p className="text-base">
                        {userProfile?.first_name || ""}{" "}
                        {userProfile?.last_name || ""}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="text-base">{userProfile?.email || ""}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        Age
                      </h3>
                      <p className="text-base">
                        {userProfile?.age || "Not set"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        Gender
                      </h3>
                      <p className="text-base">
                        {userProfile?.gender || "Not set"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Ruler className="h-4 w-4 mr-1 text-gray-400" />
                        Height
                      </h3>
                      <p className="text-base">
                        {userProfile?.height || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Weight className="h-4 w-4 mr-1 text-gray-400" />
                        Weight
                      </h3>
                      <p className="text-base">
                        {userProfile?.weight || "Not set"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Activity className="h-4 w-4 mr-1 text-gray-400" />
                        Activity Level
                      </h3>
                      <p className="text-base">
                        {formatActivityLevel(userProfile?.activity_level || "")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Target className="h-4 w-4 mr-1 text-gray-400" />
                        Health Goals
                      </h3>
                      <p className="text-base">
                        {formatHealthGoals(userProfile?.health_goals || "")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Leaf className="h-4 w-4 mr-1 text-gray-400" />
                        Allergies
                      </h3>
                      <p className="text-base">
                        {userProfile?.allergies || "None"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Salad className="h-4 w-4 mr-1 text-gray-400" />
                        Dietary Restrictions
                      </h3>
                      <p className="text-base">
                        {formatDietaryRestrictions(
                          userProfile?.dietary_restrictions || ""
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Flame className="h-4 w-4 mr-1 text-gray-400" />
                        Daily Calorie Goal
                      </h3>
                      <p className="text-base">
                        {userProfile?.calorie_goal || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              Age
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your age" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-gray-400" />
                              Gender
                            </FormLabel>
                            <FormControl>
                              <GenderSelect
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Ruler className="h-4 w-4 mr-1 text-gray-400" />
                              Height (cm)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your height"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Weight className="h-4 w-4 mr-1 text-gray-400" />
                              Weight (kg)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your weight"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Activity className="h-4 w-4 mr-1 text-gray-400" />
                              Activity Level
                            </FormLabel>
                            <FormControl>
                              <ActivityLevelSelect
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="calorieGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Flame className="h-4 w-4 mr-1 text-gray-400" />
                              Daily Calorie Goal
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., 2000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="healthGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Target className="h-4 w-4 mr-1 text-gray-400" />
                            Health Goals
                          </FormLabel>
                          <FormControl>
                            <HealthGoalsSelect
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Leaf className="h-4 w-4 mr-1 text-gray-400" />
                            Allergies
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="E.g., Nuts, Dairy, Shellfish"
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dietaryRestrictions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Salad className="h-4 w-4 mr-1 text-gray-400" />
                            Dietary Restrictions
                          </FormLabel>
                          <FormControl>
                            <DietaryRestrictionsSelect
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      // disabled={isLoading}
                    >
                      <Save className="mr-1 h-4 w-4" />
                      {/* {isLoading ? "Saving..." : "Save Profile"} */}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
