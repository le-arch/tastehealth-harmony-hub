
"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useScreenSize } from "@/utils/mobile";
import { saveMealPlanCalories } from "@/services/mealPlanCalorieService";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreateMealPlanDialogProps {
  onMealPlanCreated?: () => void;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

export function CreateMealPlanDialog({
  onMealPlanCreated,
  buttonText = "Create Meal Plan",
  buttonIcon = <Plus className="mr-2 h-4 w-4" />,
}: CreateMealPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;
  const { language } = useLanguage();

  const translations = {
    en: {
      createMealPlan: "Create Meal Plan",
      planName: "Plan Name",
      enterPlanName: "Enter plan name",
      description: "Description",
      descriptionOptional: "Description (optional)",
      creating: "Creating...",
      create: "Create Plan",
      mealPlanCreated: "Meal Plan Created",
      mealPlanCreatedDesc: "Your meal plan was successfully created.",
      authRequired: "Authentication Required",
      loginRequired: "You must be logged in to create a meal plan.",
      error: "Error",
      failedToCreate: "Failed to create meal plan:"
    },
    fr: {
      createMealPlan: "Créer un Plan de Repas",
      planName: "Nom du Plan",
      enterPlanName: "Entrez le nom du plan",
      description: "Description",
      descriptionOptional: "Description (optionnel)",
      creating: "Création en cours...",
      create: "Créer le Plan",
      mealPlanCreated: "Plan de Repas Créé",
      mealPlanCreatedDesc: "Votre plan de repas a été créé avec succès.",
      authRequired: "Authentification Requise",
      loginRequired: "Vous devez être connecté pour créer un plan de repas.",
      error: "Erreur",
      failedToCreate: "Échec de la création du plan de repas:"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: t.authRequired,
          description: t.loginRequired,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert the meal plan with the user_id
      const { data, error } = await supabase
        .from("meal_plans")
        .insert([
          {
            name,
            description,
            user_id: user.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Initialize calorie tracking for this meal plan
      if (data) {
        await saveMealPlanCalories(data.id, user.id);
      }

      toast({
        title: t.mealPlanCreated,
        description: t.mealPlanCreatedDesc,
        variant: "default",
      });

      setOpen(false);
      setName("");
      setDescription("");
      onMealPlanCreated?.();
    } catch (error: any) {
      toast({
        title: t.error,
        description: t.failedToCreate + " " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {buttonIcon}
          {isSmallScreen ? "" : (language === 'fr' ? "Créer un Plan de Repas" : buttonText)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.createMealPlan}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="plan-name"
              className="block text-sm font-medium mb-1"
            >
              {t.planName}
            </label>
            <Input
              id="plan-name"
              placeholder={t.enterPlanName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="plan-description"
              className="block text-sm font-medium mb-1"
            >
              {t.description}
            </label>
            <Textarea
              id="plan-description"
              placeholder={t.descriptionOptional}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !name}
            className="w-full"
          >
            {isSubmitting ? t.creating : t.create}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
