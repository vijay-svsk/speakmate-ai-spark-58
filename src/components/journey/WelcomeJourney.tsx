
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Home } from "lucide-react";
import confetti from 'canvas-confetti';

interface WelcomeJourneyProps {
  userName: string;
  onStartJourney: () => void;
}

export const WelcomeJourney: React.FC<WelcomeJourneyProps> = ({ userName, onStartJourney }) => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has seen welcome today
    const lastWelcome = localStorage.getItem('lastWelcomeDate');
    const today = new Date().toDateString();
    
    if (lastWelcome === today) {
      setShowWelcome(false);
    } else {
      // Trigger welcome confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
    }
  }, []);

  const handleStartJourney = () => {
    localStorage.setItem('lastWelcomeDate', new Date().toDateString());
    setShowWelcome(false);
    onStartJourney();
  };

  if (!showWelcome) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 animate-scale-in">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              👋 Welcome back, Fluent Explorer!
            </h1>
            <div className="text-lg text-muted-foreground">
              Your journey to mastering English begins right from your school.
            </div>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg space-y-4">
            <p className="text-base leading-relaxed">
              Walk with us each day — step by step — as we unlock the secrets of 
              <span className="font-semibold text-primary"> Speaking</span>, 
              <span className="font-semibold text-accent"> Pronunciation</span>, 
              <span className="font-semibold text-primary"> Vocabulary</span>, 
              <span className="font-semibold text-accent"> Grammar</span>, 
              <span className="font-semibold text-primary"> Reflexes</span>, and 
              <span className="font-semibold text-accent"> Storytelling</span> in the most magical way!
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>From School to Fluent House</span>
              <Home className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              🌍 <strong>Concept:</strong> You are the main character walking home from school every day — 
              but this is no ordinary road. Each step reveals a special power!
            </div>
            
            <Button 
              onClick={handleStartJourney}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 px-6 text-lg transform hover:scale-105 transition-all duration-300"
            >
              <Star className="mr-2 h-5 w-5" />
              Begin Your Journey ✨
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
