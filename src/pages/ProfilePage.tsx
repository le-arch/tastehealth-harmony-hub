
import React, { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Upload, X } from "lucide-react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { motion } from "framer-motion";
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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saved = getLS<ProfileData | null>(LS_KEYS.PROFILE, null);

  // Load profile image on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('th_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
      setImagePreview(savedImage);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setImagePreview(base64String);
      setProfileImage(base64String);
      localStorage.setItem('th_profile_image', base64String);
      toast.success("Profile image updated!");
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    localStorage.removeItem('th_profile_image');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Profile image removed");
  };

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
          {/* Profile Image Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a profile photo (Max 5MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="relative"
                >
                  {profileImage ? (
                    <div className="relative">
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={removeProfileImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground">
                      <User className="h-12 w-12 text-muted-foreground opacity-50" />
                    </div>
                  )}
                </motion.div>

                <div className="flex-1 space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
