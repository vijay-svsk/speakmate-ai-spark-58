import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { WelcomeJourney } from "@/components/journey/WelcomeJourney";
import { JourneyMap } from "@/components/journey/JourneyMap";
import { JourneyPrompts } from "@/components/journey/JourneyPrompts";
import { SkillRooms } from "@/components/journey/SkillRooms";
import { DailyBadges } from "@/components/journey/DailyBadges";
// Dashboard components
import { DailyGoals } from "@/components/dashboard/DailyGoals";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { LevelIndicator } from "@/components/dashboard/LevelIndicator";
import { MotivationalTipCard } from "@/components/dashboard/MotivationalTipCard";
// Charts for progress
import { WeeklyProgressChart } from "@/components/progress/WeeklyProgressChart";
import { SkillRadarChart } from "@/components/progress/SkillRadarChart";
import confetti from 'canvas-confetti';
import { useNavigate } from "react-router-dom";

// Quick start actions
const quickStarts = [
  {
    label: "Speaking Practice",
    icon: "Mic",
    route: "/speaking",
    color: "bg-gradient-to-br from-primary to-purple-400 text-white hover:shadow-lg hover:shadow-primary/30 border-2 border-primary/20 hover:border-primary/40",
  },
  {
    label: "Conversation AI",
    icon: "MessageSquare",
    route: "/conversation",
    color: "bg-gradient-to-br from-accent to-blue-400 text-white hover:shadow-lg hover:shadow-accent/30 border-2 border-accent/20 hover:border-accent/40",
  },
  {
    label: "Progress Report",
    icon: "BarChart",
    route: "/progress",
    color: "bg-gradient-to-br from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/30 border-2 border-primary/20 hover:border-primary/40",
  },
];

function WelcomeCard() {
  const [name, setName] = useState("Speaker");

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (userSession.name) {
      setName(userSession.name);
    }

    // Trigger confetti on dashboard load
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 }
      });
    }, 1000);
  }, []);

  return (
    <Card className="w-full shadow-xl border-2 border-border/50 rounded-2xl animate-fade-in mb-6 bg-gradient-to-r from-background to-muted/30">
      <CardHeader className="pb-4">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome back, {name}!
        </h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-base md:text-lg">
          Your language learning journey continues. Here's your progress today.
        </p>
      </CardContent>
    </Card>
  );
}

function QuickStartPanel() {
  const navigate = useNavigate();

  const lucideIcons = {
    "Mic": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
    "MessageSquare": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    "BarChart": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
  };

  const handleClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
      {quickStarts.map((item, i) => {
        const IconComponent = lucideIcons[item.icon as keyof typeof lucideIcons];
        return (
          <button
            key={item.label}
            onClick={() => handleClick(item.route)}
            className={`rounded-2xl flex flex-col items-center justify-center p-6 h-32 md:h-36 shadow-lg hover:scale-105 transition-all duration-300 ${item.color} animate-fade-in`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {IconComponent && <IconComponent />}
            <span className="font-semibold mt-2 text-center">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Mock streak data for demonstration
const mockStreakData = Object.fromEntries(
  Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    return [
      dateStr,
      {
        completed: i < 7 || Math.random() > 0.2,
        score: Math.floor(Math.random() * 30) + 70
      }
    ];
  })
);

const Index = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState("Fluent Explorer");

  useEffect(() => {
    // Get user info from localStorage
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (userSession.name) {
      setUserName(userSession.name);
    }

    setShowAnimation(true);
  }, []);

  const handleStartJourney = () => {
    setShowWelcome(false);
    // Trigger journey start confetti
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 300);
  };

  return (
    <AppLayout>
      {/* Welcome Journey Modal */}
      {showWelcome && (
        <WelcomeJourney 
          userName={userName}
          onStartJourney={handleStartJourney}
        />
      )}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className={`space-y-8 ${showAnimation ? 'animate-fade-in' : 'opacity-0'}`}>
          
          {/* Journey Map - Main Feature */}
          <div className="transform hover:scale-[1.01] transition-all duration-300">
            <JourneyMap />
          </div>

          {/* Daily Journey Prompt */}
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <JourneyPrompts />
          </div>

          {/* Skill Rooms Guide */}
          <div className="transform hover:scale-[1.01] transition-all duration-300">
            <SkillRooms />
          </div>

          {/* Progress and Gamification Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="transform hover:scale-[1.02] transition-all duration-300 border-2 border-border/30 hover:border-border/50 rounded-xl overflow-hidden">
              <DailyBadges />
            </div>
            <div className="transform hover:scale-[1.02] transition-all duration-300 border-2 border-border/30 hover:border-border/50 rounded-xl overflow-hidden">
              <StreakTracker streakData={mockStreakData} currentStreak={5} />
            </div>
          </div>

          {/* Additional Progress Tracking */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="transform hover:scale-[1.02] transition-all duration-300 border-2 border-border/30 hover:border-border/50 rounded-xl overflow-hidden">
              <DailyGoals />
            </div>
            <div className="transform hover:scale-[1.02] transition-all duration-300 border-2 border-border/30 hover:border-border/50 rounded-xl overflow-hidden">
              <LevelIndicator level="Intermediate" xp={1250} xpToNextLevel={2000} />
            </div>
          </div>

          {/* Journey Motivation Footer */}
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-2xl border-2 border-dashed border-primary/30">
              <h3 className="text-xl font-playfair font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ✨ Your Magical English Journey Awaits ✨
              </h3>
              <p className="text-muted-foreground">
                "Every step you take on this path makes you stronger. Keep walking, keep learning, keep growing!" 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
