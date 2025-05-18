import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const moodOptions = [
  { emoji: "😋", mood: "delicious", description: "Absolutely loved it!" },
  { emoji: "😊", mood: "satisfied", description: "Pretty good" },
  { emoji: "😐", mood: "neutral", description: "It was okay" },
  { emoji: "😞", mood: "unsatisfied", description: "Not great" },
  { emoji: "🤢", mood: "terrible", description: "Did not enjoy at all" }
];

interface MealMoodTrackerProps {
  meal?: {
    id: string;
    name: string;
  };
  onSave?: () => void;
}

const MealMoodTracker: React.FC<MealMoodTrackerProps> = ({ meal, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSave = async () => {
    if (!selectedMood || !meal) return;

    setSaving(true);
    try {
      // Get the user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You need to be signed in to track your mood");
        return;
      }

      // Save to the meal_moods table
      const { error } = await supabase
        .from('meal_moods')
        .insert({
          user_id: user.id,
          meal_id: meal.id,
          meal_name: meal.name,
          mood: selectedMood,
          notes: notes
        });

      if (error) {
        throw error;
      }

      toast.success("Mood saved successfully!");
      
      // Reset form
      setSelectedMood(null);
      setNotes("");
      
      // Call the onSave callback if provided
      if (onSave) onSave();
      
    } catch (error) {
      console.error("Error saving mood:", error);
      toast.error("Failed to save your mood");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg text-center">
          {meal ? `How did you feel after eating ${meal.name}?` : "How did your meal make you feel?"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-2">
          {moodOptions.map((option) => (
            <Button
              key={option.mood}
              variant={selectedMood === option.mood ? "default" : "outline"}
              className={`text-2xl h-14 w-14 p-0 ${selectedMood === option.mood ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleMoodSelect(option.mood)}
              title={option.description}
            >
              {option.emoji}
            </Button>
          ))}
        </div>
        {selectedMood && (
          <div className="animate-fade-in">
            <p className="text-center mb-2">
              {moodOptions.find(o => o.mood === selectedMood)?.description}
            </p>
            <Textarea
              placeholder="Any additional notes about this meal?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button 
          disabled={!selectedMood || saving} 
          onClick={handleSave}
          className="w-full"
        >
          {saving ? "Saving..." : "Save Mood"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealMoodTracker;
