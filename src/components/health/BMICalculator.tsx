
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, BMIEntry } from '@/utils/localStorage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2 } from 'lucide-react';

const BMICalculator = () => {
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [history, setHistory] = useState<BMIEntry[]>(getLS(LS_KEYS.BMI_LOG, []));
  const { language } = useLanguage();

  const t = language === 'fr' ? {
    title: "Calculateur d'IMC", height: "Taille (cm)", weight: "Poids (kg)",
    calculate: "Calculer et Sauvegarder", yourBMI: "Votre IMC", status: "État",
    underweight: "Insuffisance pondérale", normal: "Normal", overweight: "Surpoids", obese: "Obésité", history: "Historique",
  } : {
    title: "BMI Calculator", height: "Height (cm)", weight: "Weight (kg)",
    calculate: "Calculate & Save", yourBMI: "Your BMI", status: "Status",
    underweight: "Underweight", normal: "Normal", overweight: "Overweight", obese: "Obese", history: "History",
  };

  const calculateBMI = () => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmiValue = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
      const s = bmiValue < 18.5 ? t.underweight : bmiValue < 25 ? t.normal : bmiValue < 30 ? t.overweight : t.obese;
      setBmi(bmiValue); setStatus(s);
      const entry: BMIEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), height, weight, bmi: bmiValue, status: s };
      const updated = [entry, ...history];
      setHistory(updated); setLS(LS_KEYS.BMI_LOG, updated);
      toast.success(`BMI: ${bmiValue} - ${s}`);
    }
  };

  const deleteEntry = (id: string) => { const updated = history.filter(e => e.id !== id); setHistory(updated); setLS(LS_KEYS.BMI_LOG, updated); };

  const chartData = [...history].reverse().slice(-10).map(e => ({ date: new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }), bmi: e.bmi }));

  return (
    <Card className="w-full mb-6">
      <CardHeader><CardTitle>{t.title}</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="height">{t.height}</Label><Input id="height" type="number" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} min="100" max="250" /></div>
            <div className="space-y-2"><Label htmlFor="weight">{t.weight}</Label><Input id="weight" type="number" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} min="30" max="300" /></div>
          </div>
          <Button onClick={calculateBMI} variant="secondary" className="w-full">{t.calculate}</Button>
          {bmi !== null && (
            <motion.div className="mt-4 p-4 border rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-semibold mb-2">{t.yourBMI}</h3>
              <div className="text-3xl font-bold">{bmi}</div>
              <div className="text-sm text-muted-foreground">{t.status}: {status}</div>
            </motion.div>
          )}
          {chartData.length > 1 && (
            <div>
              <h4 className="font-medium text-sm mb-2">{t.history}</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[15, 40]} /><Tooltip /><Line type="monotone" dataKey="bmi" stroke="hsl(var(--primary))" strokeWidth={2} /></LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {history.length > 0 && (
            <div className="space-y-1">
              {history.slice(0, 5).map(e => (
                <div key={e.id} className="flex items-center justify-between p-2 border rounded text-sm">
                  <span>{new Date(e.date).toLocaleDateString()} - BMI: {e.bmi} ({e.status})</span>
                  <Button variant="ghost" size="icon" onClick={() => deleteEntry(e.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BMICalculator;
