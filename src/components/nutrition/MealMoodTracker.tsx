import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MealMoodTracker = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <span role="img" aria-label="mood" className="mr-2 text-xl">😋</span>
          Meal Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">Database features removed.</p>
      </CardContent>
    </Card>
  );
};

export default MealMoodTracker;
