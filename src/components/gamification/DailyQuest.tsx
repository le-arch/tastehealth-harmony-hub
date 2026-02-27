
import { useLanguage } from "../../contexts/LanguageContext";
import NutritionQuest from "./NutritionQuest";

interface DailyQuestsProps {
  userId?: string;
  onQuestComplete: (questId: string, points: number) => Promise<void>;
}

const DailyQuests = ({ userId, onQuestComplete }: DailyQuestsProps) => {
  const { language } = useLanguage();
  const addPoints = async (points: number, reason: string) => { await onQuestComplete(reason, points); };
  return <NutritionQuest userId={userId} addPoints={addPoints} />;
};

export default DailyQuests;
