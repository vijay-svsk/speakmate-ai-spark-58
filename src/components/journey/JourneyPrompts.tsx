
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JourneyPrompt {
  zone: string;
  message: string;
  emoji: string;
  color: string;
}

const journeyPrompts: JourneyPrompt[] = [
  {
    zone: "Vocabulary Garden",
    message: "👣 You've reached the Vocabulary Garden! Let's grow some new words today!",
    emoji: "🌱",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  {
    zone: "Reflex Bridge",
    message: "🎯 Reflex Bridge ahead! Can you think fast and reply faster?",
    emoji: "⚡",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  {
    zone: "Pronunciation Pond",
    message: "✨ The Pronunciation Pond is glowing! Match the waves with your voice!",
    emoji: "🔊",
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  {
    zone: "Story Tree",
    message: "📖 Story Tree whispers: 'Tell me a tale…'",
    emoji: "📖",
    color: "bg-orange-100 text-orange-800 border-orange-200"
  },
  {
    zone: "Fluent House",
    message: "🚪Your Fluent House awaits! Ready to enter the Speaking Room?",
    emoji: "🏡",
    color: "bg-purple-100 text-purple-800 border-purple-200"
  }
];

export const JourneyPrompts: React.FC = () => {
  const todayPrompt = journeyPrompts[Math.floor(Math.random() * journeyPrompts.length)];

  return (
    <Card className="w-full border-2 border-dashed animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{todayPrompt.emoji}</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={todayPrompt.color}>
                {todayPrompt.zone}
              </Badge>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              {todayPrompt.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
