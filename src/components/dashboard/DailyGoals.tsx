
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  completed: boolean;
  target: number;
  current: number;
}

interface DailyGoalsProps {
  goals?: Goal[];
}

// Mock data to demonstrate the component
const defaultGoals: Goal[] = [
  { id: "1", name: "Practice speaking", completed: false, target: 20, current: 12 },
  { id: "2", name: "Learn vocabulary", completed: true, target: 15, current: 15 },
  { id: "3", name: "Grammar exercises", completed: false, target: 10, current: 4 },
];

export const DailyGoals: React.FC<DailyGoalsProps> = ({ goals = defaultGoals }) => {
  const [localGoals, setLocalGoals] = useState<Goal[]>(goals);
  
  // Effect to load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('dailyGoals');
    if (savedGoals) {
      setLocalGoals(JSON.parse(savedGoals));
    } else {
      setLocalGoals(goals);
    }
  }, [goals]);

  // Effect to save goals to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dailyGoals', JSON.stringify(localGoals));
  }, [localGoals]);

  const overallProgress = Math.round(
    (localGoals.reduce((acc, goal) => acc + goal.current, 0) / 
     localGoals.reduce((acc, goal) => acc + goal.target, 0)) * 100
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span>Daily Goals</span>
          </div>
        </CardTitle>
        <div className="text-sm font-medium text-primary">
          {overallProgress}% completed
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={overallProgress} />

        <div className="space-y-3">
          {localGoals.map((goal) => (
            <div key={goal.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="text-sm flex items-center">
                  <span className={`mr-2 ${goal.completed ? 'text-primary' : 'text-gray-600'}`}>
                    {goal.name}
                  </span>
                  {goal.completed && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <Progress value={(goal.current / goal.target) * 100} className="h-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
