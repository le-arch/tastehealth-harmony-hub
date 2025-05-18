
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Save, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type NutritionData = {
  name: string;
  value: number;
  color: string;
};

const INITIAL_DATA: NutritionData[] = [
  { name: 'Proteins', value: 25, color: '#10B981' }, // green-500
  { name: 'Carbs', value: 45, color: '#F59E0B' },   // amber-500
  { name: 'Fats', value: 30, color: '#3B82F6' },    // blue-500
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const NutritionProgressWheel: React.FC = () => {
  const [nutritionData, setNutritionData] = useState<NutritionData[]>(INITIAL_DATA);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Nutrition Balance",
      proteins: "Proteins",
      carbs: "Carbohydrates",
      fats: "Fats",
      save: "Save Progress",
      saved: "Progress saved!",
      recommendedValues: "Recommended Values",
      yourIntake: "Your Intake",
      balanced: "Well Balanced!",
      needsImprovement: "Needs Improvement",
      increasing: "Increasing",
      decreasing: "Decreasing"
    },
    fr: {
      title: "Équilibre Nutritionnel",
      proteins: "Protéines",
      carbs: "Glucides",
      fats: "Lipides",
      save: "Sauvegarder",
      saved: "Progrès sauvegardé !",
      recommendedValues: "Valeurs Recommandées",
      yourIntake: "Votre Consommation",
      balanced: "Bien Équilibré !",
      needsImprovement: "À Améliorer",
      increasing: "En Augmentation",
      decreasing: "En Diminution"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Update names to translated versions
  useEffect(() => {
    setNutritionData(prev => 
      prev.map(item => ({
        ...item,
        name: item.name === 'Proteins' ? t.proteins : 
              item.name === 'Carbs' ? t.carbs : t.fats
      }))
    );
  }, [language, t.proteins, t.carbs, t.fats]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUserId(session.user.id);
        
        // Check if there's a calorie record for today
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('calorie_records')
          .select('protein_grams, carbs_grams, fat_grams')
          .eq('user_id', session.user.id)
          .eq('recorded_date', today)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (data && data.length > 0) {
          // Calculate percentages based on macronutrient grams
          // Using calorie values: proteins = 4 cal/g, carbs = 4 cal/g, fats = 9 cal/g
          const proteinGrams = data[0].protein_grams || 0;
          const carbsGrams = data[0].carbs_grams || 0;
          const fatGrams = data[0].fat_grams || 0;
          
          const proteinCals = proteinGrams * 4;
          const carbsCals = carbsGrams * 4;
          const fatCals = fatGrams * 9;
          
          const totalCals = proteinCals + carbsCals + fatCals;
          
          if (totalCals > 0) {
            const newData: NutritionData[] = [
              { name: t.proteins, value: Math.round((proteinCals / totalCals) * 100), color: '#10B981' },
              { name: t.carbs, value: Math.round((carbsCals / totalCals) * 100), color: '#F59E0B' },
              { name: t.fats, value: Math.round((fatCals / totalCals) * 100), color: '#3B82F6' }
            ];
            
            setNutritionData(newData);
          }
        }
      }
    };
    
    loadUserData();
  }, [t.proteins, t.carbs, t.fats]);

  const handleSaveProgress = async () => {
    if (!userId) {
      toast.error("Please sign in to save your progress");
      return;
    }
    
    try {
      // Convert percentages back to approximate gram values
      // Assuming 2000 calorie diet as baseline
      const totalCals = 2000;
      
      const proteinPercent = nutritionData.find(d => d.name === t.proteins)?.value || 0;
      const carbsPercent = nutritionData.find(d => d.name === t.carbs)?.value || 0;
      const fatPercent = nutritionData.find(d => d.name === t.fats)?.value || 0;
      
      const proteinCals = (proteinPercent / 100) * totalCals;
      const carbsCals = (carbsPercent / 100) * totalCals;
      const fatCals = (fatPercent / 100) * totalCals;
      
      const proteinGrams = Math.round(proteinCals / 4);
      const carbsGrams = Math.round(carbsCals / 4);
      const fatGrams = Math.round(fatCals / 9);
      
      await supabase.from('calorie_records').insert({
        user_id: userId,
        protein_grams: proteinGrams,
        carbs_grams: carbsGrams,
        fat_grams: fatGrams,
        calories_consumed: Math.round(proteinCals + carbsCals + fatCals),
        calories_goal: 2000
      });
      
      toast.success(t.saved);
      
      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
      
    } catch (error) {
      console.error("Error saving nutrition data:", error);
      toast.error("Failed to save progress");
    }
  };

  // Determine if nutrition is well-balanced
  const isBalanced = () => {
    const protein = nutritionData.find(d => d.name === t.proteins)?.value || 0;
    const carbs = nutritionData.find(d => d.name === t.carbs)?.value || 0;
    const fats = nutritionData.find(d => d.name === t.fats)?.value || 0;
    
    return (
      protein >= 20 && protein <= 35 &&
      carbs >= 40 && carbs <= 60 &&
      fats >= 20 && fats <= 35
    );
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium flex items-center">
          <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
          {t.title}
        </CardTitle>
        {isBalanced() ? (
          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {t.balanced}
          </div>
        ) : (
          <div className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
            {t.needsImprovement}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-3">
        <motion.div
          animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="h-56 sm:h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={nutritionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
                animationBegin={0}
                animationEasing="ease-out"
              >
                {nutritionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">{t.recommendedValues}:</div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="p-2 rounded-md bg-green-100 text-green-800">
              {t.proteins}: 20-35%
            </div>
            <div className="p-2 rounded-md bg-amber-100 text-amber-800">
              {t.carbs}: 45-65%
            </div>
            <div className="p-2 rounded-md bg-blue-100 text-blue-800">
              {t.fats}: 20-35%
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            {nutritionData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-3 h-3 rounded-full mb-1" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="text-xs font-medium">{item.name}</div>
                <div className="text-xs">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleSaveProgress} className="w-full" variant="default" size="sm">
          <Save className="mr-1 h-4 w-4" />
          {t.save}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NutritionProgressWheel;
