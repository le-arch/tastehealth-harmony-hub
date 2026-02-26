
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface DailyStreakProps {
  streak: number;
  updateStreak: () => Promise<void>;
}

const DailyStreak = ({ updateStreak }: DailyStreakProps) => {
  const [streak, setStreak] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const { language } = useLanguage();

  const t = language === 'fr' 
    ? { dailyStreak: "Série Quotidienne", days: "jours", checkIn: "Présence Quotidienne", checkedIn: "Présent" }
    : { dailyStreak: "Daily Streak", days: "days", checkIn: "Daily Check-in", checkedIn: "Checked In" };

  const handleCheckIn = async () => {
    if (checkedIn) return;
    setStreak(s => s + 1);
    setCheckedIn(true);
    await updateStreak();
    toast.success("Streak updated!");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Flame className="h-4 w-4 mr-2 text-orange-500" />
          {t.dailyStreak}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }} className="text-3xl font-bold">
            {streak}
          </motion.div>
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
