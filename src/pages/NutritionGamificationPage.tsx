"use client";

import { useState } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { useTheme } from "../contexts/ThemeContext";
import {
  Trophy,
  Smile,
  ChefHat,
  Leaf,
  Plus,
  Check,
  Clock,
  Star,
  Search,
} from "lucide-react";

const NutritionGamificationPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("challenges");

  // Mock data for challenges
  const challenges = [
    {
      id: 1,
      name: "Hydration Hero",
      description: "Drink 8 cups of water daily for 7 days",
      progress: 60,
      difficulty: "Medium",
      completed: false,
    },
    {
      id: 2,
      name: "Veggie Victory",
      description: "Eat 5 servings of vegetables daily for 5 days",
      progress: 40,
      difficulty: "Easy",
      completed: false,
    },
    {
      id: 3,
      name: "Protein Power",
      description: "Meet your protein goal for 10 consecutive days",
      progress: 30,
      difficulty: "Hard",
      completed: false,
    },
    {
      id: 4,
      name: "Sugar Slayer",
      description: "Reduce sugar intake to under 25g daily for 7 days",
      progress: 100,
      difficulty: "Medium",
      completed: true,
    },
  ];

  // Mock data for mood tracking
  const moods = [
    { emoji: "😋", label: "Delicious", value: "delicious" },
    { emoji: "😊", label: "Satisfied", value: "satisfied" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "😞", label: "Disappointed", value: "disappointed" },
    { emoji: "😖", label: "Uncomfortable", value: "uncomfortable" },
  ];

  // Mock data for meal prep steps
  const prepSteps = [
    {
      id: 1,
      title: "Gather Ingredients",
      description: "Collect all ingredients from your shopping list",
      tasks: ["Check refrigerator", "Check pantry", "Prepare workspace"],
    },
    {
      id: 2,
      title: "Prep Vegetables",
      description: "Wash and chop all vegetables for the week",
      tasks: ["Wash all produce", "Chop vegetables", "Store in containers"],
    },
    {
      id: 3,
      title: "Cook Proteins",
      description: "Cook and portion your protein sources",
      tasks: ["Cook chicken", "Cook beef", "Portion into containers"],
    },
    {
      id: 4,
      title: "Assemble Meals",
      description: "Combine ingredients into complete meals",
      tasks: [
        "Combine proteins and vegetables",
        "Add sauces",
        "Label containers",
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="nutrition-game" />

      <div className="flex-1 p-5 sm:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              Nutrition Gamification
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Make healthy eating fun with challenges, mood tracking, and more
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            <div className="flex">
              <button
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "challenges"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                }`}
                onClick={() => setActiveTab("challenges")}
              >
                <Trophy className="h-4 w-4" />
                Challenges
              </button>
              <button
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "mood"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                }`}
                onClick={() => setActiveTab("mood")}
              >
                <Smile className="h-4 w-4" />
                Mood Tracker
              </button>
              <button
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "mealPrep"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                }`}
                onClick={() => setActiveTab("mealPrep")}
              >
                <ChefHat className="h-4 w-4" />
                Meal Prep
              </button>
              <button
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "nutrition"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                }`}
                onClick={() => setActiveTab("nutrition")}
              >
                <Leaf className="h-4 w-4" />
                Nutrition Visualizer
              </button>
            </div>
          </div>

          {/* Challenges Tab */}
          {activeTab === "challenges" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Active Challenges
                </h2>
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Challenge
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 ${
                      challenge.completed
                        ? "border-l-4 border-gray-400"
                        : "border-l-4 border-green-500"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{challenge.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          challenge.difficulty === "Easy"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : challenge.difficulty === "Medium"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {challenge.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            challenge.completed ? "bg-gray-400" : "bg-green-500"
                          }`}
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      className={`w-full py-2 rounded-md flex items-center justify-center ${
                        challenge.completed
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                      disabled={challenge.completed}
                    >
                      {challenge.completed ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        "Mark Today Complete"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Tracker Tab */}
          {activeTab === "mood" && (
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  How did you feel after your last meal?
                </h2>

                <div className="mb-6">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Select a meal
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    <option value="">Select a meal</option>
                    <option value="breakfast">
                      Breakfast - Greek Yogurt with Berries
                    </option>
                    <option value="lunch">
                      Lunch - Chicken Salad with Avocado
                    </option>
                    <option value="dinner">
                      Dinner - Salmon with Roasted Vegetables
                    </option>
                  </select>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-100">
                    Select your mood
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        className="flex flex-col items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors"
                      >
                        <span className="text-3xl mb-2">{mood.emoji}</span>
                        <span className="text-sm">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 h-24"
                    placeholder="How did the meal make you feel? Any digestive issues?"
                  ></textarea>
                </div>

                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                  Save Mood
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Recent Mood History
                </h2>

                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No mood entries yet. Start tracking how you feel after meals!
                </div>
              </div>
            </div>
          )}

          {/* Meal Prep Tab */}
          {activeTab === "mealPrep" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Meal Prep Assistant
                </h2>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Estimated time: 45 minutes
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {prepSteps.map((step) => (
                  <div
                    key={step.id}
                    className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="w-16 flex-shrink-0 bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                      {step.id}
                    </div>
                    <div className="p-5 flex-1">
                      <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {step.description}
                      </p>
                      <div className="space-y-2">
                        {step.tasks.map((task, index) => (
                          <label
                            key={index}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              {task}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">
                    Rate your meal prep experience
                  </h3>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className="text-2xl text-gray-300 hover:text-yellow-400"
                      >
                        <Star className="h-8 w-8" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 h-24 mb-4"
                    placeholder="Any feedback on your meal prep experience?"
                  ></textarea>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Visualizer Tab */}
          {activeTab === "nutrition" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Ingredient Nutrition Visualizer
                </h2>
              </div>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Enter an ingredient (e.g., spinach, chicken, rice)"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center">
                <Leaf className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  No ingredients added
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Add ingredients to see their nutritional profile and compare
                  different foods.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionGamificationPage;
