
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StoryDisplay } from "@/components/story/StoryDisplay";
import { useStory } from "@/hooks/use-story";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type DifficultyLevel = "beginner" | "intermediate" | "advanced";

const Story = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const { story, loading, error, generateStory } = useStory();
  const [progress, setProgress] = useState(0);

  // Generate a story when the component mounts or difficulty changes
  useEffect(() => {
    generateStory(difficulty);
  }, [difficulty, generateStory]);

  const handleRegenerateStory = () => {
    generateStory(difficulty);
    toast.success("Generating a new story...");
    setProgress(0);
  };

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as DifficultyLevel);
    setProgress(0);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-primary">Story Builder</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="difficulty" className="whitespace-nowrap">Difficulty:</Label>
                  <Select value={difficulty} onValueChange={handleDifficultyChange}>
                    <SelectTrigger id="difficulty" className="w-36">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRegenerateStory}
                      disabled={loading}
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Generate new story</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="rounded-lg border p-6 bg-card shadow-sm">
              {loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <div className="text-lg font-medium">Generating your story...</div>
                  <Progress value={45} className="w-64" />
                </div>
              ) : error ? (
                <div className="text-center py-12 text-destructive">
                  <p>Failed to load story. Please try again.</p>
                  <Button onClick={handleRegenerateStory} className="mt-4">Retry</Button>
                </div>
              ) : (
                <StoryDisplay 
                  story={story} 
                  onProgressUpdate={setProgress} 
                />
              )}
            </div>

            {!loading && !error && story && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Progress</div>
                  <div className="text-sm text-muted-foreground">{Math.round(progress)}% complete</div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Story;
