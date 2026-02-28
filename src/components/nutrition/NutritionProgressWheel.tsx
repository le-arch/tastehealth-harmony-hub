import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface NutritionProgressWheelProps {
  protein?: number;
  carbs?: number;
  fats?: number;
}

const NutritionProgressWheel: React.FC<NutritionProgressWheelProps> = ({
  protein = 45,
  carbs = 120,
  fats = 40,
}) => {
  const [nutritionData, setNutritionData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  
  useEffect(() => {
    // Calculate total macros
    const total = protein + carbs + fats;
    
    if (total === 0) {
      setNutritionData([
        { name: 'Proteins', value: 33, color: '#10B981' },
        { name: 'Carbs', value: 33, color: '#F59E0B' },
        { name: 'Fats', value: 34, color: '#3B82F6' },
      ]);
    } else {
      const proteinPercent = (protein / total) * 100;
      const carbsPercent = (carbs / total) * 100;
      const fatsPercent = (fats / total) * 100;

      setNutritionData([
        { name: `Proteins (${Math.round(proteinPercent)}%)`, value: proteinPercent, color: '#10B981' },
        { name: `Carbs (${Math.round(carbsPercent)}%)`, value: carbsPercent, color: '#F59E0B' },
        { name: `Fats (${Math.round(fatsPercent)}%)`, value: fatsPercent, color: '#3B82F6' },
      ]);
    }
  }, [protein, carbs, fats]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
          Nutrition Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 space-y-4">
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={nutritionData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {nutritionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => `${Math.round(value as number)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Macro breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Protein: {Math.round(protein)}g</span>
            <span className="text-muted-foreground text-xs">{((protein / (protein + carbs + fats)) * 100).toFixed(0)}%</span>
          </div>
          <Progress value={(protein / (protein + carbs + fats)) * 100 || 0} className="h-2" />
          
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Carbs: {Math.round(carbs)}g</span>
            <span className="text-muted-foreground text-xs">{((carbs / (protein + carbs + fats)) * 100).toFixed(0)}%</span>
          </div>
          <Progress value={(carbs / (protein + carbs + fats)) * 100 || 0} className="h-2" />
          
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Fats: {Math.round(fats)}g</span>
            <span className="text-muted-foreground text-xs">{((fats / (protein + carbs + fats)) * 100).toFixed(0)}%</span>
          </div>
          <Progress value={(fats / (protein + carbs + fats)) * 100 || 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionProgressWheel;
