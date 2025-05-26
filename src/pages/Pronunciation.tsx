
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PronunciationMirror } from "@/components/pronunciation/PronunciationMirror";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, Monitor } from "lucide-react";

export default function Pronunciation() {
  const navigate = useNavigate();

  return (
    <AppLayout showBackButton={true}>
      <div className="container mx-auto py-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-playfair text-primary mb-4 gradient-text">Pronunciation Mirror</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Perfect your pronunciation with our interactive mirror tool and AI-powered robot assistant. Practice speaking clearly and confidently with real-time feedback.
          </p>
          
          {/* Navigation to Interactive Face */}
          <div className="mb-8 flex justify-center gap-4">
            <Button
              onClick={() => navigate('/interactive-face')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg"
            >
              <Monitor className="h-5 w-5" />
              Open Full Interactive Face
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/interactive-face')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl"
            >
              <Eye className="h-5 w-5" />
              Advanced Lip Training
            </Button>
          </div>
          
          <PronunciationMirror />
        </div>
      </div>
    </AppLayout>
  );
}
