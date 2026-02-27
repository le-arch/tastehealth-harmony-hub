
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS } from "@/utils/localStorage";

interface DailyStreakProps { streak: number; updateStreak: () => Promise<void>; }

const DailyStreak = ({ updateStreak }: DailyStreakProps) => {
  const today = new Date().toDateString();
  const savedDate = getLS<string>(LS_KEYS.STREAK_DATE, '');
  const [streak, setStreak] = useState(getLS<number>(LS_KEYS.STREAK, 0));
  const [checkedIn, setCheckedIn] = useState(savedDate === today);
  const { language } = useLanguage();

  const t = language === 'fr' 
    ? { dailyStreak: "Série Quotidienne", days: "jours", checkIn: "Présence Quotidienne", checkedIn: "Présent" }
    : { dailyStreak: "Daily Streak", days: "days", checkIn: "Daily Check-in", checkedIn: "Checked In" };

  const handleCheckIn = async () => {
    if (checkedIn) return;
    const newStreak = streak + 1;
    setStreak(newStreak); setCheckedIn(true);
    setLS(LS_KEYS.STREAK, newStreak); setLS(LS_KEYS.STREAK_DATE, today);
    await updateStreak();
    toast.success(`Streak: ${newStreak} days! 🔥`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center"><Flame className="h-4 w-4 mr-2 text-orange-500" />{t.dailyStreak}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }} className="text-3xl font-bold">{streak}</motion.div>
          <div className="ml-2 text-sm text-muted-foreground">{t.days}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCheckIn} disabled={checkedIn} variant={checkedIn ? "outline" : "default"} className="w-full" size="sm">
          {checkedIn ? (<><Check className="mr-1 h-4 w-4" />{t.checkedIn}</>) : t.checkIn}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyStreak;
