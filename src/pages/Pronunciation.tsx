
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";

export default function Pronunciation() {
  return (
    <AppLayout showBackButton={true}>
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-playfair text-primary mb-6">Pronunciation Mirror</h1>
          <p className="text-lg text-gray-600 mb-8">
            Practice your pronunciation with our interactive mirror tool.
          </p>
          
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <p className="text-center mb-4">
              This feature is coming soon! Check back later for pronunciation exercises.
            </p>
            
            <div className="mt-8 flex justify-center">
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
