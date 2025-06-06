
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Flower2, 
  Zap, 
  BookOpen, 
  Volume2, 
  TreePine, 
  Home,
  Star,
  Lock,
  CheckCircle
} from "lucide-react";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  emoji: string;
  color: string;
  completed: boolean;
  locked: boolean;
}

export const JourneyMap: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Get progress from localStorage
  const getStepProgress = () => {
    const progress = JSON.parse(localStorage.getItem('journeyProgress') || '{}');
    return progress;
  };

  const journeySteps: JourneyStep[] = [
    {
      id: 'school',
      title: '🏫 School',
      description: 'Your starting point - ready to learn!',
      icon: GraduationCap,
      route: '/',
      emoji: '🏫',
      color: 'bg-blue-500',
      completed: true,
      locked: false
    },
    {
      id: 'vocabulary',
      title: '🌱 Vocabulary Garden',
      description: 'Grow new words daily',
      icon: Flower2,
      route: '/vocabulary',
      emoji: '🌱',
      color: 'bg-green-500',
      completed: getStepProgress().vocabulary || false,
      locked: false
    },
    {
      id: 'reflex',
      title: '⚡ Reflex Bridge',
      description: 'Think fast, speak faster!',
      icon: Zap,
      route: '/reflex',
      emoji: '⚡',
      color: 'bg-yellow-500',
      completed: getStepProgress().reflex || false,
      locked: !getStepProgress().vocabulary
    },
    {
      id: 'grammar',
      title: '📚 Grammar Lane',
      description: 'Master the rules of language',
      icon: BookOpen,
      route: '/grammar',
      emoji: '📚',
      color: 'bg-purple-500',
      completed: getStepProgress().grammar || false,
      locked: !getStepProgress().reflex
    },
    {
      id: 'pronunciation',
      title: '🔊 Pronunciation Pond',
      description: 'Perfect your speech sounds',
      icon: Volume2,
      route: '/pronunciation',
      emoji: '🔊',
      color: 'bg-blue-600',
      completed: getStepProgress().pronunciation || false,
      locked: !getStepProgress().grammar
    },
    {
      id: 'story',
      title: '📖 Story Tree',
      description: 'Weave magical tales',
      icon: TreePine,
      route: '/story',
      emoji: '📖',
      color: 'bg-orange-500',
      completed: getStepProgress().story || false,
      locked: !getStepProgress().pronunciation
    },
    {
      id: 'fluent-house',
      title: '🏡 Fluent House',
      description: 'Speaking Room unlocked!',
      icon: Home,
      route: '/speaking',
      emoji: '🏡',
      color: 'bg-gradient-to-r from-primary to-accent',
      completed: getStepProgress().speaking || false,
      locked: !getStepProgress().story
    }
  ];

  const handleStepClick = (step: JourneyStep, index: number) => {
    if (step.locked) return;
    
    setCurrentStep(index);
    navigate(step.route);
  };

  const completedSteps = journeySteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / journeySteps.length) * 100;

  return (
    <Card className="w-full bg-gradient-to-br from-background to-muted/30 border-2 border-border/50">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-playfair font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              🗺️ Your Journey to the Fluent House
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-full max-w-md bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <Badge variant="secondary" className="min-w-fit">
                {completedSteps}/{journeySteps.length}
              </Badge>
            </div>
          </div>

          {/* Journey Steps */}
          <div className="space-y-4">
            {journeySteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < journeySteps.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-border z-0" />
                )}
                
                {/* Step Card */}
                <Button
                  variant="ghost"
                  onClick={() => handleStepClick(step, index)}
                  disabled={step.locked}
                  className={`w-full p-4 h-auto justify-start hover:bg-primary/10 transition-all duration-300 ${
                    step.locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  } ${currentStep === index ? 'bg-primary/20 border-2 border-primary/50' : ''}`}
                >
                  <div className="flex items-center gap-4 w-full">
                    {/* Step Icon */}
                    <div className={`relative p-3 rounded-full ${step.color} text-white flex-shrink-0`}>
                      {step.locked ? (
                        <Lock className="h-5 w-5" />
                      ) : step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                      {step.completed && (
                        <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        {step.completed && (
                          <Badge variant="success" className="text-xs">
                            Completed ✨
                          </Badge>
                        )}
                        {step.locked && (
                          <Badge variant="outline" className="text-xs">
                            Locked 🔒
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>

                    {/* Arrow */}
                    {!step.locked && (
                      <div className="text-primary">
                        →
                      </div>
                    )}
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {/* Daily Encouragement */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg text-center">
            <p className="text-sm font-medium">
              🌟 "Each step on this magical road reveals a special power. Keep walking, Fluent Explorer!"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
