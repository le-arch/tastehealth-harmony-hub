
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import GenderSelect from "@/components/profile/GenderSelect";
import ActivityLevelSelect from "@/components/profile/ActivityLevelSelect";
import HealthGoalsSelect from "@/components/profile/HealthGoalsSelect";
import DietaryRestrictionsSelect from "@/components/profile/DietaryRestrictionsSelect";
import { getLS, setLS, LS_KEYS, ProfileData } from "@/utils/localStorage";

const formSchema = z.object({
  age: z.string().min(1, "Age is required"), height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"), gender: z.string().min(1, "Gender is required"),
  activityLevel: z.string().min(1, "Activity level is required"), healthGoals: z.string().min(1, "Health goals are required"),
  dietaryRestrictions: z.string(), allergies: z.string(), calorieGoal: z.string().min(1, "Calorie goal is required"),
});

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const saved = getLS<ProfileData | null>(LS_KEYS.PROFILE, null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: saved || { age: "", height: "", weight: "", gender: "", activityLevel: "", healthGoals: "", dietaryRestrictions: "", allergies: "", calorieGoal: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLS(LS_KEYS.PROFILE, values);
    toast.success("Profile saved!");
    setIsEditing(false);
  };

  const profileData = saved || form.getValues();
  const hasData = saved && saved.age;

  return (
    <div className="min-h-screen flex">
      <ProfileSidebar activePage="profile" />
      <div className="flex-1 p-4 sm:ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center">
            <h1 className="text-2xl font-semibold flex items-center"><User className="mr-2 h-6 w-6 text-primary" />Profile Management</h1>
          </div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Personal Information</span>
                <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>{isEditing ? "Cancel" : "Edit Profile"}</Button>
              </CardTitle>
              <CardDescription>View and update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input placeholder="Enter your age" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender</FormLabel><FormControl><GenderSelect value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="height" render={({ field }) => (<FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input placeholder="Enter your height" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="weight" render={({ field }) => (<FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input placeholder="Enter your weight" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="activityLevel" render={({ field }) => (<FormItem><FormLabel>Activity Level</FormLabel><FormControl><ActivityLevelSelect value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="calorieGoal" render={({ field }) => (<FormItem><FormLabel>Daily Calorie Goal</FormLabel><FormControl><Input placeholder="E.g., 2000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name="healthGoals" render={({ field }) => (<FormItem><FormLabel>Health Goals</FormLabel><FormControl><HealthGoalsSelect value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="dietaryRestrictions" render={({ field }) => (<FormItem><FormLabel>Dietary Restrictions</FormLabel><FormControl><DietaryRestrictionsSelect value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <Button type="submit" className="w-full">Save Profile</Button>
                  </form>
                </Form>
              ) : hasData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg"><span className="text-sm text-muted-foreground">Age</span><p className="font-medium">{saved.age}</p></div>
                  <div className="p-3 border rounded-lg"><span className="text-sm text-muted-foreground">Gender</span><p className="font-medium capitalize">{saved.gender}</p></div>
                  <div className="p-3 border rounded-lg"><span className="text-sm text-muted-foreground">Height</span><p className="font-medium">{saved.height} cm</p></div>
                  <div className="p-3 border rounded-lg"><span className="text-sm text-muted-foreground">Weight</span><p className="font-medium">{saved.weight} kg</p></div>
                  <div className="p-3 border rounded-lg"><span className="text-sm text-muted-foreground">Activity Level</span><p className="font-medium capitalize">{saved.activityLevel}</p></div>
                  <div className="p-3 border rounded-lg"><span className="text-sm text-muted-foreground">Calorie Goal</span><p className="font-medium">{saved.calorieGoal} kcal/day</p></div>
                  <div className="p-3 border rounded-lg col-span-full"><span className="text-sm text-muted-foreground">Health Goals</span><p className="font-medium capitalize">{saved.healthGoals}</p></div>
                  {saved.dietaryRestrictions && <div className="p-3 border rounded-lg col-span-full"><span className="text-sm text-muted-foreground">Dietary Restrictions</span><p className="font-medium">{saved.dietaryRestrictions}</p></div>}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Click "Edit Profile" to enter your information.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
