
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, LS_KEYS } from "@/utils/localStorage";

interface NutritionLeaderboardProps { userId?: string; }

const MOCK_USERS = [
  { name: 'Alex M.', points: 2450, avatar: '🧑‍🍳' },
  { name: 'Sarah K.', points: 2100, avatar: '👩‍🔬' },
  { name: 'Mike R.', points: 1800, avatar: '🧑‍💻' },
  { name: 'Emma L.', points: 1550, avatar: '👩‍🎓' },
  { name: 'Chris P.', points: 1200, avatar: '🧑‍🎨' },
];

const NutritionLeaderboard = ({ userId }: NutritionLeaderboardProps) => {
  const { language } = useLanguage();
  const myPoints = getLS<number>(LS_KEYS.POINTS, 0);

  const allUsers = [...MOCK_USERS, { name: 'You', points: myPoints, avatar: '⭐' }]
    .sort((a, b) => b.points - a.points);

  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-700'];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          {language === 'fr' ? "Classement Nutritionnel" : "Nutrition Leaderboard"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {allUsers.map((user, i) => (
            <div key={user.name} className={`flex items-center justify-between p-3 rounded-lg border ${user.name === 'You' ? 'bg-primary/10 border-primary' : ''}`}>
              <div className="flex items-center gap-3">
                {i < 3 ? <Medal className={`h-5 w-5 ${medalColors[i]}`} /> : <span className="w-5 text-center text-sm text-muted-foreground">{i + 1}</span>}
                <span className="text-xl">{user.avatar}</span>
                <span className={`font-medium ${user.name === 'You' ? 'text-primary' : ''}`}>{user.name}</span>
              </div>
              <span className="font-bold">{user.points} pts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionLeaderboard;
