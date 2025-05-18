import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";

const challengeTypes = [
  { id: "water", label: "Water Intake", description: "Drink more water daily" },
  { id: "protein", label: "Protein Goals", description: "Increase protein consumption" },
  { id: "vegetables", label: "Vegetable Intake", description: "Eat more vegetables" },
  { id: "exercise", label: "Exercise", description: "Regular physical activity" },
  { id: "sleep", label: "Sleep", description: "Improve sleep habits" }
];

const ChallengeCreator: React.FC = () => {
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(7);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(current =>
      current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type]
    );
  };

  const handleCreateChallenge = async () => {
    if (!name.trim()) {
      toast.error("Please provide a challenge name");
      return;
    }
    
    if (selectedTypes.length === 0) {
      toast.error("Please select at least one challenge type");
      return;
    }
    
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You need to be signed in to create a challenge");
        return;
      }
      
      // Using the create_nutrition_challenge function from Supabase
      const { data, error } = await supabase.rpc('create_nutrition_challenge', {
        p_user_id: user.id,
        p_name: name,
        p_types: selectedTypes,
        p_duration_days: duration,
        p_difficulty_level: difficulty
      });
      
      if (error) throw error;
      
      toast.success("Challenge created successfully!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Reset form
      setName("");
      setSelectedTypes([]);
      setDuration(7);
      setDifficulty(1);
      
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error("Failed to create challenge");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Confetti active={showConfetti} />
      
      <Card>
        <CardHeader>
          <CardTitle>Create a Nutrition Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="challenge-name">Challenge Name</Label>
            <Input
              id="challenge-name"
              placeholder="My Awesome Challenge"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Challenge Types</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challengeTypes.map((type) => (
                <div key={type.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => handleTypeToggle(type.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={`type-${type.id}`} className="text-sm font-medium">
                      {type.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Duration (Days)</Label>
                <span className="text-sm font-medium">{duration}</span>
              </div>
              <Slider
                value={[duration]}
                min={3}
                max={30}
                step={1}
                onValueChange={(vals) => setDuration(vals[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <RadioGroup
                value={String(difficulty)}
                onValueChange={(val) => setDifficulty(parseInt(val))}
                className="flex space-x-6 pt-2"
              >
                {[1, 2, 3].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(level)} id={`difficulty-${level}`} />
                    <Label htmlFor={`difficulty-${level}`}>{
                      level === 1 ? "Easy" : level === 2 ? "Medium" : "Hard"
                    }</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreateChallenge} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? "Creating..." : "Create Challenge"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChallengeCreator;
