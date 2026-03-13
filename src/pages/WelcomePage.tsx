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
  ChevronRight,
  Target,
  Heart,
  Brain,
  Moon,
  Sun,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Leaf,
  Coffee,
  Apple,
  BarChart,
  Download,
  MessageCircle,
  Bell,
  Smartphone,
  Globe,
  Lock,
  Star,
  ThumbsUp,
  Mail,
  Rocket,
  Gift,
  Camera,
  Video,
  PlayCircle,
  FileText,
  HelpCircle,
  Facebook,
  Twitter,
  Instagram,
  Github
} from "lucide-react";

const WelcomePage = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState({
    hero: true,
    features: false,
    benefits: false,
    waitlist: false,
    faq: false
  });
  
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const waitlistRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

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
      { threshold: 0.1, rootMargin: "0px" }
    );

    // Observe all sections
    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (benefitsRef.current) observer.observe(benefitsRef.current);
    if (waitlistRef.current) observer.observe(waitlistRef.current);
    if (faqRef.current) observer.observe(faqRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (benefitsRef.current) observer.unobserve(benefitsRef.current);
      if (waitlistRef.current) observer.unobserve(waitlistRef.current);
      if (faqRef.current) observer.unobserve(faqRef.current);
    };
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

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send this to your backend
      console.log("Waitlist email:", email);
      setWaitlistSubmitted(true);
      setEmail("");
      // Show success message
      setTimeout(() => setWaitlistSubmitted(false), 5000);
    }
  };

  const features = [
    { icon: <Utensils className="h-6 w-6 text-green-600" />, title: 'Smart Meal Planning', desc: 'Create personalized meal plans based on your preferences, goals, and dietary restrictions.', color: 'green' },
    { icon: <Activity className="h-6 w-6 text-red-500" />, title: 'Progress Tracking', desc: 'Monitor weight, BMI, water intake, calories, macros, and sleep with visual analytics.', color: 'red' },
    { icon: <DropletIcon className="h-6 w-6 text-blue-600" />, title: 'Hydration Tracking', desc: 'Never forget to drink water with smart reminders and progress tracking.', color: 'blue' },
    { icon: <Award className="h-6 w-6 text-amber-600" />, title: 'Rewards & Achievements', desc: 'Stay motivated with badges, rewards, and milestone celebrations.', color: 'amber' },
    { icon: <Clock className="h-6 w-6 text-green-600" />, title: 'Meal Prep Timer', desc: 'Make meal preparation enjoyable with interactive timers and step-by-step guides.', color: 'green' },
    { icon: <Flame className="h-6 w-6 text-orange-500" />, title: 'Nutrition Insights', desc: 'Understand your dietary habits with detailed analytics and recommendations.', color: 'orange' }
  ];

  const benefits = [
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Personalized Goals",
      description: "Set and track health goals tailored to your unique body type, lifestyle, and preferences.",
      details: [
        "Custom weight targets with weekly progress tracking",
        "Personalized calorie and macro recommendations",
        "Adaptive goals that adjust as you progress",
        "Integration with fitness trackers and apps"
      ]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations based on your eating patterns, health data, and goals.",
      details: [
        "Smart meal suggestions based on your preferences",
        "Pattern recognition for better habit formation",
        "Predictive analytics for goal achievement",
        "Personalized nutrition tips and advice"
      ]
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Holistic Health Tracking",
      description: "Monitor all aspects of your wellness in one place - from nutrition to sleep and mental health.",
      details: [
        "Comprehensive dashboard for all health metrics",
        "Sleep quality analysis with recommendations",
        "Stress and mood tracking integration",
        "Exercise and activity monitoring"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Community Support",
      description: "Connect with like-minded individuals, share achievements, and get motivation from others.",
      details: [
        "Private groups for specific health goals",
        "Weekly challenges and competitions",
        "Share recipes and meal ideas",
        "Expert-led Q&A sessions"
      ]
    },
    {
      icon: <Calendar className="h-8 w-8 text-amber-600" />,
      title: "Meal Planning & Prep",
      description: "Plan your weekly meals, generate shopping lists, and get step-by-step cooking instructions.",
      details: [
        "Drag-and-drop meal planner interface",
        "Automatic shopping list generation",
        "Recipe scaling for meal prep",
        "Nutritional breakdown for each meal"
      ]
    },
    {
      icon: <BarChart className="h-8 w-8 text-indigo-600" />,
      title: "Advanced Analytics",
      description: "Visualize your progress with detailed charts, trends, and comprehensive health reports.",
      details: [
        "30+ customizable report templates",
        "Export data for healthcare providers",
        "Trend analysis and predictions",
        "Comparative analytics with benchmarks"
      ]
    }
  ];

  // Beta testers / early adopters preview
  const betaTesters = [
    {
      name: "Coming Soon",
      role: "Beta Tester Program",
      icon: <Rocket className="h-12 w-12 text-green-600" />,
      quote: "Be among the first to experience the future of nutrition tracking. Our beta program launches in Q2 2024.",
      features: ["Early access", "Free lifetime plan", "Direct feedback channel"]
    },
    {
      name: "Launch Day",
      role: "Official Release",
      icon: <Gift className="h-12 w-12 text-purple-600" />,
      quote: "Join us on launch day for exclusive offers and special pricing for our first 1000 users.",
      features: ["50% off first year", "Premium features included", "Priority support"]
    },
    {
      name: "Community",
      role: "Early Adopters Club",
      icon: <Users className="h-12 w-12 text-blue-600" />,
      quote: "Connect with other early adopters, share feedback, and help shape the future of TasteHealth.",
      features: ["Private community access", "Feature voting rights", "Monthly AMA sessions"]
    }
  ];

  const faqs = [
    {
      question: "When will TasteHealth be available?",
      answer: "We're targeting a Q2 2024 launch! Join our waitlist to be the first to know when we launch and receive exclusive early-bird offers."
    },
    {
      question: "How does TasteHealth personalize my meal plans?",
      answer: "Our AI analyzes your health goals, dietary restrictions, food preferences, activity level, and even your schedule to create meal plans that work for you. The more you use the app, the smarter the recommendations become."
    },
    {
      question: "Can I sync with my fitness tracker?",
      answer: "Yes! TasteHealth will integrate with Apple Health, Google Fit, Fitbit, Garmin, and over 50 other fitness apps and devices. Your activity data automatically syncs to adjust your nutrition needs."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We use bank-level encryption to protect your health data. We never sell your information to third parties, and you have full control over what data you share."
    },
    {
      question: "Will there be a free trial?",
      answer: "Yes! We'll offer a 14-day free trial with full access to all features. No credit card required to start your trial."
    },
    {
      question: "How much will it cost after launch?",
      answer: "Pricing is still being finalized, but waitlist members will receive exclusive launch discounts. We're committed to keeping it affordable for everyone."
    }
  ];

  // Helper function to get color classes
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, text: string }> = {
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      red: { bg: 'bg-red-100', text: 'text-red-500' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' }
    };
    return colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  const scrollToSection = (sectionId: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLElement>> = {
      features: featuresRef,
      benefits: benefitsRef,
      waitlist: waitlistRef,
      faq: faqRef
    };
    
    sectionMap[sectionId]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-green-800 font-medium">Setting up your account...</p>
            <p className="text-sm text-gray-500 mt-2">Just a moment please</p>
          </div>
        </div>
      )}

      <header className="w-full py-4 px-4 sm:px-6 flex justify-between items-center backdrop-blur-sm bg-white/50 sticky top-0 z-10">
        <Logo size="lg" />
        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-green-700 hover:text-green-800 hover:bg-green-100 text-sm sm:text-base"
            onClick={() => setShowAuthForm(true)}
          >
            Sign In
          </Button>
          <Button 
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg text-sm sm:text-base"
            onClick={() => setShowAuthForm(true)}
          >
            Join Waitlist
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
            <div 
              id="hero"
              ref={heroRef}
              className={`container max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center py-8 sm:py-12 transition-all duration-1000 transform ${
                isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="space-y-4 sm:space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                  <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />
                  Coming Soon - Q2 2024
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-green-800">
                  The Future of{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
                    Nutrition Tracking
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                  TasteHealth is launching soon! Join our waitlist to be among the first to experience 
                  the most intuitive nutrition and wellness platform ever created.
                </p>
                
                {/* Feature Preview - Mobile Optimized */}
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100 max-w-md mx-auto md:mx-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${getColorClasses(features[activeFeature].color).bg}`}>
                      {features[activeFeature].icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm truncate">{features[activeFeature].title}</h4>
                      <p className="text-xs text-gray-500 truncate">{features[activeFeature].desc.substring(0, 50)}...</p>
                    </div>
                  </div>
                  <div className="flex gap-1 justify-center">
                    {features.slice(0, 5).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 w-4 sm:w-6 rounded-full transition-all ${i === activeFeature ? 'bg-green-600' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Waitlist Form - Mobile Optimized */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 rounded-xl max-w-md mx-auto md:mx-0">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    Get Early Access
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Join our waitlist for exclusive launch offers and early access.
                  </p>
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap text-sm">
                      Join Waitlist
                    </Button>
                  </form>
                  {waitlistSubmitted && (
                    <p className="text-xs sm:text-sm text-green-600 mt-2 animate-fade-in">
                      ✓ Thanks for joining! We'll keep you updated.
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                  <Button 
                    size="default" 
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all group text-sm sm:text-base"
                    onClick={() => scrollToSection('waitlist')}
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="border-green-600 text-green-600 hover:bg-green-50 py-5 sm:py-6 rounded-full text-sm sm:text-base"
                    onClick={() => scrollToSection('features')}
                  >
                    Explore Features
                  </Button>
                </div>

                {/* Quick Stats - Mobile Optimized */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 max-w-md mx-auto md:mx-0">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">2,500+</div>
                    <div className="text-xs text-gray-500">Waitlist Signups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">Q2 2024</div>
                    <div className="text-xs text-gray-500">Launch Date</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">Free</div>
                    <div className="text-xs text-gray-500">Forever Plan</div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm sm:text-base"
                  >
                    Discover What's Coming <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 animate-bounce-slow" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center relative mt-8 md:mt-0">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1470&auto=format&fit=crop" 
                    alt="Healthy food preparation" 
                    className="relative rounded-3xl shadow-xl object-cover w-full max-w-sm sm:max-w-md aspect-[3/4] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-2 right-2 sm:left-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">Coming Soon</p>
                        <p className="text-xs text-gray-500">Your personal nutrition assistant</p>
                      </div>
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                    </div>
                  </div>
                  
                  {/* Floating badges - Hidden on mobile if too many */}
                  <div className="hidden sm:block absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce-slow">
                    EARLY ACCESS
                  </div>
                  <div className="absolute -bottom-2 -left-2 sm:-bottom-2 sm:-left-4 bg-white shadow-lg rounded-full px-2 sm:px-3 py-1 text-xs font-medium flex items-center gap-1">
                    <Gift className="h-3 w-3 text-green-500" />
                    <span className="hidden xs:inline">Exclusive launch offers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <section 
              id="features" 
              ref={featuresRef}
              className={`py-12 sm:py-20 px-4 w-full transition-all duration-1000 transform ${
                isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-4">
                    Everything You Need For Healthier Living
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
                    TasteHealth combines nutrition planning, progress tracking, and personalized recommendations 
                    to support your wellness journey.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {features.map((feature, i) => {
                    const colors = getColorClasses(feature.color);
                    return (
                      <div 
                        key={i} 
                        className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer"
                        onClick={() => setExpandedSection(expandedSection === `feature-${i}` ? null : `feature-${i}`)}
                      >
                        <div className={`h-12 w-12 sm:h-14 sm:w-14 ${colors.bg} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">{feature.desc}</p>
                        
                        {/* Expanded details */}
                        {expandedSection === `feature-${i}` && (
                          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                            <h4 className="font-medium text-xs sm:text-sm mb-2">Coming Features:</h4>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2 text-xs sm:text-sm">
                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>AI-powered recommendations</span>
                              </li>
                              <li className="flex items-start gap-2 text-xs sm:text-sm">
                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Real-time progress tracking</span>
                              </li>
                              <li className="flex items-start gap-2 text-xs sm:text-sm">
                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Fitness app integration</span>
                              </li>
                            </ul>
                          </div>
                        )}
                        
                        <button className={`${colors.text} text-xs sm:text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all mt-2`}>
                          {expandedSection === `feature-${i}` ? 'Show less' : 'Preview feature'} 
                          <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${expandedSection === `feature-${i}` ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section 
              id="benefits" 
              ref={benefitsRef}
              className={`py-12 sm:py-20 px-4 w-full bg-gradient-to-b from-green-50 to-white transition-all duration-1000 transform ${
                isVisible.benefits ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-4">
                    Why Choose TasteHealth?
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
                    Discover the features that will make us the preferred choice for health-conscious individuals
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div className="mb-3 sm:mb-4">{benefit.icon}</div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">{benefit.description}</p>
                      <ul className="space-y-2">
                        {benefit.details.slice(0, 2).map((detail, i) => ( // Show only first 2 on mobile
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-500">
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="hidden sm:inline">{detail}</span>
                            <span className="sm:hidden">{detail.substring(0, 40)}...</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Early Access / Waitlist Section */}
            <section 
              id="waitlist" 
              ref={waitlistRef}
              className={`py-12 sm:py-20 px-4 w-full transition-all duration-1000 transform ${
                isVisible.waitlist ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-4">
                    Be Part of Something Great
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
                    Join our early adopter community and help shape the future of nutrition tracking.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                  {betaTesters.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border-2 border-transparent hover:border-green-500 transition-all group">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-full group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-1">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-green-600 font-medium mb-4">{item.role}</p>
                        <p className="text-sm text-gray-600 mb-6">{item.quote}</p>
                        <div className="w-full border-t border-gray-100 pt-4">
                          <h4 className="font-semibold text-xs sm:text-sm mb-3">Includes:</h4>
                          <ul className="space-y-2 text-left">
                            {item.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Waitlist CTA */}
                <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 sm:p-8 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                  <p className="text-sm sm:text-base text-green-100 mb-6">
                    Join 2,500+ early adopters waiting to transform their health journey.
                  </p>
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-2 sm:py-3 text-sm rounded-lg border-0 focus:ring-2 focus:ring-white bg-white/90 backdrop-blur"
                      required
                    />
                    <Button type="submit" className="bg-white text-green-700 hover:bg-gray-100 px-6 py-2 sm:py-3 text-sm">
                      Join Waitlist
                    </Button>
                  </form>
                  <p className="text-xs text-green-100 mt-4">
                    ✨ First 1000 members get 50% off lifetime access
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section 
              id="faq" 
              ref={faqRef}
              className={`py-12 sm:py-20 px-4 w-full bg-gray-50 transition-all duration-1000 transform ${
                isVisible.faq ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="container max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Everything you need to know about TasteHealth.
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-md cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setExpandedSection(expandedSection === `faq-${index}` ? null : `faq-${index}`)}
                    >
                      <div className="flex justify-between items-center gap-4">
                        <h3 className="font-semibold text-sm sm:text-base text-left">{faq.question}</h3>
                        <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 transition-transform ${expandedSection === `faq-${index}` ? 'rotate-180' : ''}`} />
                      </div>
                      {expandedSection === `faq-${index}` && (
                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 animate-fade-in">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 mb-4">Still have questions?</p>
                  <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50 text-sm">
                    <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Contact Us
                  </Button>
                </div>
              </div>
            </section>

            {/* Final CTA Section - Mobile Optimized */}
            <section className="py-12 sm:py-20 px-4 w-full bg-gradient-to-r from-green-600 to-green-700">
              <div className="container max-w-4xl mx-auto text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Start Your Health Journey Today
                </h2>
                <p className="text-sm sm:text-base text-green-100 mb-6 sm:mb-8">
                  Join our waitlist and be the first to experience TasteHealth.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button 
                    size="default" 
                    className="bg-white text-green-700 hover:bg-gray-100 px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg text-sm sm:text-base"
                    onClick={() => scrollToSection('waitlist')}
                  >
                    Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="border-white text-white hover:bg-green-500 px-6 sm:px-8 py-5 sm:py-6 rounded-full text-sm sm:text-base"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Get Updates
                  </Button>
                </div>

                {/* Social Proof / Partners */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-green-500">
                  <p className="text-xs sm:text-sm text-green-200 mb-4">Coming soon to</p>
                  <div className="flex justify-center gap-6 sm:gap-8 text-green-200">
                    <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 opacity-70 hover:opacity-100 transition-opacity" />
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6 opacity-70 hover:opacity-100 transition-opacity" />
                    <Apple className="h-5 w-5 sm:h-6 sm:w-6 opacity-70 hover:opacity-100 transition-opacity" />
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 opacity-70 hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Simplified Trust Indicators */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-green-100">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4" /> Secure
                  </span>
                  <span className="text-green-500">|</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4" /> Worldwide
                  </span>
                  <span className="text-green-500">|</span>
                  <span className="flex items-center gap-1">
                    <Gift className="h-3 w-3 sm:h-4 sm:w-4" /> Free Trial
                  </span>
                </div>

                {/* Simplified Social Links */}
                <div className="flex justify-center gap-4 mt-6">
                  <a href="#" className="text-green-200 hover:text-white transition-colors">
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                  <a href="#" className="text-green-200 hover:text-white transition-colors">
                    <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                  <a href="#" className="text-green-200 hover:text-white transition-colors">
                    <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </div>
                
                {/* Mobile-only copyright - minimal */}
                <div className="mt-6 text-xs text-green-200 sm:hidden">
                  © 2024 TasteHealth
                </div>
              </div>
            </section>

            {/* CSS for animations */}
            <style>{`
              @keyframes fade-in {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
              }
              
              @keyframes bounce-slow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(5px); }
              }
              
              .animate-bounce-slow {
                animation: bounce-slow 2s infinite;
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;