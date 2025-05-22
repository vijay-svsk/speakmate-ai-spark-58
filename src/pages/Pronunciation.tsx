
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function Pronunciation() {
  return (
    <AppLayout showBackButton={true}>
      <div className="container mx-auto py-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-playfair text-primary mb-4 gradient-text">Pronunciation Mirror</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Perfect your pronunciation with our interactive mirror tool. Practice speaking clearly and confidently with real-time feedback.
          </p>
          
          <Card className="max-w-3xl mx-auto dark-card shadow-lg rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            <CardHeader>
              <CardTitle className="text-center text-2xl font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Coming Soon</CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-light"></div>
                  <div className="rounded-full bg-primary/10 p-8 dark:bg-primary/20 shadow-inner relative z-10">
                    <Mic className="h-16 w-16 text-primary animate-float" />
                  </div>
                  
                  <div className="absolute inset-0 rounded-full animate-glow"></div>
                  
                  <div className="absolute -top-4 -left-4 w-4 h-4 rounded-full bg-primary animate-float opacity-50"></div>
                  <div className="absolute top-2 -right-2 w-3 h-3 rounded-full bg-accent animate-float opacity-40" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute -bottom-2 left-2 w-2 h-2 rounded-full bg-primary animate-float opacity-60" style={{animationDelay: '1s'}}></div>
                </div>
                
                <div className="space-y-6 max-w-lg">
                  <p className="text-center text-lg dark:text-gray-300">
                    Our innovative pronunciation tool is coming soon! Practice speaking English with confidence and get instant feedback on your pronunciation.
                  </p>
                  
                  <ul className="text-left space-y-2 text-muted-foreground mx-auto max-w-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Real-time pronunciation feedback</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Focus on problematic sounds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Track your improvement over time</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  <Button className="dark-button px-8 py-6 relative">
                    <span className="text-lg font-medium">Get Notified When Ready</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12">
            <h2 className="text-2xl font-playfair mb-4 text-gray-800 dark:text-gray-200">Why Practice Pronunciation?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-lg mb-2 text-primary">Confidence Builder</h3>
                <p className="text-muted-foreground">Clear pronunciation builds confidence in everyday conversations.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-lg mb-2 text-primary">Better Understanding</h3>
                <p className="text-muted-foreground">Be easily understood in all your English conversations.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-lg mb-2 text-primary">Faster Progress</h3>
                <p className="text-muted-foreground">Improve your overall English skills more quickly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
