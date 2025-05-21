
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function Pronunciation() {
  return (
    <AppLayout showBackButton={true}>
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-playfair text-primary mb-4 gradient-text">Pronunciation Mirror</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Practice your pronunciation with our interactive mirror tool.
          </p>
          
          <Card className="max-w-3xl mx-auto dark-card shadow-lg rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-center text-xl font-medium">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-full bg-primary/10 p-8 dark:bg-primary/20 shadow-inner">
                  <Mic className="h-12 w-12 text-primary animate-bounce-light" />
                </div>
                
                <p className="text-center mb-4 dark:text-gray-300">
                  This feature is coming soon! Check back later for pronunciation exercises.
                </p>
                
                <div className="mt-4">
                  <Button className="dark-button px-8 py-6">
                    <span className="text-lg">Get Started</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
