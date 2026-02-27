import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const BMICalculator = () => {
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const { language } = useLanguage();

  const t = language === 'fr' ? {
    title: "Calculateur d'IMC", height: "Taille (cm)", weight: "Poids (kg)",
    calculate: "Calculer l'IMC", yourBMI: "Votre IMC", status: "État",
    underweight: "Insuffisance pondérale", normal: "Normal", overweight: "Surpoids", obese: "Obésité",
  } : {
    title: "BMI Calculator", height: "Height (cm)", weight: "Weight (kg)",
    calculate: "Calculate BMI", yourBMI: "Your BMI", status: "Status",
    underweight: "Underweight", normal: "Normal", overweight: "Overweight", obese: "Obese",
  };

  const calculateBMI = () => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmiValue = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
      setBmi(bmiValue);
      setStatus(bmiValue < 18.5 ? t.underweight : bmiValue < 25 ? t.normal : bmiValue < 30 ? t.overweight : t.obese);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader><CardTitle>{t.title}</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height">{t.height}</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} min="100" max="250" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">{t.weight}</Label>
            <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} min="30" max="300" />
          </div>
          <Button onClick={calculateBMI} variant="secondary">{t.calculate}</Button>
          {bmi !== null && (
            <motion.div className="mt-4 p-4 border rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-semibold mb-2">{t.yourBMI}</h3>
              <div className="text-3xl font-bold">{bmi}</div>
              <div className="text-sm text-muted-foreground">{t.status}: {status}</div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BMICalculator;
