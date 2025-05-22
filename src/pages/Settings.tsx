
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSound } from "@/lib/useSound";

export default function Settings() {
  const navigate = useNavigate();
  const { playSound } = useSound();

  const handleBack = () => {
    playSound('keypress');
    navigate(-1);
  };

  return (
    <AppLayout>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 relative group"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5 text-primary group-hover:text-primary/80" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200">Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Settings</h1>
              <p className="text-muted-foreground text-sm mt-1">Configure your learning preferences</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-70 dark:opacity-30 animate-pulse-light"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl opacity-70 dark:opacity-30 animate-pulse-light"></div>
            <SettingsForm />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
