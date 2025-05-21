
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

// Create starry background effect
const StarsBackground = () => {
  const [stars, setStars] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);
  
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
        
        // Randomly choose between twinkle and float animations or both
        const animationClass = Math.random() < 0.5 ? "twinkle" : "float";
        
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

export function AppLayout({ children, showBackButton = true }: AppLayoutProps) {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const isHomePage = window.location.pathname === "/";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Play a sound when the layout mounts
    playSound('valid');
    
    // Add a subtle background animation
    const body = document.body;
    body.classList.add('bg-gradient-animation');
    
    setMounted(true);
    
    return () => {
      body.classList.remove('bg-gradient-animation');
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
        <AppSidebar />
        <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
          {!isHomePage && showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="m-4 hover:bg-primary/10 hover:scale-110 transition-all duration-300 dark-button" 
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
          )}
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
