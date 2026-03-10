import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ChevronDown, 
  Utensils, 
  Activity, 
  DropletIcon, 
  Award, 
  Clock, 
  Flame,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const WelcomePage = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false
  });
  
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    const currentUser = localStorage.getItem('th_current_user');
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Auto-rotate features for preview
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthenticated = async (user: any) => {
    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate welcome notifications
    const existingNotifs = JSON.parse(localStorage.getItem('th_notifications') || '[]');
    if (existingNotifs.length === 0) {
      const welcomeNotifs = [
        { 
          id: crypto.randomUUID(), 
          date: new Date().toISOString(), 
          title: `Welcome to TasteHealth, ${user.firstName}!`, 
          message: "We're thrilled to have you join our community. Your journey to better nutrition starts now!",
          read: false,
          type: 'welcome'
        },
        { 
          id: crypto.randomUUID(), 
          date: new Date().toISOString(), 
          title: 'Complete Your Health Profile', 
          message: 'Take a moment to set up your profile with your health details for personalized recommendations.',
          read: false,
          type: 'profile'
        },
        { 
          id: crypto.randomUUID(), 
          date: new Date().toISOString(), 
          title: 'Set Your First Goal', 
          message: 'Use our Goal Wizard to set your daily nutrition targets.',
          read: false,
          type: 'goal'
        },
        { 
          id: crypto.randomUUID(), 
          date: new Date().toISOString(), 
          title: 'Explore Meal Plans', 
          message: 'Browse our meal database and create your weekly meal plan.',
          read: false,
          type: 'meal'
        }
      ];
      localStorage.setItem('th_notifications', JSON.stringify(welcomeNotifs));
    }
    
    setIsLoading(false);
    navigate("/dashboard");
  };

  const features = [
    { icon: <Utensils className="h-6 w-6 text-th-green-600" />, title: 'Smart Meal Planning', desc: 'Create personalized meal plans based on your preferences, goals, and dietary restrictions.', color: 'green' },
    { icon: <Activity className="h-6 w-6 text-red-500" />, title: 'Progress Tracking', desc: 'Monitor weight, BMI, water intake, calories, macros, and sleep with visual analytics.', color: 'red' },
    { icon: <DropletIcon className="h-6 w-6 text-blue-600" />, title: 'Hydration Tracking', desc: 'Never forget to drink water with smart reminders and progress tracking.', color: 'blue' },
    { icon: <Award className="h-6 w-6 text-yellow-900" />, title: 'Rewards & Achievements', desc: 'Stay motivated with badges, rewards, and milestone celebrations.', color: 'amber' },
    { icon: <Clock className="h-6 w-6 text-th-green-600" />, title: 'Meal Prep Timer', desc: 'Make meal preparation enjoyable with interactive timers and step-by-step guides.', color: 'green' },
    { icon: <Flame className="h-6 w-6 text-yellow-500" />, title: 'Nutrition Insights', desc: 'Understand your dietary habits with detailed analytics and recommendations.', color: 'yellow' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-th-green-50 to-white">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-th-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-th-green-800 font-medium">Setting up your account...</p>
            <p className="text-sm text-gray-500 mt-2">Just a moment please</p>
          </div>
        </div>
      )}

      <header className="w-full py-4 px-6 flex justify-between items-center backdrop-blur-sm bg-white/50 sticky top-0 z-10">
        <Logo size="lg" />
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-th-green-700 hover:text-th-green-800 hover:bg-th-green-100"
            onClick={() => setShowAuthForm(true)}
          >
            Sign In
          </Button>
          <Button 
            className="bg-th-green-600 hover:bg-th-green-700 text-white shadow-lg"
            onClick={() => setShowAuthForm(true)}
          >
            Join Free
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {showAuthForm ? (
          <div className="w-full max-w-md mx-auto animate-fade-in py-8">
            <AuthForm onAuthenticated={handleAuthenticated} />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className={`container max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center py-12 transition-all duration-1000 transform ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-th-green-800">
                  Nourish Your Future with{' '}
                  <span className="text-th-green-600">TasteHealth</span>
                </h1>
                
                <p className="text-lg text-gray-600 max-w-lg">
                  Your personal nutrition guide for a healthier lifestyle. 
                  Plan meals, track progress, and celebrate achievements on your wellness journey.
                </p>
                
                {/* Feature Preview */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 max-w-md mx-auto md:mx-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-th-${features[activeFeature].color}-100`}>
                      {features[activeFeature].icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{features[activeFeature].title}</h4>
                      <p className="text-xs text-gray-500">{features[activeFeature].desc.substring(0, 60)}...</p>
                    </div>
                  </div>
                  <div className="flex gap-1 justify-center">
                    {features.slice(0, 5).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 w-6 rounded-full transition-all ${i === activeFeature ? 'bg-th-green-600' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button 
                    size="lg" 
                    className="bg-th-green-600 hover:bg-th-green-700 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all group"
                    onClick={() => setShowAuthForm(true)}
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-th-green-600 text-th-green-600 hover:bg-th-green-50 py-6 rounded-full"
                    onClick={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Learn More
                  </Button>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })} 
                    className="inline-flex items-center gap-2 text-th-green-600 hover:text-th-green-700"
                  >
                    Explore Features <ChevronDown className="h-4 w-4 animate-bounce-slow" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center relative">
                <div className="absolute inset-0 bg-th-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative group">
                  <img 
                    src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=1470&auto=format&fit=crop" 
                    alt="Healthy food preparation" 
                    className="relative rounded-3xl shadow-xl object-cover w-full max-w-md aspect-[3/4] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Today's Meal Plan</p>
                        <p className="text-xs text-gray-500">Quinoa Bowl • 450 cal</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-th-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <section 
              id="features" 
              ref={featuresRef}
              className={`py-20 px-4 w-full transition-all duration-1000 transform ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-th-green-800 mb-4">
                    Everything You Need For Healthier Living
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    TasteHealth combines nutrition planning, progress tracking, and personalized recommendations 
                    to support your wellness journey.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, i) => (
                    <div 
                      key={i} 
                      className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group"
                    >
                      <div className={`h-14 w-14 bg-th-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{feature.desc}</p>
                      <button className="text-th-green-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Learn more <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <Button 
                    size="lg" 
                    className="bg-th-green-600 hover:bg-th-green-700 text-white px-8 py-6 rounded-full shadow-lg"
                    onClick={() => setShowAuthForm(true)}
                  >
                    Start Your Health Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;