
import React from "react";
import { Button } from "@/components/ui/button";

interface LevelSelectorProps {
  currentLevel: "beginner" | "intermediate" | "advanced";
  onLevelChange: (level: "beginner" | "intermediate" | "advanced") => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  currentLevel, 
  onLevelChange 
}) => {
  return (
    <div className="flex gap-1 items-center">
      <Button
        size="sm"
        variant={currentLevel === "beginner" ? "default" : "outline"}
        onClick={() => onLevelChange("beginner")}
        className="text-xs h-7"
      >
        Beginner
      </Button>
      <Button
        size="sm"
        variant={currentLevel === "intermediate" ? "default" : "outline"}
        onClick={() => onLevelChange("intermediate")}
        className="text-xs h-7"
      >
        Intermediate
      </Button>
      <Button
        size="sm"
        variant={currentLevel === "advanced" ? "default" : "outline"}
        onClick={() => onLevelChange("advanced")}
        className="text-xs h-7"
      >
        Advanced
      </Button>
    </div>
  );
};
