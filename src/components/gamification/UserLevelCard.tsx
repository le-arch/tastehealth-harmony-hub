import { Card, CardContent } from "../ui/card";

interface UserLevelCardProps {
  userId: string;
  showDetails?: boolean;
}

export function UserLevelCard({ userId, showDetails = true }: UserLevelCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="h-24 flex items-center justify-center">
          <p className="text-muted-foreground">Database features removed.</p>
        </div>
      </CardContent>
    </Card>
  );
}
