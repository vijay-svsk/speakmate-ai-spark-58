
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SkillRoom {
  room: string;
  skill: string;
  description: string;
  emoji: string;
  route: string;
  color: string;
  features: string[];
}

const skillRooms: SkillRoom[] = [
  {
    room: "🛋️ Living Room",
    skill: "Speaking",
    description: "Talk with AI, answer questions, practice dialogue in real time",
    emoji: "🛋️",
    route: "/speaking",
    color: "bg-blue-500",
    features: ["AI Conversation", "Real-time Feedback", "Dialogue Practice"]
  },
  {
    room: "🪞 Mirror Room",
    skill: "Pronunciation",
    description: "See your mouth movement, get feedback on sounds using lipsync AI",
    emoji: "🪞",
    route: "/pronunciation",
    color: "bg-purple-500",
    features: ["Mouth Movement", "Lipsync AI", "Sound Feedback"]
  },
  {
    room: "🔬 Word Lab",
    skill: "Vocabulary",
    description: "Learn 5 new words daily, use flashcards and fill-in-the-blanks",
    emoji: "🔬",
    route: "/vocabulary",
    color: "bg-green-500",
    features: ["Daily Words", "Flashcards", "Fill-in-blanks"]
  },
  {
    room: "📚 Grammar Den",
    skill: "Grammar",
    description: "Play grammar games, correct sentences, earn rewards",
    emoji: "📚",
    route: "/grammar",
    color: "bg-orange-500",
    features: ["Grammar Games", "Sentence Correction", "Rewards"]
  },
  {
    room: "⚡ Reflex Gym",
    skill: "Reflex Response",
    description: "Play 'quick chat' games, reply fast to prompts, practice conversation flow",
    emoji: "⚡",
    route: "/reflex",
    color: "bg-yellow-500",
    features: ["Quick Chat", "Fast Response", "Flow Practice"]
  },
  {
    room: "📖 Story Loft",
    skill: "Storytelling",
    description: "Continue or complete an AI-generated story creatively",
    emoji: "📖",
    route: "/story",
    color: "bg-pink-500",
    features: ["Story Creation", "AI Generation", "Creative Writing"]
  }
];

export const SkillRooms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center font-playfair text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          🗺️ Room-by-Room Skill Guide
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Your Fluent House has 6 magical rooms, each training a different skill
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillRooms.map((room, index) => (
            <Card 
              key={room.skill}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-border/30 hover:border-primary/50"
              onClick={() => navigate(room.route)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="text-center">
                  <div className="text-3xl mb-2">{room.emoji}</div>
                  <h3 className="font-bold text-lg">{room.room}</h3>
                  <Badge className={`${room.color} text-white`}>
                    {room.skill}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  {room.description}
                </p>
                
                <div className="space-y-1">
                  {room.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3 hover:bg-primary hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(room.route);
                  }}
                >
                  Enter Room →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
