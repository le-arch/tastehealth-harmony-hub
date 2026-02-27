
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, MoodEntry } from "@/utils/localStorage";
import { Trash2 } from "lucide-react";

const moodOptions = [
  { emoji: "😋", mood: "delicious", description: "Absolutely loved it!" },
  { emoji: "😊", mood: "satisfied", description: "Pretty good" },
  { emoji: "😐", mood: "neutral", description: "It was okay" },
  { emoji: "😞", mood: "unsatisfied", description: "Not great" },
  { emoji: "🤢", mood: "terrible", description: "Did not enjoy at all" }
];

const MealMoodTracker = () => {
  const [entries, setEntries] = useState<MoodEntry[]>(getLS(LS_KEYS.MOOD_LOG, []));
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [mealName, setMealName] = useState("");

  const save = (updated: MoodEntry[]) => { setEntries(updated); setLS(LS_KEYS.MOOD_LOG, updated); };

  const handleSave = () => {
    if (!selectedMood) return;
    const entry: MoodEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), mood: selectedMood, notes, mealName };
    save([entry, ...entries]);
    toast.success("Mood saved!");
    setSelectedMood(null); setNotes(""); setMealName("");
  };

  const deleteEntry = (id: string) => { save(entries.filter(e => e.id !== id)); };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium"><span role="img" aria-label="mood" className="mr-2 text-xl">😋</span>Meal Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div><Label>Meal Name (optional)</Label><Input value={mealName} onChange={e => setMealName(e.target.value)} placeholder="e.g. Lunch salad" /></div>
        <div className="flex justify-center space-x-2">
          {moodOptions.map((option) => (
            <Button key={option.mood} variant={selectedMood === option.mood ? "default" : "outline"} className={`text-2xl h-14 w-14 p-0 ${selectedMood === option.mood ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedMood(option.mood)} title={option.description}>
              {option.emoji}
            </Button>
          ))}
        </div>
        {selectedMood && (
          <div className="animate-fade-in">
            <p className="text-center mb-2">{moodOptions.find(o => o.mood === selectedMood)?.description}</p>
            <Textarea placeholder="Any additional notes?" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        )}
        <Button disabled={!selectedMood} onClick={handleSave} className="w-full">Save Mood</Button>

        {entries.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-sm">Recent Moods</h4>
            {entries.slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 border rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{moodOptions.find(o => o.mood === e.mood)?.emoji}</span>
                  <div>
                    {e.mealName && <span className="font-medium">{e.mealName} - </span>}
                    <span className="text-muted-foreground">{new Date(e.date).toLocaleDateString()}</span>
                    {e.notes && <p className="text-xs text-muted-foreground">{e.notes}</p>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteEntry(e.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealMoodTracker;
