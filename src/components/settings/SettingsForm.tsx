
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useSound } from "@/lib/useSound";

// Form schema with validation
const settingsFormSchema = z.object({
  geminiApiKey: z.string().min(1, {
    message: "API key is required.",
  }),
  muteSounds: z.boolean().default(false),
  darkMode: z.boolean().default(false),
  notificationsEnabled: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const { playSound, toggleMute, isMuted } = useSound();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Get default values from localStorage
  const loadSettings = (): SettingsFormValues => {
    // Try to get settings from localStorage or use defaults
    const savedApiKey = localStorage.getItem("gemini-api-key") || "";
    const savedMuteSounds = localStorage.getItem("mute-sounds") === "true";
    const savedDarkMode = localStorage.getItem("dark-mode") === "true";
    const savedNotifications = localStorage.getItem("notifications-enabled") !== "false";
    
    return {
      geminiApiKey: savedApiKey,
      muteSounds: savedMuteSounds,
      darkMode: savedDarkMode,
      notificationsEnabled: savedNotifications,
    };
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: loadSettings(),
  });

  // Handle form submission
  const onSubmit = (data: SettingsFormValues) => {
    // Save API key to localStorage
    localStorage.setItem("gemini-api-key", data.geminiApiKey);
    
    // Save other settings
    localStorage.setItem("mute-sounds", data.muteSounds.toString());
    localStorage.setItem("dark-mode", data.darkMode.toString());
    localStorage.setItem("notifications-enabled", data.notificationsEnabled.toString());
    
    // Apply settings immediately
    if (data.muteSounds !== isMuted) toggleMute();
    
    // Show success toast
    playSound("valid");
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  // Handle dark mode toggle
  useEffect(() => {
    // Apply dark mode changes
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  
  // Apply saved mute setting on component mount
  useEffect(() => {
    const muteSetting = localStorage.getItem("mute-sounds") === "true";
    if (muteSetting !== isMuted) toggleMute();
    
    // Apply saved dark mode setting
    const darkModeSetting = localStorage.getItem("dark-mode") === "true";
    setIsDarkMode(darkModeSetting);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* API Key Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  API Keys
                </h2>
                
                <FormField
                  control={form.control}
                  name="geminiApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Gemini API Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Gemini API key"
                          {...field}
                          type="password"
                          className="font-mono"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary underline">Google AI Studio</a>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* General Settings */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  General Settings
                </h2>
                
                <FormField
                  control={form.control}
                  name="muteSounds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Mute Sound Effects</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Turn off all sound effects in the application.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Don't toggle here, wait for form submission
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="darkMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Dark Mode</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark theme.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setIsDarkMode(checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Notifications</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about progress and achievements.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button type="submit" className="w-full">Save Settings</Button>
      </form>
    </Form>
  );
}
