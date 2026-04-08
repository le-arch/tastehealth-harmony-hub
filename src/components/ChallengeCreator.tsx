import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";
import { getLS, setLS, LS_KEYS, Challenge } from '@/utils/localStorage';
import { playMilestoneSound } from '@/utils/sounds';
import { Plus, Sparkles, Target, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const challengeTypes = [
  { id: "water", label: "💧 Water Intake", description: "Drink more water daily" },
  { id: "protein", label: "🥩 Protein Goals", description: "Increase protein consumption" },
  { id: "vegetables", label: "🥬 Vegetable Intake", description: "Eat more vegetables" },
  { id: "exercise", label: "🏃 Exercise", description: "Regular physical activity" },
  { id: "sleep", label: "😴 Sleep", description: "Improve sleep habits" },
  { id: "fruits", label: "🍎 Fruit Intake", description: "Eat more fruits daily" },
  { id: "meditation", label: "🧘 Meditation", description: "Practice mindfulness" },
  { id: "steps", label: "👟 Step Count", description: "Walk more steps daily" },
];

const CATEGORIES = [
  { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { id: 'hydration', label: 'Hydration', icon: '💧' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'wellness', label: 'Wellness', icon: '🌿' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧠' },
];

const TEMPLATES = [
  { name: "7-Day Water Challenge", types: ["water"], duration: 7, difficulty: 1, category: 'hydration', description: "Drink 8 glasses of water every day for a week" },
  { name: "Protein Power Week", types: ["protein"], duration: 7, difficulty: 2, category: 'nutrition', description: "Hit your daily protein target for 7 days straight" },
  { name: "30-Day Fitness", types: ["exercise", "steps"], duration: 30, difficulty: 3, category: 'fitness', description: "Complete daily exercise and hit 10K steps" },
  { name: "Veggie & Fruit Boost", types: ["vegetables", "fruits"], duration: 14, difficulty: 2, category: 'nutrition', description: "Eat 5 servings of fruits and vegetables daily" },
  { name: "Mindful Week", types: ["meditation", "sleep"], duration: 7, difficulty: 1, category: 'mindfulness', description: "Meditate and get 8 hours of sleep daily" },
];

interface ChallengeCreatorProps {
  onCreate?: (challenge: Challenge) => void;
}

const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(7);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [category, setCategory] = useState('nutrition');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(current =>
      current.includes(type) ? current.filter(t => t !== type) : [...current, type]
    );
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setName(template.name);
    setDescription(template.description);
    setSelectedTypes(template.types);
    setDuration(template.duration);
    setDifficulty(template.difficulty);
    setCategory(template.category);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" applied!`);
  };

  const handleCreateChallenge = () => {
    if (!name.trim()) { toast.error("Please provide a challenge name"); return; }
    if (selectedTypes.length === 0) { toast.error("Please select at least one challenge type"); return; }
    
    const challenge: Challenge = {
      id: crypto.randomUUID(),
      name,
      types: selectedTypes,
      duration,
      difficulty,
      startDate: new Date().toISOString(),
      progress: 0,
      target: duration,
      completed: false,
    };

    const existing = getLS<Challenge[]>(LS_KEYS.CHALLENGES, []);
    const updated = [challenge, ...existing];
    setLS(LS_KEYS.CHALLENGES, updated);
    onCreate?.(challenge);

    playMilestoneSound('success');
    toast.success(`Challenge "${name}" created! 🎯`);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setName(""); setDescription(""); setSelectedTypes([]); setDuration(7); setDifficulty(1); setShowTemplates(true);
  };

  const difficultyLabels = ['', '🟢 Easy', '🟡 Medium', '🔴 Hard'];
  const difficultyPoints = [0, 25, 50, 75];

  return (
    <div className="space-y-4">
      <Confetti active={showConfetti} />
      
      {/* Quick Templates */}
      {showTemplates && (
        <Card className="border-dashed border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Quick Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEMPLATES.map((template) => (
                <motion.button
                  key={template.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyTemplate(template)}
                  className="text-left p-3 rounded-lg border bg-muted/50 hover:bg-muted hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{template.name}</p>
                    <Badge variant="outline" className="text-[9px]">{template.duration}d</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Create a Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-name">Challenge Name *</Label>
              <Input id="challenge-name" placeholder="My Awesome Challenge" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea placeholder="What's this challenge about?" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>

          <div className="space-y-3">
            <Label>Challenge Types *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {challengeTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTypeToggle(type.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-all ${
                    selectedTypes.includes(type.id) 
                      ? 'bg-primary/10 border-primary/40 shadow-sm' 
                      : 'bg-muted/50 hover:bg-muted border-transparent'
                  }`}
                >
                  <span className="text-base">{type.label.split(' ')[0]}</span>
                  <span className="text-xs font-medium">{type.label.split(' ').slice(1).join(' ')}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Duration</Label>
                <span className="text-sm font-bold text-primary">{duration} days</span>
              </div>
              <Slider value={[duration]} min={3} max={30} step={1} onValueChange={(vals) => setDuration(vals[0])} />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>3 days</span><span>30 days</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <RadioGroup value={String(difficulty)} onValueChange={(val) => setDifficulty(parseInt(val))} className="flex gap-4 pt-1">
                {[1, 2, 3].map((level) => (
                  <div key={level} className="flex items-center space-x-1.5">
                    <RadioGroupItem value={String(level)} id={`difficulty-${level}`} />
                    <Label htmlFor={`difficulty-${level}`} className="text-sm cursor-pointer">{difficultyLabels[level]}</Label>
                  </div>
                ))}
              </RadioGroup>
              <p className="text-[10px] text-muted-foreground">Earn up to {difficultyPoints[difficulty]} pts on completion</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateChallenge} className="w-full bg-gradient-to-r from-primary to-primary/80" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChallengeCreator;
