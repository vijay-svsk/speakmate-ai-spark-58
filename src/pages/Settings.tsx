
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:scale-110 transition-all duration-300"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Settings</h1>
          </div>
          <SettingsForm />
        </div>
      </div>
    </AppLayout>
  );
}
