import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { getLS, setLS, LS_KEYS } from '@/utils/localStorage';
import Confetti from '@/components/Confetti';

interface QuizQuestion { id: string; question: string; options: string[]; correct: number; explanation: string; }

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', question: 'Which vitamin is primarily obtained from sunlight?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], correct: 2, explanation: 'Vitamin D is synthesized in the skin upon exposure to UVB radiation.' },
  { id: 'q2', question: 'How many glasses of water should you drink daily?', options: ['4 glasses', '6 glasses', '8 glasses', '12 glasses'], correct: 2, explanation: 'The general recommendation is about 8 glasses (2 liters) per day.' },
  { id: 'q3', question: 'Which macronutrient has the most calories per gram?', options: ['Protein', 'Carbohydrates', 'Fat', 'Fiber'], correct: 2, explanation: 'Fat provides 9 calories per gram vs 4 for protein and carbs.' },
  { id: 'q4', question: 'What mineral is essential for bone health?', options: ['Iron', 'Calcium', 'Zinc', 'Potassium'], correct: 1, explanation: 'Calcium is the primary mineral for bone structure.' },
  { id: 'q5', question: 'Which food is the best source of omega-3?', options: ['Chicken', 'Salmon', 'Rice', 'Bread'], correct: 1, explanation: 'Fatty fish like salmon are richest in omega-3.' },
  { id: 'q6', question: 'What is the recommended daily fiber intake?', options: ['10-15g', '15-20g', '25-30g', '40-50g'], correct: 2, explanation: 'Adults should aim for 25-30g of fiber daily.' },
  { id: 'q7', question: 'Which fruit has the highest potassium?', options: ['Apple', 'Orange', 'Banana', 'Grape'], correct: 2, explanation: 'Bananas have ~422mg potassium per medium banana.' },
  { id: 'q8', question: 'How many hours of sleep do adults need?', options: ['4-5 hours', '5-6 hours', '7-9 hours', '10-12 hours'], correct: 2, explanation: 'Most adults need 7-9 hours per night.' },
  { id: 'q9', question: 'Which nutrient builds and repairs muscle?', options: ['Vitamin C', 'Carbohydrates', 'Protein', 'Fat'], correct: 2, explanation: 'Protein provides amino acids for muscle repair.' },
  { id: 'q10', question: 'What is the healthiest oil for high-heat cooking?', options: ['Butter', 'Olive oil', 'Avocado oil', 'Coconut oil'], correct: 2, explanation: 'Avocado oil has the highest smoke point (~520°F).' },
  { id: 'q11', question: 'Which is a complete protein source?', options: ['Rice', 'Beans', 'Quinoa', 'Corn'], correct: 2, explanation: 'Quinoa has all 9 essential amino acids.' },
  { id: 'q12', question: 'What % of daily calories should come from carbs?', options: ['10-20%', '25-35%', '45-65%', '70-80%'], correct: 2, explanation: 'Guidelines recommend 45-65% from carbohydrates.' },
];

const NutritionQuiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];
  const totalQ = QUIZ_QUESTIONS.length;

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx); setShowResult(true);
    const correct = idx === question.correct;
    if (correct) setScore(s => s + 1);
    setAnswered([...answered, correct]);
  };

  const nextQuestion = () => {
    if (currentQ < totalQ - 1) { setCurrentQ(currentQ + 1); setSelected(null); setShowResult(false); }
    else {
      setQuizDone(true);
      const points = score * 10;
      if (points > 0) { const current = getLS<number>(LS_KEYS.POINTS, 0); setLS(LS_KEYS.POINTS, current + points); }
      if (score >= totalQ * 0.7) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500); }
    }
  };

  const restart = () => { setCurrentQ(0); setSelected(null); setShowResult(false); setScore(0); setAnswered([]); setQuizDone(false); };

  if (quizDone) {
    const pct = Math.round((score / totalQ) * 100);
    return (
      <>
        <Confetti active={showConfetti} />
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Trophy className={`h-16 w-16 mx-auto ${pct >= 70 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-4xl font-bold text-primary">{score}/{totalQ}</p>
            <p className="text-muted-foreground">{pct}% — {score * 10} points earned!</p>
            <Progress value={pct} className="h-3 max-w-xs mx-auto" />
            <Badge variant={pct >= 70 ? 'default' : 'secondary'}>
              {pct >= 90 ? 'Nutrition Expert! 🏆' : pct >= 70 ? 'Well Done! 🎉' : pct >= 50 ? 'Good Try! 💪' : 'Keep Learning! 📚'}
            </Badge>
            <Button onClick={restart} className="mt-4"><RotateCcw className="h-4 w-4 mr-2" />Try Again</Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between"><span className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-500" />Nutrition Quiz</span><Badge variant="outline">{currentQ + 1}/{totalQ}</Badge></CardTitle>
        <Progress value={(currentQ / totalQ) * 100} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            let cls = 'w-full text-left p-3 rounded-lg border transition-colors ';
            if (showResult) {
              if (idx === question.correct) cls += 'border-green-500 bg-green-50 dark:bg-green-900/20';
              else if (idx === selected) cls += 'border-red-500 bg-red-50 dark:bg-red-900/20';
              else cls += 'border-muted opacity-50';
            } else { cls += selected === idx ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50 hover:bg-muted/50 cursor-pointer'; }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} className={cls} disabled={showResult}>
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0">{String.fromCharCode(65 + idx)}</span>
                  {opt}
                  {showResult && idx === question.correct && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                  {showResult && idx === selected && idx !== question.correct && <XCircle className="h-4 w-4 text-red-500 ml-auto" />}
                </span>
              </button>
            );
          })}
        </div>
        {showResult && <div className="bg-muted p-3 rounded-lg"><p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p></div>}
        {showResult && <Button onClick={nextQuestion} className="w-full">{currentQ < totalQ - 1 ? 'Next Question' : 'See Results'}</Button>}
        <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Score: {score}/{answered.length}</span><span>{totalQ - currentQ - (showResult ? 0 : 1)} remaining</span></div>
      </CardContent>
    </Card>
  );
};

export default NutritionQuiz;
