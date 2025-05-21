
import React, { useEffect } from "react";
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

export function AppLayout({ children, showBackButton = true }: AppLayoutProps) {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const isHomePage = window.location.pathname === "/";

  useEffect(() => {
    // Play a sound when the layout mounts
    playSound('valid');
    
    // Add a subtle background animation
    const body = document.body;
    body.classList.add('bg-gradient-animation');
    
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
      <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <AppSidebar />
        <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
          {!isHomePage && showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="m-4 hover:bg-primary/10 hover:scale-110 transition-all duration-300" 
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
