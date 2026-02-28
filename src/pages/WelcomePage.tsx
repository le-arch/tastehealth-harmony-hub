import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Utensils, Activity, DropletIcon, Award, Clock, Flame } from "lucide-react";

const WelcomePage = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    const currentUser = localStorage.getItem('th_current_user');
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleAuthenticated = (user: any) => {
    // Generate welcome notifications for new users
    const existingNotifs = JSON.parse(localStorage.getItem('th_notifications') || '[]');
    if (existingNotifs.length === 0) {
      const welcomeNotifs = [
        { id: crypto.randomUUID(), date: new Date().toISOString(), title: `Welcome, ${user.firstName}!`, message: 'Start tracking your nutrition and health metrics today.', read: false },
        { id: crypto.randomUUID(), date: new Date().toISOString(), title: 'Complete Your Profile', message: 'Visit your profile page to add your health details.', read: false },
        { id: crypto.randomUUID(), date: new Date().toISOString(), title: 'Set Nutrition Goals', message: 'Use the Goal Wizard to set your daily nutrition targets.', read: false },
        { id: crypto.randomUUID(), date: new Date().toISOString(), title: 'Explore Meal Plans', message: 'Browse our meal database and create your weekly meal plan.', read: false },
      ];
      localStorage.setItem('th_notifications', JSON.stringify(welcomeNotifs));
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <Logo size="lg" />
        <Button variant="ghost" className="text-th-green-700 hover:text-th-green-800 hover:bg-th-green-100" onClick={() => setShowAuthForm(true)}>Sign Up</Button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {showAuthForm ? (
          <div className="w-full max-w-md mx-auto animate-fade-in">
            <AuthForm onAuthenticated={handleAuthenticated} />
          </div>
        ) : (
          <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center py-12">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-th-green-800">
                Nourish Your Future with <span className="text-th-green-600">TasteHealth</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">Your personal nutrition guide for a healthier lifestyle. Plan meals, track progress, and celebrate achievements on your wellness journey.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-th-green-600 hover:bg-th-green-700 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all" onClick={() => setShowAuthForm(true)}>
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-th-green-600 text-th-green-600 hover:bg-th-green-50 py-6 rounded-full">Learn More</Button>
              </div>
              <div className="pt-4">
                <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 text-th-green-600 hover:text-th-green-700">
                  Explore Features <ChevronDown className="h-4 w-4 animate-bounce-slow" />
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-th-green-500 rounded-full blur-3xl opacity-20"></div>
                <img src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=1470&auto=format&fit=crop" alt="Healthy food" className="relative rounded-3xl shadow-xl object-cover w-full aspect-[3/4]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {!showAuthForm && (
        <section id="features" className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-th-green-800">Everything You Need For Healthier Living</h2>
              <p className="mt-4 text-gray-600 max-w-xl mx-auto">TasteHealth combines nutrition planning, progress tracking, and personalized recommendations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Utensils className="h-6 w-6 text-th-green-600" />, title: 'Meal Planning', desc: 'Create personalized meal plans based on your preferences and nutritional goals.' },
                { icon: <Activity className="h-6 w-6 text-red-500" />, title: 'Progress Tracking', desc: 'Monitor weight, BMI, water intake, calories, and sleep with visual analytics.' },
                { icon: <DropletIcon className="h-6 w-6 text-blue-600" />, title: 'Hydration Tracking', desc: 'Never forget to drink water with gamified hydration tracking.' },
                { icon: <Award className="h-6 w-6 text-yellow-900" />, title: 'Rewards & Achievements', desc: 'Stay motivated with badges, rewards, and milestone celebrations.' },
                { icon: <Clock className="h-6 w-6 text-th-green-600" />, title: 'Meal Prep Timer', desc: 'Make meal preparation enjoyable with interactive timers.' },
                { icon: <Flame className="h-6 w-6 text-yellow-500" />, title: 'Nutrition Insights', desc: 'Understand dietary habits with detailed analytics and recommendations.' },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="h-12 w-12 bg-th-green-100 rounded-full flex items-center justify-center mb-4">{f.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-th-green-600 hover:bg-th-green-700 text-white px-8 py-6 rounded-full shadow-lg" onClick={() => setShowAuthForm(true)}>
                Start Your Health Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default WelcomePage;
