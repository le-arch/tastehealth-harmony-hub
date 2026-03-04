import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { getLS, setLS, LS_KEYS } from '@/utils/localStorage';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', question: 'Which vitamin is primarily obtained from sunlight?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], correct: 2, explanation: 'Vitamin D is synthesized in the skin upon exposure to UVB radiation from sunlight.' },
  { id: 'q2', question: 'How many glasses of water should you drink daily?', options: ['4 glasses', '6 glasses', '8 glasses', '12 glasses'], correct: 2, explanation: 'The general recommendation is about 8 glasses (2 liters) of water per day.' },
  { id: 'q3', question: 'Which macronutrient has the most calories per gram?', options: ['Protein', 'Carbohydrates', 'Fat', 'Fiber'], correct: 2, explanation: 'Fat provides 9 calories per gram, while protein and carbs provide only 4 calories per gram.' },
  { id: 'q4', question: 'What mineral is essential for bone health?', options: ['Iron', 'Calcium', 'Zinc', 'Potassium'], correct: 1, explanation: 'Calcium is the primary mineral that makes up bone structure and strength.' },
  { id: 'q5', question: 'Which food is the best source of omega-3 fatty acids?', options: ['Chicken', 'Salmon', 'Rice', 'Bread'], correct: 1, explanation: 'Fatty fish like salmon are the richest dietary source of omega-3 fatty acids (EPA and DHA).' },
  { id: 'q6', question: 'What is the recommended daily fiber intake for adults?', options: ['10-15g', '15-20g', '25-30g', '40-50g'], correct: 2, explanation: 'Adults should aim for 25-30 grams of dietary fiber per day for optimal digestive health.' },
  { id: 'q7', question: 'Which fruit has the highest potassium content?', options: ['Apple', 'Orange', 'Banana', 'Grape'], correct: 2, explanation: 'Bananas are well-known for their high potassium content (~422mg per medium banana).' },
  { id: 'q8', question: 'How many hours of sleep do adults need per night?', options: ['4-5 hours', '5-6 hours', '7-9 hours', '10-12 hours'], correct: 2, explanation: 'Most adults need 7-9 hours of sleep per night for optimal health and functioning.' },
  { id: 'q9', question: 'Which nutrient helps build and repair muscle tissue?', options: ['Vitamin C', 'Carbohydrates', 'Protein', 'Fat'], correct: 2, explanation: 'Protein provides amino acids that are the building blocks for muscle tissue repair and growth.' },
  { id: 'q10', question: 'What is the healthiest cooking oil for high-heat cooking?', options: ['Butter', 'Olive oil', 'Avocado oil', 'Coconut oil'], correct: 2, explanation: 'Avocado oil has the highest smoke point (~520°F) making it ideal for high-heat cooking.' },
  { id: 'q11', question: 'Which of these is a complete protein source?', options: ['Rice', 'Beans', 'Quinoa', 'Corn'], correct: 2, explanation: 'Quinoa contains all 9 essential amino acids, making it a rare plant-based complete protein.' },
  { id: 'q12', question: 'What percentage of your daily calories should come from carbs?', options: ['10-20%', '25-35%', '45-65%', '70-80%'], correct: 2, explanation: 'The Dietary Guidelines recommend 45-65% of total daily calories come from carbohydrates.' },
];

const NutritionQuiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [quizDone, setQuizDone] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];
  const totalQ = QUIZ_QUESTIONS.length;

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === question.correct;
    if (correct) setScore(s => s + 1);
    setAnswered([...answered, correct]);
  };

  const nextQuestion = () => {
    if (currentQ < totalQ - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setQuizDone(true);
      // Award points
      const points = score * 10;
      if (points > 0) {
        const current = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, current + points);
      }
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswered([]);
    setQuizDone(false);
  };

  if (quizDone) {
    const pct = Math.round((score / totalQ) * 100);
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className={`h-16 w-16 mx-auto ${pct >= 70 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <p className="text-4xl font-bold text-primary">{score}/{totalQ}</p>
          <p className="text-muted-foreground">You scored {pct}% — {score * 10} points earned!</p>
          <Progress value={pct} className="h-3 max-w-xs mx-auto" />
          <Badge variant={pct >= 70 ? 'default' : 'secondary'} className="text-sm">
            {pct >= 90 ? 'Nutrition Expert! 🏆' : pct >= 70 ? 'Well Done! 🎉' : pct >= 50 ? 'Good Try! 💪' : 'Keep Learning! 📚'}
          </Badge>
          <Button onClick={restart} className="mt-4">
            <RotateCcw className="h-4 w-4 mr-2" />Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-500" />Nutrition Quiz</span>
          <Badge variant="outline">{currentQ + 1}/{totalQ}</Badge>
        </CardTitle>
        <Progress value={((currentQ) / totalQ) * 100} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            let cls = 'w-full text-left p-3 rounded-lg border transition-colors ';
            if (showResult) {
              if (idx === question.correct) cls += 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
              else if (idx === selected) cls += 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
              else cls += 'border-muted opacity-50';
            } else {
              cls += selected === idx ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50 hover:bg-muted/50 cursor-pointer';
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} className={cls} disabled={showResult}>
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                  {showResult && idx === question.correct && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                  {showResult && idx === selected && idx !== question.correct && <XCircle className="h-4 w-4 text-red-500 ml-auto" />}
                </span>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p>
          </div>
        )}
        {showResult && (
          <Button onClick={nextQuestion} className="w-full">
            {currentQ < totalQ - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Score: {score}/{answered.length}</span>
          <span>{totalQ - currentQ - (showResult ? 0 : 1)} remaining</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionQuiz;
