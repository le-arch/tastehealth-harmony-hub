
import React from "react";
import { Filter } from "lucide-react";

interface ChallengeListProps {
  userId: string;
}

const ChallengesList: React.FC<ChallengeListProps> = () => {
  return (
    <div className="text-center py-8">
      <Filter className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-muted-foreground">Database features have been removed.</p>
    </div>
  );
};

export default ChallengesList;
