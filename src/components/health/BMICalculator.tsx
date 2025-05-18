
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { saveBMIRecord, getBMIHistory, BMIRecord } from '@/services/healthService';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const BMICalculator = () => {
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [history, setHistory] = useState<BMIRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  // Translations
  const translations = {
    en: {
      title: "BMI Calculator",
      description: "Track your BMI (Body Mass Index) over time",
      height: "Height (cm)",
      weight: "Weight (kg)",
      calculate: "Calculate BMI",
      save: "Save Record",
      yourBMI: "Your BMI",
      status: "Status",
      history: "BMI History",
      date: "Date",
      underweight: "Underweight",
      normal: "Normal",
      overweight: "Overweight",
      obese: "Obese",
      saveSuccess: "BMI saved successfully!",
      calculationError: "Please enter valid height and weight values."
    },
    fr: {
      title: "Calculateur d'IMC",
      description: "Suivez votre IMC (Indice de Masse Corporelle) au fil du temps",
      height: "Taille (cm)",
      weight: "Poids (kg)",
      calculate: "Calculer l'IMC",
      save: "Enregistrer",
      yourBMI: "Votre IMC",
      status: "État",
      history: "Historique d'IMC",
      date: "Date",
      underweight: "Insuffisance pondérale",
      normal: "Normal",
      overweight: "Surpoids",
      obese: "Obésité",
      saveSuccess: "IMC enregistré avec succès !",
      calculationError: "Veuillez entrer des valeurs de taille et de poids valides."
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    loadBMIHistory();
  }, []);

  const loadBMIHistory = async () => {
    try {
      const historyData = await getBMIHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading BMI history:", error);
    }
  };

  const calculateBMI = () => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      const bmiValue = parseFloat(calculatedBMI.toFixed(1));
      setBmi(bmiValue);

      let calculatedStatus;
      if (bmiValue < 18.5) {
        calculatedStatus = t.underweight;
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        calculatedStatus = t.normal;
      } else if (bmiValue >= 25 && bmiValue < 30) {
        calculatedStatus = t.overweight;
      } else {
        calculatedStatus = t.obese;
      }

      setStatus(calculatedStatus);
    } else {
      toast({
        title: t.calculationError
      });
    }
  };

  const handleSaveBMI = async () => {
    if (height > 0 && weight > 0) {
      setLoading(true);
      try {
        await saveBMIRecord(height, weight);
        await loadBMIHistory();
        toast({
          title: t.saveSuccess
        });
      } catch (error) {
        console.error("Error saving BMI record:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getBMIColor = (bmiValue: number) => {
    if (bmiValue < 18.5) return '#3B82F6'; // blue for underweight
    if (bmiValue >= 18.5 && bmiValue < 25) return '#10B981'; // green for normal
    if (bmiValue >= 25 && bmiValue < 30) return '#F59E0B'; // amber for overweight
    return '#EF4444'; // red for obese
  };

  const getStatusColor = () => {
    if (!bmi) return 'bg-gray-200';
    return getBMIColor(bmi).replace('#', 'bg-[#') + ']';
  };

  const chartData = history.map(item => ({
    date: new Date(item.recorded_at).toLocaleDateString(),
    bmi: item.bmi,
    weight: item.weight,
    color: getBMIColor(item.bmi)
  }));

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">{t.height}</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value))}
                  min="100"
                  max="250"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">{t.weight}</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  min="30"
                  max="300"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={calculateBMI} variant="secondary">
                  {t.calculate}
                </Button>
                <Button onClick={handleSaveBMI} disabled={bmi === null || loading}>
                  {loading ? 
                    <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 
                    t.save
                  }
                </Button>
              </div>
            </div>

            {bmi !== null && (
              <motion.div 
                className="mt-6 p-4 border rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold mb-2">{t.yourBMI}</h3>
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="text-3xl font-bold"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {bmi}
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">{t.status}</span>
                    <span className={`px-3 py-1 text-white text-sm rounded-full ${getStatusColor()}`}>
                      {status}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="h-64">
            <h3 className="text-lg font-semibold mb-2">{t.history}</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData.reverse()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[
                    Math.floor(Math.min(...chartData.map(item => item.bmi)) - 2), 
                    Math.ceil(Math.max(...chartData.map(item => item.bmi)) + 2)
                  ]} />
                  <Tooltip 
                    formatter={(value) => [`${value}`, t.yourBMI]}
                    labelFormatter={(label) => `${t.date}: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="bmi"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ fill: '#6366F1', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No history data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BMICalculator;
