import { useLanguage } from "../../contexts/LanguageContext";

interface DailyQuestsProps {
  userId?: string;
  onQuestComplete: (questId: string, points: number) => Promise<void>;
}

const DailyQuests = ({ userId, onQuestComplete }: DailyQuestsProps) => {
  const { language } = useLanguage();
  const t = language === "fr" ? "Quêtes Nutritionnelles" : "Nutrition Quests";

  return (
    <div className="bg-background rounded-lg shadow-md p-6 text-center">
      <h2 className="text-xl font-bold mb-4">{t}</h2>
      <p className="text-muted-foreground">Database features removed.</p>
    </div>
  );
};

export default DailyQuests;
