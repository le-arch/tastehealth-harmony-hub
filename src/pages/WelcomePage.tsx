import React, { useState } from "react";
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
  PieChart,
  Flame,
} from "lucide-react";

const WelcomePage = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const navigate = useNavigate();

  const handleAuthenticated = (user: any) => {
    // Store user in local storage or context for now
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <Logo size="lg" />
        <Button
          variant="ghost"
          className="text-th-green-700 hover:text-th-green-800 hover:bg-th-green-100"
          onClick={() => setShowAuthForm(true)}
        >
          Sign Up
        </Button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {showAuthForm ? (
          <div className="w-full max-w-md mx-auto animate-fade-in">
            <AuthForm onAuthenticated={handleAuthenticated} />
          </div>
        ) : (
          <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center py-12">
            {/* Hero Content */}
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-th-green-800">
                Nourish Your Future with{" "}
                <span className="text-th-green-600">TasteHealth</span>
              </h1>

              <p className="text-lg text-gray-600 max-w-lg">
                Your personal nutrition guide for a healthier lifestyle. Plan
                meals, track progress, and celebrate achievements on your
                wellness journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  className="bg-th-green-600 hover:bg-th-green-700 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={() => setShowAuthForm(true)}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-th-green-600 text-th-green-600 hover:bg-th-green-50 py-6 rounded-full"
                >
                  Learn More
                </Button>
              </div>

              <div className="pt-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 text-th-green-600 hover:text-th-green-700"
                >
                  Explore Features{" "}
                  <ChevronDown className="h-4 w-4 animate-bounce-slow" />
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-th-green-500 rounded-full blur-3xl opacity-20"></div>
                <img
                  src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Healthy food"
                  className="relative rounded-3xl shadow-xl object-cover w-full aspect-[3/4]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      {!showAuthForm && (
        <section id="features" className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-th-green-800">
                Everything You Need For Healthier Living
              </h2>
              <p className="mt-4 text-gray-600 max-w-xl mx-auto">
                TasteHealth combines nutrition planning, progress tracking, and
                personalized recommendations to help you achieve your health
                goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-th-green-100 rounded-full flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-th-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Meal Planning</h3>
                <p className="text-gray-600">
                  Create personalized meal plans based on your preferences,
                  restrictions, and nutritional goals.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-th-green-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Progress Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your weight, BMI, water intake, calories, and sleep
                  patterns with visual analytics.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-th-green-100 rounded-full flex items-center justify-center mb-4">
                  <DropletIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Hydration Tracking
                </h3>
                <p className="text-gray-600">
                  Never forget to drink water with our gamified hydration
                  tracker and customizable reminders.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-th-green-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-yellow-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Rewards & Achievements
                </h3>
                <p className="text-gray-600">
                  Stay motivated with badges, rewards, and celebrations when you
                  reach your nutrition milestones.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-th-green-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-th-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Meal Prep Timer</h3>
                <p className="text-gray-600">
                  Make meal preparation enjoyable with our interactive timer
                  featuring motivational animations.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-th-green-100 rounded-full flex items-center justify-center mb-4">
                  <Flame className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Nutrition Insights
                </h3>
                <p className="text-gray-600">
                  Understand your dietary habits with detailed analytics and
                  personalized recommendations.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="bg-th-green-600 hover:bg-th-green-700 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={() => setShowAuthForm(true)}
              >
                Start Your Health Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {/* <footer className="bg-th-green-900 text-white py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo size="md" className="text-white" />
              <p className="mt-2 text-th-green-200 text-sm">
                © {new Date().getFullYear()} TasteHealth. All rights reserved.
              </p>
            </div>

            <div className="flex gap-8">
              <div className="space-y-2">
                <h4 className="font-semibold">Links</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-th-green-300 transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-th-green-300 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-th-green-300 transition-colors"
                    >
                      Testimonials
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Support</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-th-green-300 transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-th-green-300 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-th-green-300 transition-colors"
                    >
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default WelcomePage;
