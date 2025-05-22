import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useLanguage } from "@/contexts/LanguageContext"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Check, Loader2 } from "lucide-react"
import GenderSelect from "@/components/profile/GenderSelect"
import ActivityLevelSelect from "@/components/profile/ActivityLevelSelect"
import HealthGoalsSelect from "@/components/profile/HealthGoalsSelect"
import DietaryRestrictionsSelect from "@/components/profile/DietaryRestrictionsSelect"

const ProfilePage = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [profile, setProfile] = useState<{
    username: string | null
    avatar_url: string | null
    full_name: string | null
    gender: string | null
    activity_level: string | null
    health_goals: string[] | null
    dietary_restrictions: string[] | null
  }>({
    username: null,
    avatar_url: null,
    full_name: null,
    gender: null,
    activity_level: null,
    health_goals: null,
    dietary_restrictions: null,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [newUsername, setNewUsername] = useState("")
  const [newFullName, setNewFullName] = useState("")
  const [newGender, setNewGender] = useState<string | null>(null)
  const [newActivityLevel, setNewActivityLevel] = useState<string | null>(null)
  const [newHealthGoals, setNewHealthGoals] = useState<string[] | null>(null)
  const [newDietaryRestrictions, setNewDietaryRestrictions] = useState<string[] | null>(null)

  const translations = {
    en: {
      title: "Profile",
      subTitle: "Manage your profile information",
      username: "Username",
      fullName: "Full Name",
      gender: "Gender",
      activityLevel: "Activity Level",
      healthGoals: "Health Goals",
      dietaryRestrictions: "Dietary Restrictions",
      updateProfile: "Update Profile",
      editProfile: "Edit Profile",
      cancelEdit: "Cancel",
      saveChanges: "Save Changes",
      uploadAvatar: "Upload Avatar",
      uploadingAvatar: "Uploading...",
    },
    fr: {
      title: "Profil",
      subTitle: "Gérez vos informations de profil",
      username: "Nom d'utilisateur",
      fullName: "Nom complet",
      gender: "Genre",
      activityLevel: "Niveau d'activité",
      healthGoals: "Objectifs de santé",
      dietaryRestrictions: "Restrictions alimentaires",
      updateProfile: "Mettre à jour le profil",
      editProfile: "Modifier le profil",
      cancelEdit: "Annuler",
      saveChanges: "Enregistrer les modifications",
      uploadAvatar: "Télécharger l'avatar",
      uploadingAvatar: "Téléchargement...",
    },
  }

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const { data: session } = await supabase.auth.getSession()
      const userId = session.session?.user.id

      if (!userId) {
        navigate("/login")
        return
      }

      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        toast.error(language === "en" ? "Failed to load profile" : "Échec du chargement du profil")
        return
      }

      setProfile({
        username: data.username,
        avatar_url: data.avatar_url,
        full_name: data.full_name,
        gender: data.gender,
        activity_level: data.activity_level,
        health_goals: data.health_goals,
        dietary_restrictions: data.dietary_restrictions,
      })
      setAvatarUrl(data.avatar_url)
      setNewUsername(data.username || "")
      setNewFullName(data.full_name || "")
      setNewGender(data.gender || null)
      setNewActivityLevel(data.activity_level || null)
      setNewHealthGoals(data.health_goals || null)
      setNewDietaryRestrictions(data.dietary_restrictions || null)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error(language === "en" ? "Failed to load profile" : "Échec du chargement du profil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setNewUsername(profile.username || "")
    setNewFullName(profile.full_name || "")
    setNewGender(profile.gender || null)
    setNewActivityLevel(profile.activity_level || null)
    setNewHealthGoals(profile.health_goals || null)
    setNewDietaryRestrictions(profile.dietary_restrictions || null)
  }

  const handleSaveChanges = async () => {
    setIsLoading(true)
    try {
      const { data: session } = await supabase.auth.getSession()
      const userId = session.session?.user.id

      if (!userId) {
        navigate("/login")
        return
      }

      const updates = {
        user_id: userId,
        username: newUsername,
        full_name: newFullName,
        gender: newGender,
        activity_level: newActivityLevel,
        health_goals: newHealthGoals,
        dietary_restrictions: newDietaryRestrictions,
        updated_at: new Date(),
      }

      const { error } = await supabase.from("profiles").update(updates).eq("user_id", userId)

      if (error) {
        console.error("Error updating profile:", error)
        toast.error(language === "en" ? "Failed to update profile" : "Échec de la mise à jour du profil")
        return
      }

      setProfile({
        ...profile,
        username: newUsername,
        full_name: newFullName,
        gender: newGender,
        activity_level: newActivityLevel,
        health_goals: newHealthGoals,
        dietary_restrictions: newDietaryRestrictions,
      })
      setIsEditing(false)
      toast.success(language === "en" ? "Profile updated successfully" : "Profil mis à jour avec succès")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(language === "en" ? "Failed to update profile" : "Échec de la mise à jour du profil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setUploading(true)

    try {
      const { data: session } = await supabase.auth.getSession()
      const userId = session.session?.user.id

      if (!userId) {
        navigate("/login")
        return
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: storageError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (storageError) {
        throw storageError
      }

      const { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("user_id", userId)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      setProfile((prevProfile) => ({ ...prevProfile, avatar_url: updateData.avatar_url }))
      setAvatarUrl(updateData.avatar_url)
      toast.success(language === "en" ? "Avatar updated successfully" : "Avatar mis à jour avec succès")
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast.error(language === "en" ? "Failed to upload avatar" : "Échec du téléchargement de l'avatar")
    } finally {
      setUploading(false)
    }
  }

  const getAvatarUrl = () => {
    return avatarUrl ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarUrl}` : null
  }

  return (
    <div className="flex space-x-6 bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="profile" />

      <div className="sm:ml-64 p-4 w-full">
        <div className="p-4 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t.subTitle}</p>

          <Card className="mt-6">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      {profile.avatar_url ? (
                        <AvatarImage src={getAvatarUrl() || ""} alt="Avatar" />
                      ) : (
                        <AvatarFallback>{profile.username?.charAt(0).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  <div className="flex justify-center mb-4">
                    <Input
                      type="file"
                      id="single"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading || isEditing}
                      className="hidden"
                    />
                    <Label htmlFor="single" className="cursor-pointer">
                      <Button variant="secondary" asChild disabled={uploading || isEditing}>
                        <>{uploading ? t.uploadingAvatar : t.uploadAvatar}</>
                      </Button>
                    </Label>
                  </div>

                  {isEditing ? (
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="username">{t.username}</Label>
                        <Input
                          type="text"
                          id="username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fullName">{t.fullName}</Label>
                        <Input
                          type="text"
                          id="fullName"
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">{t.gender}</Label>
                        <GenderSelect value={newGender} onChange={(value) => setNewGender(value)} disabled={isLoading} />
                      </div>
                      <div>
                        <Label htmlFor="activityLevel">{t.activityLevel}</Label>
                        <ActivityLevelSelect
                          value={newActivityLevel}
                          onChange={(value) => setNewActivityLevel(value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="healthGoals">{t.healthGoals}</Label>
                        <HealthGoalsSelect
                          value={newHealthGoals}
                          onChange={(value) => setNewHealthGoals(value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dietaryRestrictions">{t.dietaryRestrictions}</Label>
                        <DietaryRestrictionsSelect
                          value={newDietaryRestrictions}
                          onChange={(value) => setNewDietaryRestrictions(value)}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={handleCancelEdit} disabled={isLoading}>
                          {t.cancelEdit}
                        </Button>
                        <Button onClick={handleSaveChanges} disabled={isLoading}>
                          {t.saveChanges}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">{t.username}</Label>
                        <Input type="text" id="username" value={profile.username || ""} readOnly disabled />
                      </div>
                      <div>
                        <Label htmlFor="fullName">{t.fullName}</Label>
                        <Input type="text" id="fullName" value={profile.full_name || ""} readOnly disabled />
                      </div>
                      <div>
                        <Label htmlFor="gender">{t.gender}</Label>
                        <Input type="text" id="gender" value={profile.gender || ""} readOnly disabled />
                      </div>
                      <div>
                        <Label htmlFor="activityLevel">{t.activityLevel}</Label>
                        <Input type="text" id="activityLevel" value={profile.activity_level || ""} readOnly disabled />
                      </div>
                      <div>
                        <Label htmlFor="healthGoals">{t.healthGoals}</Label>
                        <Input
                          type="text"
                          id="healthGoals"
                          value={profile.health_goals ? profile.health_goals.join(", ") : ""}
                          readOnly
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="dietaryRestrictions">{t.dietaryRestrictions}</Label>
                        <Input
                          type="text"
                          id="dietaryRestrictions"
                          value={profile.dietary_restrictions ? profile.dietary_restrictions.join(", ") : ""}
                          readOnly
                          disabled
                        />
                      </div>

                      <Button onClick={handleEditProfile} className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        {t.editProfile}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
