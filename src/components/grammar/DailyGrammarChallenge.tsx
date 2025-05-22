
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DailyGrammarChallengeProps {
  challenge: string;
  onNewChallenge: () => void;
}

const DailyGrammarChallenge = ({ challenge, onNewChallenge }: DailyGrammarChallengeProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{challenge}</p>
        <Button variant="outline" onClick={onNewChallenge}>
          Get New Challenge
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyGrammarChallenge;
