import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, X, Sparkles } from "lucide-react";
import { useT } from "@/hooks/useTranslate";

const STORAGE_KEY = "th_tour_seen_v1";

const STEPS = [
  {
    title: "Welcome to TasteHealth!",
    body: "Track meals, hit goals, and earn XP across 15 levels. We'll show you the essentials in a few quick tips.",
  },
  {
    title: "Your Dashboard",
    body: "Daily check-in, streaks, weather, the Meal Prep Assistant and recommended meals all live here. Tap any meal to see its full nutrition.",
  },
  {
    title: "Plan your week",
    body: "Open Meal Planning to build a weekly timetable. Scheduled meals automatically appear in Today's Meal — no manual logging needed.",
  },
  {
    title: "Track your progress",
    body: "The Progress page shows calories, water, sleep, exercise, heart rate, blood pressure and more. You'll get alerts when vitals fall outside the normal range.",
  },
  {
    title: "Need help?",
    body: "Look for the small (?) icons next to features for quick tips. You can also revisit this tour anytime from the How To Use page.",
  },
];

const TourStep: React.FC<{ title: string; body: string }> = ({ title, body }) => {
  const t = useT(title);
  const b = useT(body);
  return (
    <>
      <h3 className="text-lg font-bold mb-2">{t}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{b}</p>
    </>
  );
};

const OnboardingTour: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const nextLabel = useT("Next");
  const backLabel = useT("Back");
  const skipLabel = useT("Skip");
  const finishLabel = useT("Got it");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={dismiss}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm"
        >
          <Card className="border-primary/30 shadow-2xl">
            <CardContent className="p-5 relative">
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 mb-3 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {step + 1} / {STEPS.length}
                </span>
              </div>
              <TourStep title={current.title} body={current.body} />
              <div className="flex items-center justify-between mt-5 gap-2">
                <Button variant="ghost" size="sm" onClick={dismiss}>
                  {skipLabel}
                </Button>
                <div className="flex gap-2">
                  {step > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> {backLabel}
                    </Button>
                  )}
                  {isLast ? (
                    <Button size="sm" onClick={dismiss}>{finishLabel}</Button>
                  ) : (
                    <Button size="sm" onClick={() => setStep(step + 1)}>
                      {nextLabel} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
