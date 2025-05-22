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
import { Moon, Sun, Volume2, VolumeX, Bell, Eye, EyeOff, Copy, Check } from "lucide-react";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
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

  // Handle API key change to auto-save after a delay
  useEffect(() => {
    const apiKey = form.watch("geminiApiKey");
    
    // Skip on initial load
    if (!isSaved && apiKey) {
      const timer = setTimeout(() => {
        if (apiKey && apiKey.length > 10) { // Only save if looks like a valid key
          localStorage.setItem("gemini-api-key", apiKey);
          setIsSaved(true);
          toast({
            title: "API Key Saved",
            description: "Your API key has been automatically saved.",
          });
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [form.watch("geminiApiKey"), isSaved]);

  // Reset the copy state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Handle form submission
  const onSubmit = (data: SettingsFormValues) => {
    // Save API key to localStorage
    localStorage.setItem("gemini-api-key", data.geminiApiKey);
    setIsSaved(true);
    
    // Save other settings
    localStorage.setItem("mute-sounds", data.muteSounds.toString());
    localStorage.setItem("dark-mode", data.darkMode.toString());
    localStorage.setItem("notifications-enabled", data.notificationsEnabled.toString());
    
    // Apply settings immediately
    setIsDarkMode(data.darkMode);
    
    // Apply dark mode changes
    if (data.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Show success toast
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  // Copy API key to clipboard
  const copyApiKey = () => {
    const apiKey = form.getValues("geminiApiKey");
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
      });
    }
  };
  
  // Toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  
  // Apply saved dark mode setting on component mount
  useEffect(() => {
    const darkModeSetting = localStorage.getItem("dark-mode") === "true";
    setIsDarkMode(darkModeSetting);
    
    if (darkModeSetting) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="animate-fade-in dark-card backdrop-blur-sm border-2">
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
                      <FormLabel className="text-lg">Google Gemini API Key</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <div className="flex items-center relative">
                            <Input
                              placeholder="Enter your Gemini API key"
                              {...field}
                              type={showApiKey ? "text" : "password"}
                              className="font-mono dark:bg-gray-800/80 dark:border-gray-700 pr-20 transition-all duration-200 border-2 focus-visible:border-primary"
                              onChange={(e) => {
                                field.onChange(e);
                                setIsSaved(false);
                              }}
                            />
                            <div className="absolute right-2 flex items-center space-x-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={toggleApiKeyVisibility}
                                className="h-8 w-8 hover:bg-primary/20 hover:text-primary transition-all"
                              >
                                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={copyApiKey}
                                className="h-8 w-8 hover:bg-primary/20 hover:text-primary transition-all"
                                disabled={!field.value}
                              >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          Get your API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">Google AI Studio</a>
                        </p>
                        {isSaved && field.value && (
                          <span className="text-xs text-green-500 dark:text-green-400 flex items-center">
                            <Check size={12} className="mr-1" /> Saved
                          </span>
                        )}
                      </div>
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700 dark:bg-gray-800/50 interactive-border hover:shadow-md transition-all duration-300">
                      <div className="space-y-0.5 flex items-center gap-3">
                        {field.value ? (
                          <VolumeX className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-primary" />
                        )}
                        <div>
                          <FormLabel className="text-base">Mute Sound Effects</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Turn off all sound effects in the application.
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Don't toggle here, wait for form submission
                          }}
                          className="data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="darkMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700 dark:bg-gray-800/50 interactive-border hover:shadow-md transition-all duration-300">
                      <div className="space-y-0.5 flex items-center gap-3">
                        {field.value ? (
                          <Moon className="h-5 w-5 text-primary" />
                        ) : (
                          <Sun className="h-5 w-5 text-accent" />
                        )}
                        <div>
                          <FormLabel className="text-base">Dark Mode</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Switch between light and dark theme.
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setIsDarkMode(checked);
                            
                            if (checked) {
                              document.documentElement.classList.add("dark");
                            } else {
                              document.documentElement.classList.remove("dark");
                            }
                          }}
                          className="data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700 dark:bg-gray-800/50 interactive-border hover:shadow-md transition-all duration-300">
                      <div className="space-y-0.5 flex items-center gap-3">
                        <Bell className={`h-5 w-5 ${field.value ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div>
                          <FormLabel className="text-base">Enable Notifications</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about progress and achievements.
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          className="w-full dark-button group relative overflow-hidden bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all duration-300"
        >
          <span className="relative z-10 font-medium">Save Settings</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </Button>
      </form>
    </Form>
  );
}
