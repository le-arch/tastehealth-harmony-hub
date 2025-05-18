import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, CalendarCheck, Heart, ChartLine } from "lucide-react";

interface DailyProgress {
  date: string;
  water_goal_percentage: number;
  sleep_goal_percentage: number;
  calories_goal_percentage: number;
  exercise_goal_percentage: number;
  overall_progress_percentage: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const WeeklySummary: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [averages, setAverages] = useState({
    water: 0,
    sleep: 0,
    calories: 0,
    exercise: 0,
    overall: 0
  });

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      // Get data for the past 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Past 7 days including today
      
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setWeeklyData(data);
        
        // Calculate averages
        const waterSum = data.reduce((sum, day) => sum + (day.water_goal_percentage || 0), 0);
        const sleepSum = data.reduce((sum, day) => sum + (day.sleep_goal_percentage || 0), 0);
        const caloriesSum = data.reduce((sum, day) => sum + (day.calories_goal_percentage || 0), 0);
        const exerciseSum = data.reduce((sum, day) => sum + (day.exercise_goal_percentage || 0), 0);
        const overallSum = data.reduce((sum, day) => sum + (day.overall_progress_percentage || 0), 0);
        
        setAverages({
          water: Math.round(waterSum / data.length) || 0,
          sleep: Math.round(sleepSum / data.length) || 0,
          calories: Math.round(caloriesSum / data.length) || 0,
          exercise: Math.round(exerciseSum / data.length) || 0,
          overall: Math.round(overallSum / data.length) || 0
        });
      }
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = weeklyData.map(day => ({
    date: formatDate(day.date),
    water: day.water_goal_percentage || 0,
    sleep: day.sleep_goal_percentage || 0,
    calories: day.calories_goal_percentage || 0,
    exercise: day.exercise_goal_percentage || 0,
    overall: day.overall_progress_percentage || 0
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Weekly Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading your weekly data...</p>
          ) : weeklyData.length === 0 ? (
            <div className="text-center py-4">
              <p>No data available for this week yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete your daily goals to see your progress here!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']} 
                      labelFormatter={(label) => `${label}` }
                    />
                    <Line 
                      type="monotone" 
                      dataKey="overall" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <ChartBar className="h-4 w-4" /> Overall
                    </span>
                    <span>{averages.overall}%</span>
                  </div>
                  <Progress value={averages.overall} className="h-2" indicatorClassName="bg-primary" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <ChartLine className="h-4 w-4" /> Exercise
                    </span>
                    <span>{averages.exercise}%</span>
                  </div>
                  <Progress value={averages.exercise} className="h-2" indicatorClassName="bg-nutrition-protein" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> Sleep
                    </span>
                    <span>{averages.sleep}%</span>
                  </div>
                  <Progress value={averages.sleep} className="h-2" indicatorClassName="bg-blue-500" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <ChartBar className="h-4 w-4" /> Calories
                    </span>
                    <span>{averages.calories}%</span>
                  </div>
                  <Progress value={averages.calories} className="h-2" indicatorClassName="bg-nutrition-carbs" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklySummary;
//       </CardContent>