import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const INITIAL_DATA = [
  { name: 'Proteins', value: 25, color: '#10B981' },
  { name: 'Carbs', value: 45, color: '#F59E0B' },
  { name: 'Fats', value: 30, color: '#3B82F6' },
];

const NutritionProgressWheel: React.FC = () => {
  const [nutritionData] = useState(INITIAL_DATA);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
          Nutrition Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={nutritionData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {nutritionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionProgressWheel;
