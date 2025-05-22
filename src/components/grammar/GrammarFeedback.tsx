
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
  type: string;
}

interface GrammarFeedbackProps {
  text: string;
  score: number;
  errors: GrammarError[];
  suggestion: string;
}

const GrammarFeedback = ({ text, score, errors, suggestion }: GrammarFeedbackProps) => {
  return (
    <Card className="mb-8 border-t-4 border-primary">
      <CardHeader>
        <CardTitle>Grammar Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Score: {score}/100</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Corrected Text:</h3>
          <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-800">
            {text}
          </div>
        </div>

        {errors.length > 0 ? (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Grammar Issues Found:</h3>
            {errors.map((error, index) => (
              <Alert key={index} className="mb-3">
                <AlertTitle className="font-medium">{error.type}</AlertTitle>
                <AlertDescription>
                  <p className="mb-1"><strong>Original:</strong> {error.original}</p>
                  <p className="mb-1"><strong>Corrected:</strong> {error.corrected}</p>
                  <p><strong>Explanation:</strong> {error.explanation}</p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <Alert className="mb-4">
            <AlertTitle className="font-medium">No major grammar issues found</AlertTitle>
            <AlertDescription>Great job! Your text looks good grammatically.</AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="font-medium mb-2">Suggestions:</h3>
          <p>{suggestion}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrammarFeedback;
