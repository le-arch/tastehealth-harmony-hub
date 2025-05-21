
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { gamificationService } from "@/services/gamificationService";
import { Lock, Gift, Sparkles, Crown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LevelBenefit {
  id: string;
  name: string;
  description: string;
  level_required: number;
  benefit_type: string;
  benefit_data: any;
  created_at: string;
  active: boolean;
}

interface UserLevelBenefit {
  id: string;
  user_id: string;
  level_benefit_id: string;
  unlocked_at: string;
  used_at: string | null;
  status: "unlocked" | "used" | "expired";
  level_benefit?: LevelBenefit;
}

interface LevelBenefitsProps {
  userId: string;
}

const LevelBenefits: React.FC<LevelBenefitsProps> = ({ userId }) => {
  const [levelBenefits, setLevelBenefits] = useState<LevelBenefit[]>([]);
  const [userLevelBenefits, setUserLevelBenefits] = useState<UserLevelBenefit[]>([]);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const benefits = await gamificationService.getLevelBenefits();
        setLevelBenefits(benefits);

        const userBenefits = await gamificationService.getUserLevelBenefits(userId);
        setUserLevelBenefits(userBenefits);

        const userPoints = await gamificationService.getUserPoints(userId);
        if (userPoints) {
          setUserLevel(userPoints.current_level);
        }
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
      await gamificationService.unlockLevelBenefit(userId, benefitId);
      
      // Refresh user benefits
      const userBenefits = await gamificationService.getUserLevelBenefits(userId);
      setUserLevelBenefits(userBenefits);
      
      toast.success("Benefit unlocked successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to unlock benefit");
    }
  };

  const getBenefitStatusInfo = (benefit: LevelBenefit) => {
    const userBenefit = userLevelBenefits.find(ub => ub.level_benefit_id === benefit.id);
    
    if (!userBenefit) {
      if (userLevel >= benefit.level_required) {
        return { status: "available", text: "Available", color: "bg-green-100 text-green-800" };
      } else {
        return { status: "locked", text: `Requires Level ${benefit.level_required}`, color: "bg-gray-100 text-gray-800" };
      }
    }
    
    if (userBenefit.status === "used") {
      return { status: "used", text: "Used", color: "bg-purple-100 text-purple-800" };
    }
    
    return { status: "unlocked", text: "Unlocked", color: "bg-blue-100 text-blue-800" };
  };

  if (loading) {
    return <div className="text-center p-8">Loading benefits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gift className="h-6 w-6 text-primary" />
          Level Benefits
        </h2>
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          <span className="font-medium">Level {userLevel}</span>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Unlock special benefits as you level up. Higher levels bring more valuable rewards.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {levelBenefits.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p>No benefits available at this time.</p>
            </CardContent>
          </Card>
        ) : (
          levelBenefits.map((benefit) => {
            const statusInfo = getBenefitStatusInfo(benefit);
            const isAvailable = statusInfo.status === "available";
            const isLocked = statusInfo.status === "locked";
            
            return (
              <Card key={benefit.id} className={`overflow-hidden ${isLocked ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {isLocked ? (
                        <Lock className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      )}
                      {benefit.name}
                    </CardTitle>
                    <Badge variant="outline" className={statusInfo.color}>
                      {statusInfo.text}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm mb-4">{benefit.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {isLocked ? `Unlock at level ${benefit.level_required}` : ''}
                    </div>
                    
                    {isAvailable && (
                      <Button size="sm" onClick={() => handleUnlockBenefit(benefit.id)}>
                        Unlock
                      </Button>
                    )}
                    
                    {statusInfo.status === "unlocked" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={benefit.benefit_type !== 'usable'}
                      >
                        Use Benefit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LevelBenefits;
