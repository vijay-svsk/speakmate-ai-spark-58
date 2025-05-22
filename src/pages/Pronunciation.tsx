
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import MirrorPractice from "./MirrorPractice";

export default function Pronunciation() {
  return (
    <AppLayout showBackButton={true}>
      <div className="container mx-auto py-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-playfair text-primary mb-4 gradient-text">Pronunciation Mirror</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Perfect your pronunciation with our interactive mirror tool. Practice speaking clearly and confidently with real-time feedback.
          </p>
          
          <MirrorPractice />
        </div>
      </div>
    </AppLayout>
  );
}
