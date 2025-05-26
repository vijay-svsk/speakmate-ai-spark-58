
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TalkingFaceDiagram } from "@/components/pronunciation/TalkingFaceDiagram";

export default function InteractiveFace() {
  return (
    <AppLayout showBackButton={true}>
      <div className="container mx-auto py-8">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold font-playfair text-primary mb-4 gradient-text">Interactive Face Trainer</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Practice pronunciation with our advanced interactive face that shows accurate lip movements and phoneme positions. Perfect for visual learners who want to master English pronunciation.
          </p>
          
          <div className="w-full min-h-[700px] max-w-5xl mx-auto">
            <TalkingFaceDiagram 
              word="hello" 
              isAnimating={false} 
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
