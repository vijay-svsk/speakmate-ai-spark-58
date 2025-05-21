
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  practiceDuration: z.string().min(1, "Practice duration is required"),
  grade: z.string().min(1, "Grade is required"),
  level: z.string().min(1, "Level is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function SettingsForm() {
  const { toast: toastUI } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      practiceDuration: "30",
      grade: "5",
      level: "intermediate",
    },
  });

  // Load saved settings on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("gemini-api-key") || "";
    const savedPracticeDuration = localStorage.getItem("practice-duration") || "30";
    const savedGrade = localStorage.getItem("student-grade") || "5";
    const savedLevel = localStorage.getItem("skill-level") || "intermediate";
    
    form.reset({
      apiKey: savedApiKey,
      practiceDuration: savedPracticeDuration,
      grade: savedGrade,
      level: savedLevel,
    });
  }, [form]);

  // Save settings
  const onSubmit = (data: FormValues) => {
    setIsLoading(true);

    try {
      // Save to localStorage
      localStorage.setItem("gemini-api-key", data.apiKey.trim());
      localStorage.setItem("practice-duration", data.practiceDuration);
      localStorage.setItem("student-grade", data.grade);
      localStorage.setItem("skill-level", data.level);

      // Show both toast types for better visibility
      toastUI({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
      
      toast.success("Settings saved successfully! Your API key is now active.");
      
      // Force a reload to ensure the new API key is used by all components
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toastUI({
        title: "Error",
        description: "There was an error saving your settings.",
        variant: "destructive",
      });
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle paste from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    try {
      const clipboardText = e.clipboardData.getData('text');
      const trimmedKey = clipboardText.trim();
      form.setValue('apiKey', trimmedKey);
      
      // Automatically save to localStorage when pasting
      localStorage.setItem("gemini-api-key", trimmedKey);
      toast.success("API key pasted and saved temporarily. Click 'Save Settings' to confirm.");
    } catch (error) {
      toast.error("Failed to paste from clipboard");
    }
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Configure your Google Gemini API key for the conversation features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemini API Key</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter your Gemini API key"
                        type={showApiKey ? "text" : "password"}
                        {...field}
                        onPaste={handlePaste}
                        className="pr-10"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={toggleApiKeyVisibility}
                      className="absolute right-0 top-0 h-full px-3 py-2"
                    >
                      {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Preferences</CardTitle>
            <CardDescription>
              Configure your learning preferences for a personalized experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="practiceDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Practice Duration (minutes)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-2" />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Grade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Grade 1</SelectItem>
                        <SelectItem value="2">Grade 2</SelectItem>
                        <SelectItem value="3">Grade 3</SelectItem>
                        <SelectItem value="4">Grade 4</SelectItem>
                        <SelectItem value="5">Grade 5</SelectItem>
                        <SelectItem value="6">Grade 6</SelectItem>
                        <SelectItem value="7">Grade 7</SelectItem>
                        <SelectItem value="8">Grade 8</SelectItem>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="10">Grade 10</SelectItem>
                        <SelectItem value="11">Grade 11</SelectItem>
                        <SelectItem value="12">Grade 12</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                        <SelectItem value="adult">Adult</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency Level</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="fluent">Fluent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
