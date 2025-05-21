
// SpeakMate Dashboard v1

import React, { useEffect, useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BarChart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// Dashboard components
import { DailyGoals } from "@/components/dashboard/DailyGoals";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { LevelIndicator } from "@/components/dashboard/LevelIndicator";
import { MotivationalTipCard } from "@/components/dashboard/MotivationalTipCard";
// Charts for progress
import { WeeklyProgressChart } from "@/components/progress/WeeklyProgressChart";
import { SkillRadarChart } from "@/components/progress/SkillRadarChart";

// Quick start actions
const quickStarts = [
  {
    label: "Speaking Practice",
    icon: "Mic",
    route: "/speaking",
    color: "bg-primary text-white",
  },
  {
    label: "Conversation AI",
    icon: "MessageSquare",
    route: "/conversation",
    color: "bg-accent text-white",
  },
  {
    label: "Progress Report",
    icon: "BarChart",
    route: "/progress",
    color: "bg-gradient-to-r from-primary to-accent text-white",
  },
];

function WelcomeCard() {
  const [name, setName] = useState("Speaker");
  
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setName(savedName);
    }
  }, []);
  
  return (
    <Card className="w-full shadow-xl rounded-2xl animate-fade-in mb-4 bg-white">
      <CardHeader>
        <h2 className="font-playfair text-2xl font-bold text-primary">Welcome back, {name}!</h2>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base">Your language learning journey continues. Here's your progress today.</p>
      </CardContent>
    </Card>
  );
}

function QuickStartPanel() {
  const lucideIcons = {
    "Mic": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
    "MessageSquare": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    "BarChart": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6">
      {quickStarts.map((item, i) => {
        const IconComponent = lucideIcons[item.icon as keyof typeof lucideIcons];
        return (
          <a
            key={item.label}
            href={item.route}
            className={`rounded-2xl flex flex-col items-center justify-center p-6 h-36 shadow-lg hover:scale-105 transition-all ${item.color}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {IconComponent && <IconComponent />}
            <span className="font-semibold mt-2">{item.label}</span>
          </a>
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
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-2 py-8 md:p-12">
          <div className="w-full max-w-6xl space-y-6">
            <WelcomeCard />
            <QuickStartPanel />
            
            {/* Progress Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeeklyProgressChart />
              <SkillRadarChart />
            </div>
            
            {/* Daily Goals and Streak Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DailyGoals />
              <StreakTracker streakData={mockStreakData} currentStreak={5} />
            </div>
            
            {/* Level and Motivation Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LevelIndicator level="Intermediate" xp={1250} xpToNextLevel={2000} />
              <MotivationalTipCard />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
