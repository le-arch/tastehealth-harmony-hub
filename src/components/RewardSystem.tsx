
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RewardsSystem = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {language === 'fr' ? "Récompenses & Succès" : "Rewards & Achievements"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{language === 'fr' ? "Les fonctionnalités de base de données ont été supprimées." : "Database features have been removed."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSystem;
