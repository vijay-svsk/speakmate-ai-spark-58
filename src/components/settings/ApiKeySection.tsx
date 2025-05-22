
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function ApiKeySection() {
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    
    // Auto-save the API key when it's changed
    // In a real app, you would send this to your backend
    if (key.length > 0) {
      // Save to localStorage for demo purposes
      localStorage.setItem("api_key", key);
      
      toast({
        title: "API Key Saved",
        description: "Your API key has been automatically saved.",
        duration: 3000,
      });
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Load API key from localStorage on component mount
  React.useEffect(() => {
    const savedKey = localStorage.getItem("api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  return (
    <Card className="backdrop-blur-md border border-primary/20 bg-background/30 overflow-hidden relative">
      {/* Space-themed animated elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-pulse-light"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-pulse-light"></div>
      
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">API Key</CardTitle>
        <CardDescription>Enter your API key for enhanced features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type={showApiKey ? "text" : "password"}
            placeholder="Enter your API key"
            value={apiKey}
            onChange={handleApiKeyChange}
            className="pr-24 backdrop-blur-sm bg-white/5 border-primary/20 focus:border-primary/50"
            showPasswordToggle={false}
            endContent={
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleShowApiKey}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={copyApiKey}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  disabled={!apiKey}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            }
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Your API key is securely stored and will be used for all features requiring API access
        </p>
      </CardContent>
    </Card>
  );
}
