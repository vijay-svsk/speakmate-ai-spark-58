
import React, { useEffect, useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// Dashboard components
import { DailyGoals } from "@/components/dashboard/DailyGoals";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { LevelIndicator } from "@/components/dashboard/LevelIndicator";
import { MotivationalTipCard } from "@/components/dashboard/MotivationalTipCard";
// Charts for progress
import { WeeklyProgressChart } from "@/components/progress/WeeklyProgressChart";
import { SkillRadarChart } from "@/components/progress/SkillRadarChart";
import { useSound } from "@/lib/useSound";
import confetti from 'canvas-confetti';
import { Moon, Sun } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Quick start actions
const quickStarts = [
  {
    label: "Speaking Practice",
    icon: "Mic",
    route: "/speaking",
    color: "bg-gradient-to-br from-primary to-purple-400 text-white hover:shadow-lg hover:shadow-primary/30 dark:border dark:border-primary/40 dark:hover:shadow-primary/40",
  },
  {
    label: "Conversation AI",
    icon: "MessageSquare",
    route: "/conversation",
    color: "bg-gradient-to-br from-accent to-blue-400 text-white hover:shadow-lg hover:shadow-accent/30 dark:border dark:border-accent/40 dark:hover:shadow-accent/40",
  },
  {
    label: "Progress Report",
    icon: "BarChart",
    route: "/progress",
    color: "bg-gradient-to-br from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/30 dark:border dark:border-primary/40 dark:hover:shadow-primary/40",
  },
];

function WelcomeCard() {
  const [name, setName] = useState("Speaker");
  const { playSound } = useSound();
  
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setName(savedName);
    }
    
    // Trigger confetti on dashboard load
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 }
      });
      playSound('win');
    }, 1000);
  }, [playSound]);
  
  return (
    <Card className="w-full shadow-xl rounded-2xl animate-fade-in mb-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900 dark-card">
      <CardHeader>
        <h2 className="font-playfair text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Welcome back, {name}!</h2>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 text-lg">Your language learning journey continues. Here's your progress today.</p>
      </CardContent>
    </Card>
  );
}

function QuickStartPanel() {
  const { playSound } = useSound();
  const navigate = useNavigate();
  
  const lucideIcons = {
    "Mic": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
    "MessageSquare": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    "BarChart": () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
  };

  const handleClick = (route: string) => {
    playSound('valid');
    navigate(route);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6">
      {quickStarts.map((item, i) => {
        const IconComponent = lucideIcons[item.icon as keyof typeof lucideIcons];
        return (
          <button
            key={item.label}
            onClick={() => handleClick(item.route)}
            className={`rounded-2xl flex flex-col items-center justify-center p-6 h-36 shadow-lg hover:scale-105 transition-all duration-300 ${item.color} animate-fade-in dark-button`}
            style={{ animationDelay: `${i * 100}ms` }}
            onMouseEnter={() => playSound('keypress')}
          >
            {IconComponent && <IconComponent />}
            <span className="font-semibold mt-2">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const { playSound } = useSound();

  useEffect(() => {
    // Check initial theme preference
    const darkModePreference = localStorage.getItem('dark-mode');
    const darkMode = darkModePreference === 'true';
    setIsDark(darkMode);
    
    // Apply theme
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    playSound('keypress');
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('dark-mode', newDarkMode.toString());
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="fixed top-4 right-4 rounded-full p-2 z-10 dark-button bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
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
  
  useEffect(() => {
    setShowAnimation(true);
  }, []);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex w-full transition-all duration-500 ease-in-out">
        <AppSidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-2 py-8 md:p-12">
          <ThemeToggle />
          <div className={`w-full max-w-6xl space-y-8 ${showAnimation ? 'animate-fade-in' : 'opacity-0'}`}>
            <WelcomeCard />
            <QuickStartPanel />
            
            {/* Progress Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl dark-card rounded-xl">
                <WeeklyProgressChart />
              </div>
              <div className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl dark-card rounded-xl">
                <SkillRadarChart />
              </div>
            </div>
            
            {/* Daily Goals and Streak Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transform hover:scale-105 transition-all duration-300 dark-card rounded-xl">
                <DailyGoals />
              </div>
              <div className="transform hover:scale-105 transition-all duration-300 dark-card rounded-xl">
                <StreakTracker streakData={mockStreakData} currentStreak={5} />
              </div>
            </div>
            
            {/* Level and Motivation Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transform hover:scale-105 transition-all duration-300 dark-card rounded-xl">
                <LevelIndicator level="Intermediate" xp={1250} xpToNextLevel={2000} />
              </div>
              <div className="transform hover:scale-105 transition-all duration-300 dark-card rounded-xl">
                <MotivationalTipCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
