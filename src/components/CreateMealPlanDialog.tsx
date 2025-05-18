"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface CreateMealPlanDialogProps {
  onMealPlanCreated?: () => void
  buttonText?: string
  buttonIcon?: React.ReactNode
}

export function CreateMealPlanDialog({
  onMealPlanCreated,
  buttonText = "Create Meal Plan",
  buttonIcon = <Plus className="mr-2 h-4 w-4" />,
}: CreateMealPlanDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to create a meal plan.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
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
        .single()

      if (error) throw error

      toast({
        title: "Meal Plan Created",
        description: "Your meal plan was successfully created.",
        variant: "default",
      })

      setOpen(false)
      setName("")
      setDescription("")
      onMealPlanCreated?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create meal plan: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {buttonIcon}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Meal Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="plan-name" className="block text-sm font-medium mb-1">
              Plan Name
            </label>
            <Input
              id="plan-name"
              placeholder="Enter plan name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="plan-description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="plan-description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !name} className="w-full">
            {isSubmitting ? "Creating..." : "Create Plan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
