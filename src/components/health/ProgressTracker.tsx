import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabsTrigger } from '@/components/ui/scrollable-tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { 
  BarChart,
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  getProgressHistory, 
  getWaterIntakeToday,
  getSleepHistory, 
  getCalorieHistory,
  getExerciseHistory,
  updateDailyProgress,
  DailyProgress
} from '@/services/healthService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Droplet, Moon, Utensils, Activity, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataEntryDialog, { DataEntryType } from './DataEntryDialog';
import { useScreenSize } from '@/utils/mobile';

const ProgressTracker = () => {
  const [progressData, setProgressData] = useState<DailyProgress[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { language } = useLanguage();
  const { isMobile, isTablet } = useScreenSize();
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DataEntryType>('water');

  // Translations
  const translations = {
    en: {
      title: "Health Progress Tracker",
      overview: "Overview",
      water: "Water Intake",
      sleep: "Sleep",
      calories: "Calories",
      exercise: "Exercise",
      today: "Today",
      week: "7-Day Summary",
      loading: "Loading data...",
      noData: "No data available",
      date: "Date",
      value: "Value",
      hours: "hours",
      cups: "cups",
      caloriesUnit: "calories",
      minutes: "minutes",
      goal: "Goal",
      achieved: "Achieved",
      percentage: "Percentage",
      yesterdayCompare: "compared to yesterday",
      weeklyAverage: "Weekly Average",
      improvement: "Improvement",
      decline: "Decline",
      overall: "Overall",
      addData: "Add Data"
    },
    fr: {
      title: "Suivi de Progrès de Santé",
      overview: "Vue d'ensemble",
      water: "Hydratation",
      sleep: "Sommeil",
      calories: "Calories",
      exercise: "Exercice",
      today: "Aujourd'hui",
      week: "Résumé 7 jours",
      loading: "Chargement des données...",
      noData: "Aucune donnée disponible",
      date: "Date",
      value: "Valeur",
      hours: "heures",
      cups: "verres",
      caloriesUnit: "calories",
      minutes: "minutes",
      goal: "Objectif",
      achieved: "Réalisé",
      percentage: "Pourcentage",
      yesterdayCompare: "par rapport à hier",
      weeklyAverage: "Moyenne Hebdomadaire",
      improvement: "Amélioration",
      decline: "Baisse",
      overall: "Ensemble",
      addData: "Ajouter Données"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    // Update progress and then load data
    const updateAndLoadProgress = async () => {
      try {
        await updateDailyProgress();
        loadProgressData();
      } catch (error) {
        console.error("Error updating/loading progress data:", error);
      }
    };

    updateAndLoadProgress();
    
    // Update progress every 5 minutes
    const intervalId = setInterval(updateAndLoadProgress, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const loadProgressData = async () => {
    try {
      const data = await getProgressHistory(7);
      setProgressData(data);
    } catch (error) {
      console.error("Error loading progress data:", error);
    }
  };
  
  const handleAddData = (type: DataEntryType) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const getLatestProgress = () => {
    return progressData.length > 0 ? progressData[progressData.length - 1] : null;
  };

  const latest = getLatestProgress();

  // Colors for charts
  const COLORS = {
    water: '#3B82F6', // blue
    sleep: '#8B5CF6', // purple
    calories: '#F59E0B', // amber
    exercise: '#10B981', // emerald
    overall: '#6366F1' // indigo
  };

  const getChangeIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <span className="text-green-500">↑</span>;
    } else if (current < previous) {
      return <span className="text-red-500">↓</span>;
    }
    return <span className="text-gray-500">→</span>;
  };

  const getChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const calculateAverages = () => {
    if (progressData.length === 0) return null;
    
    const sum = progressData.reduce((acc, curr) => ({
      water_goal_percentage: (acc.water_goal_percentage || 0) + (curr.water_goal_percentage || 0),
      sleep_goal_percentage: (acc.sleep_goal_percentage || 0) + (curr.sleep_goal_percentage || 0),
      calories_goal_percentage: (acc.calories_goal_percentage || 0) + (curr.calories_goal_percentage || 0),
      exercise_goal_percentage: (acc.exercise_goal_percentage || 0) + (curr.exercise_goal_percentage || 0),
      overall_progress_percentage: (acc.overall_progress_percentage || 0) + (curr.overall_progress_percentage || 0)
    }), {
      water_goal_percentage: 0,
      sleep_goal_percentage: 0,
      calories_goal_percentage: 0,
      exercise_goal_percentage: 0,
      overall_progress_percentage: 0
    });
    
    return {
      water: sum.water_goal_percentage / progressData.length,
      sleep: sum.sleep_goal_percentage / progressData.length,
      calories: sum.calories_goal_percentage / progressData.length,
      exercise: sum.exercise_goal_percentage / progressData.length,
      overall: sum.overall_progress_percentage / progressData.length
    };
  };

  const averages = calculateAverages();

  const radarData = latest ? [
    {
      subject: t.water,
      A: latest.water_goal_percentage || 0,
      fullMark: 100,
    },
    {
      subject: t.sleep,
      A: latest.sleep_goal_percentage || 0,
      fullMark: 100,
    },
    {
      subject: t.calories,
      A: latest.calories_goal_percentage || 0,
      fullMark: 100,
    },
    {
      subject: t.exercise,
      A: latest.exercise_goal_percentage || 0,
      fullMark: 100,
    }
  ] : [];

  const pieData = latest ? [
    { name: t.water, value: latest.water_goal_percentage || 0, color: COLORS.water },
    { name: t.sleep, value: latest.sleep_goal_percentage || 0, color: COLORS.sleep },
    { name: t.calories, value: latest.calories_goal_percentage || 0, color: COLORS.calories },
    { name: t.exercise, value: latest.exercise_goal_percentage || 0, color: COLORS.exercise }
  ] : [];

  return (
    <Card className="w-full mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Activity className="mr-2" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <ScrollableTabsList className="w-full max-w-3xl mx-auto">
              <TabsTrigger value="overview" className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                {!isMobile && !isTablet && <span>{t.overview}</span>}
              </TabsTrigger>
              <TabsTrigger value="water" className="flex items-center">
                <Droplet className="w-4 h-4 mr-1" />
                {!isMobile && !isTablet && <span>{t.water}</span>}
              </TabsTrigger>
              <TabsTrigger value="sleep" className="flex items-center">
                <Moon className="w-4 h-4 mr-1" />
                {!isMobile && !isTablet && <span>{t.sleep}</span>}
              </TabsTrigger>
              <TabsTrigger value="calories" className="flex items-center">
                <Utensils className="w-4 h-4 mr-1" />
                {!isMobile && !isTablet && <span>{t.calories}</span>}
              </TabsTrigger>
              <TabsTrigger value="exercise" className="flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                {!isMobile && !isTablet && <span>{t.exercise}</span>}
              </TabsTrigger>
            </ScrollableTabsList>
            {activeTab !== 'overview' && (
              <Button 
                size="sm" 
                onClick={() => handleAddData(activeTab as DataEntryType)}
                variant="success"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                {!isMobile && !isTablet ? t.addData : ""}
              </Button>
            )}
          </div>
          
          <TabsContent value="overview" className="space-y-4 gap-4 ">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="h-72"
              >
                <h3 className="text-lg font-medium mb-2">{t.today}</h3>
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name={t.achieved}
                        dataKey="A"
                        stroke={COLORS.overall}
                        fill={COLORS.overall}
                        fillOpacity={0.6}
                        isAnimationActive={true}
                        animationDuration={1000}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    {t.noData}
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-72"
              >
                <h3 className="text-lg font-medium mb-2">{t.week}</h3>
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={progressData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => {
                          if (typeof value === 'number') {
                            return [`${value.toFixed(1)}%`];
                          }
                          return [value];
                        }}
                        labelFormatter={(label) => `${t.date}: ${new Date(label).toLocaleDateString()}`}
                      />
                      <Legend />
                      <Bar 
                        name={t.overall} 
                        dataKey="overall_progress_percentage" 
                        fill={COLORS.overall}
                        isAnimationActive={true}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    {t.noData}
                  </div>
                )}
              </motion.div>
            </div>
            <br/>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-4 space-y-4">
              {[
                { label: t.water, key: 'water_goal_percentage', color: COLORS.water, icon: <Droplet /> },
                { label: t.sleep, key: 'sleep_goal_percentage', color: COLORS.sleep, icon: <Moon /> },
                { label: t.calories, key: 'calories_goal_percentage', color: COLORS.calories, icon: <Utensils /> },
                { label: t.exercise, key: 'exercise_goal_percentage', color: COLORS.exercise, icon: <Activity /> }
              ].map((item, idx) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: item.color }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${item.color}20` }}>
                      {item.icon}
                    </div>
                    <h4 className="font-medium">{item.label}</h4>
                  </div>
                  {latest ? (
                    <>
                      <div className="text-2xl font-bold">
                        {(latest[item.key as keyof DailyProgress] as number)?.toFixed(1) || 0}%
                      </div>
                      {averages && (
                        <div className="text-sm text-gray-500">
                          {t.weeklyAverage}: {averages[item.key.split('_')[0] as keyof typeof averages].toFixed(1)}%
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400">{t.noData}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Water Intake Tab */}
          <TabsContent value="water">
            <div className="h-72">
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => {
                        if (typeof value === 'number') {
                          return [`${value.toFixed(1)}%`];
                        }
                        return [value];
                      }}
                      labelFormatter={(label) => `${t.date}: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Line
                      name={t.water}
                      type="monotone"
                      dataKey="water_goal_percentage"
                      stroke={COLORS.water}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {t.noData}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sleep Tab */}
          <TabsContent value="sleep">
            <div className="h-72">
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => {
                        if (typeof value === 'number') {
                          return [`${value.toFixed(1)}%`];
                        }
                        return [value];
                      }}
                      labelFormatter={(label) => `${t.date}: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Line
                      name={t.sleep}
                      type="monotone"
                      dataKey="sleep_goal_percentage"
                      stroke={COLORS.sleep}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {t.noData}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Calories Tab */}
          <TabsContent value="calories">
            <div className="h-72">
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => {
                        if (typeof value === 'number') {
                          return [`${value.toFixed(1)}%`];
                        }
                        return [value];
                      }}
                      labelFormatter={(label) => `${t.date}: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Line
                      name={t.calories}
                      type="monotone"
                      dataKey="calories_goal_percentage"
                      stroke={COLORS.calories}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {t.noData}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Exercise Tab */}
          <TabsContent value="exercise">
            <div className="h-72">
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => {
                        if (typeof value === 'number') {
                          return [`${value.toFixed(1)}%`];
                        }
                        return [value];
                      }}
                      labelFormatter={(label) => `${t.date}: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Line
                      name={t.exercise}
                      type="monotone"
                      dataKey="exercise_goal_percentage"
                      stroke={COLORS.exercise}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {t.noData}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Data Entry Dialog */}
        <DataEntryDialog
          type={dialogType}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={loadProgressData}
        />
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
