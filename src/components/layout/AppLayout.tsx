
import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSound } from "@/lib/useSound";

interface AppLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

// Updated the star object interface to include className
interface Star {
  id: number;
  style: React.CSSProperties;
  className: string;
}

// Create starry background effect
const StarsBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Create random stars
    const generateStars = () => {
      const newStars = [];
      const starCount = 100; // Number of stars to generate
      
      for (let i = 0; i < starCount; i++) {
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random size
        const size = Math.random() < 0.6 ? "small" : Math.random() < 0.9 ? "medium" : "large";
        
        // Random animation delay
        const animationDelay = `${Math.random() * 5}s`;
        
        // Randomly choose between twinkle and float animations
        const animationType = Math.random() < 0.7 ? "twinkle" : "float";
        
        // Occasional shooting star
        const isShootingStar = Math.random() < 0.05;
        
        let animationClass = animationType;
        if (isShootingStar) {
          animationClass = "shooting-star";
        }
        
        newStars.push({
          id: i,
          style: {
            left: `${left}%`,
            top: `${top}%`,
            animationDelay,
            opacity: Math.random() * 0.7 + 0.3,
          },
          className: `star ${size} ${animationClass}`
        });
      }
      
      return newStars;
    };
    
    setStars(generateStars());
  }, []);
  
  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div 
          key={star.id} 
          className={star.className}
          style={star.style}
        />
      ))}
    </div>
  );
};

// Learning bubble component for floating educational elements
const LearningBubbles = () => {
  const bubbles = [
    { id: 1, text: "Vocabulary", color: "from-blue-500 to-indigo-600" },
    { id: 2, text: "Grammar", color: "from-green-500 to-teal-600" },
    { id: 3, text: "Speaking", color: "from-red-500 to-pink-600" },
    { id: 4, text: "Listening", color: "from-yellow-500 to-amber-600" },
    { id: 5, text: "Writing", color: "from-purple-500 to-violet-600" },
  ];
  
  return (
    <div className="learning-bubbles">
      {bubbles.map((bubble, index) => (
        <div 
          key={bubble.id}
          className={`learning-bubble bg-gradient-to-br ${bubble.color} text-white`}
          style={{ 
            animationDelay: `${index * 0.8}s`,
            left: `${(index * 20) % 80 + 10}%`,
            top: `${((index * 15) % 40) + 30}%`,
          }}
        >
          {bubble.text}
        </div>
      ))}
    </div>
  );
};

export function AppLayout({ children, showBackButton = true }: AppLayoutProps) {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const isHomePage = window.location.pathname === "/";
  const [mounted, setMounted] = useState(false);
  const [showBubbles, setShowBubbles] = useState(false);

  useEffect(() => {
    // Play a sound when the layout mounts
    playSound('valid');
    
    // Add a subtle background animation
    const body = document.body;
    body.classList.add('bg-gradient-animation');
    
    setMounted(true);
    
    // Show learning bubbles after a delay
    const timer = setTimeout(() => {
      setShowBubbles(true);
    }, 500);
    
    return () => {
      body.classList.remove('bg-gradient-animation');
      clearTimeout(timer);
    };
  }, [playSound]);

  const handleBack = () => {
    playSound('keypress');
    navigate(-1);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 dark:text-gray-100 transition-all duration-500 ease-in-out">
        {mounted && <StarsBackground />}
        {mounted && showBubbles && isHomePage && <LearningBubbles />}
        
        <AppSidebar />
        
        <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out relative">
          {!isHomePage && showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="m-4 hover:bg-primary/10 hover:scale-110 transition-all duration-300 dark-button relative group" 
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-muted-foreground">Go back</span>
            </Button>
          )}
          
          <div className="animate-fade-in relative z-10">
            {children}
          </div>
          
          <div className="fixed bottom-5 right-5 opacity-70 text-xs text-muted-foreground dark:text-gray-500">
            <span className="bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-md backdrop-blur-sm">
              Iyraa English Tutor
            </span>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
