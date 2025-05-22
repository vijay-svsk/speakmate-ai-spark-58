
import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSound } from "@/lib/useSound";
import { SpaceBackground, FloatingElements } from "./SpaceElements";

interface AppLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

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
        {/* Space-themed background effects */}
        {mounted && <SpaceBackground />}
        {mounted && <FloatingElements />}
        
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
