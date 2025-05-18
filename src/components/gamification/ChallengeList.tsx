"use client";

import type React from "react";
import { useEffect, useState } from "react";
import gamificationService, {
  type Challenge,
  type UserChallenge,
} from "../../services/gamificationService";
import { supabase } from "../../lib/SupabaseClient";

const ChallengesList: React.FC = () => {
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>(
    []
  );
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        setUserId(user.id);

        const [challenges, userChallengesData] = await Promise.all([
          gamificationService.getChallenges(),
          gamificationService.getUserChallenges(user.id),
        ]);

        setAvailableChallenges(challenges);
        setUserChallenges(userChallengesData);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const acceptChallenge = async (challengeId: string) => {
    if (!userId) return;

    try {
      const newUserChallenge = await gamificationService.acceptChallenge(
        userId,
        challengeId
      );
      setUserChallenges([...userChallenges, newUserChallenge]);
    } catch (error) {
      console.error("Error accepting challenge:", error);
    }
  };

  const isAlreadyAccepted = (challengeId: string) => {
    return userChallenges.some(
      (uc) => uc.challenge_id === challengeId && uc.status !== "failed"
    );
  };

  const filteredChallenges = availableChallenges.filter((challenge) => {
    if (filter === "all") return true;
    return challenge.difficulty === filter || challenge.category === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Nutrition Challenges
      </h1>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "all"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Challenges
        </button>
        <button
          onClick={() => setFilter("easy")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "easy"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Easy
        </button>
        <button
          onClick={() => setFilter("medium")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "medium"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter("hard")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "hard"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Hard
        </button>
        <button
          onClick={() => setFilter("daily")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "daily"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setFilter("weekly")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "weekly"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Weekly
        </button>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className="border rounded-lg overflow-hidden shadow-md bg-white"
          >
            <div
              className={`p-4 ${getDifficultyHeaderClass(
                challenge.difficulty
              )}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {challenge.title}
                </h3>
                <span className="text-2xl text-white">
                  <i className={`fas fa-${challenge.icon || "trophy"}`}></i>
                </span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-gray-600 mb-4">{challenge.description}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  {challenge.points} points
                </span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
                  {challenge.category}
                </span>
              </div>

              <button
                onClick={() => acceptChallenge(challenge.id)}
                disabled={isAlreadyAccepted(challenge.id)}
                className={`w-full py-2 rounded-md font-medium ${
                  isAlreadyAccepted(challenge.id)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {isAlreadyAccepted(challenge.id)
                  ? "Challenge Accepted"
                  : "Accept Challenge"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No challenges found with the selected filter.
          </p>
        </div>
      )}

      {/* Active Challenges Section */}
      {userChallenges.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Active Challenges</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userChallenges
              .filter((uc) => uc.status === "in_progress")
              .map((userChallenge) => (
                <div
                  key={userChallenge.id}
                  className="border rounded-lg overflow-hidden shadow-md bg-white"
                >
                  <div className="p-4 bg-blue-600">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">
                        {userChallenge.challenge?.title}
                      </h3>
                      <span className="text-2xl text-white">
                        <i
                          className={`fas fa-${
                            userChallenge.challenge?.icon || "trophy"
                          }`}
                        ></i>
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-600 mb-4">
                      {userChallenge.challenge?.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Started on{" "}
                      {new Date(userChallenge.started_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get header color based on difficulty
function getDifficultyHeaderClass(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "hard":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export default ChallengesList;
