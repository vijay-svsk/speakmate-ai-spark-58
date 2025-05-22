
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle } from 'lucide-react';

interface GrammarRingGraphProps {
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
  userSentence?: string;
  correctedSentence?: string;
}

const GrammarRingGraph: React.FC<GrammarRingGraphProps> = ({
  fluencyScore,
  vocabularyScore,
  grammarScore,
  userSentence,
  correctedSentence
}) => {
  // Calculate the average score
  const averageScore = Math.round((fluencyScore + vocabularyScore + grammarScore) / 3);
  
  // Calculate the circle stroke properties based on score
  const radius = 70;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * averageScore) / 100;
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const scoreColorClass = getScoreColor(averageScore);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Grammar Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="score" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="score">Score Visualization</TabsTrigger>
            <TabsTrigger value="correction">Sentence Correction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="score" className="flex justify-center py-4">
            <div className="relative flex flex-col items-center">
              <svg width="160" height="160" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-muted"
                />
                
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                  className={scoreColorClass}
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColorClass}`}>{averageScore}</span>
                <span className="text-sm text-muted-foreground">Overall Score</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium">Fluency</span>
                <span className={`text-xl font-bold ${getScoreColor(fluencyScore)}`}>
                  {fluencyScore}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium">Vocabulary</span>
                <span className={`text-xl font-bold ${getScoreColor(vocabularyScore)}`}>
                  {vocabularyScore}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium">Grammar</span>
                <span className={`text-xl font-bold ${getScoreColor(grammarScore)}`}>
                  {grammarScore}
                </span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="correction" className="py-4">
            {userSentence ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Your Sentence:</h3>
                  <p className="p-3 border rounded-md bg-muted/30">{userSentence}</p>
                </div>
                
                {correctedSentence && correctedSentence !== userSentence ? (
                  <div>
                    <h3 className="font-medium mb-1">Corrected Version:</h3>
                    <p className="p-3 border rounded-md bg-green-50 border-green-100 text-green-800">
                      {correctedSentence}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-green-50 border-green-100 text-green-800">
                    <Circle className="text-green-500 fill-green-500 h-4 w-4" />
                    <span>Perfect! No corrections needed.</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Speak or type a sentence to see its correction.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GrammarRingGraph;
