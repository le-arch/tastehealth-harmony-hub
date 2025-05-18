"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  type LevelBenefit,
  type UserLevelBenefit,
  gamificationService,
} from "../../services/gamificationService";

interface LevelBenefitsProps {
  userId: string;
}

export const LevelBenefits: React.FC<LevelBenefitsProps> = ({ userId }) => {
  const [benefits, setBenefits] = useState<LevelBenefit[]>([]);
  const [userBenefits, setUserBenefits] = useState<UserLevelBenefit[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allBenefits, userUnlockedBenefits, userPoints] =
          await Promise.all([
            gamificationService.getLevelBenefits(),
            gamificationService.getUserLevelBenefits(userId),
            gamificationService.getUserPoints(userId),
          ]);

        setBenefits(allBenefits);
        setUserBenefits(userUnlockedBenefits);
        setUserLevel(userPoints.current_level);
      } catch (error) {
        console.error("Error fetching level benefits:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleUnlockBenefit = async (benefitId: string) => {
    try {
      const newBenefit = await gamificationService.unlockLevelBenefit(
        userId,
        benefitId
      );
      setUserBenefits([...userBenefits, newBenefit]);
    } catch (error) {
      console.error("Error unlocking benefit:", error);
      alert("Could not unlock benefit. " + (error as Error).message);
    }
  };

  const handleUseBenefit = async (benefitId: string) => {
    try {
      await gamificationService.useLevelBenefit(userId, benefitId); //Corrected the function call here.
      // Refresh user benefits
      const updatedBenefits = await gamificationService.getUserLevelBenefits(
        userId
      );
      setUserBenefits(updatedBenefits);
    } catch (error) {
      console.error("Error using benefit:", error);
      alert("Could not use benefit. " + (error as Error).message);
    }
  };

  const isUnlocked = (benefitId: string) => {
    return userBenefits.some(
      (ub) => ub.level_benefit_id === benefitId && ub.status === "unlocked"
    );
  };

  const isUsed = (benefitId: string) => {
    return userBenefits.some(
      (ub) => ub.level_benefit_id === benefitId && ub.status === "used"
    );
  };

  if (loading) {
    return <div className="p-4 text-center">Loading level benefits...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Level Benefits</h2>
      <p className="text-gray-600 mb-4">
        Your current level: <span className="font-semibold">{userLevel}</span>
      </p>

      <div className="space-y-4">
        {benefits.map((benefit) => {
          const unlocked = isUnlocked(benefit.id);
          const used = isUsed(benefit.id);
          const canUnlock = userLevel >= benefit.level_required;

          return (
            <div
              key={benefit.id}
              className={`border rounded-lg p-4 transition-all ${
                unlocked
                  ? "border-green-500 bg-green-50"
                  : used
                  ? "border-gray-300 bg-gray-50 opacity-70"
                  : canUnlock
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{benefit.name}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Required level:{" "}
                    <span className="font-medium">
                      {benefit.level_required}
                    </span>
                  </p>

                  {benefit.benefit_data.points_cost && (
                    <p className="text-xs text-gray-500">
                      Cost:{" "}
                      <span className="font-medium">
                        {benefit.benefit_data.points_cost} points
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  {used ? (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                      Used
                    </span>
                  ) : unlocked ? (
                    <button
                      onClick={() => handleUseBenefit(benefit.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-full text-xs hover:bg-green-700 transition-colors"
                    >
                      Use Benefit
                    </button>
                  ) : canUnlock ? (
                    <button
                      onClick={() => handleUnlockBenefit(benefit.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-700 transition-colors"
                    >
                      Unlock
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {benefits.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No level benefits available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default LevelBenefits;
