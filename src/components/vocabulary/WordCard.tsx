
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Headphones } from "lucide-react";

interface WordProps {
  word: {
    word: string;
    meaning: string;
    partOfSpeech: string;
    phonetic: string;
    example: string;
    synonyms: string[];
    antonyms: string[];
    memoryTip: string;
  };
  onNextWord: () => void;
  onPractice: () => void;
  isListening: boolean;
}

export const WordCard: React.FC<WordProps> = ({ 
  word, 
  onNextWord, 
  onPractice,
  isListening 
}) => {
  const [showExample, setShowExample] = useState(false);
  const [showMemoryTip, setShowMemoryTip] = useState(false);
  
  // This would use browser's TTS API in a real implementation
  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="bg-primary/10 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-badge text-primary">
              {word.partOfSpeech}
            </span>
            <h2 className="text-3xl font-playfair font-bold mt-2">{word.word}</h2>
            <div className="text-gray-500 font-mono">{word.phonetic}</div>
          </div>
          <Button size="icon" variant="ghost" onClick={speakWord}>
            <Headphones className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500">Definition</label>
          <p className="text-gray-800">{word.meaning}</p>
        </div>
        
        {showExample && (
          <div className="mb-4 animate-fade-in">
            <label className="text-sm font-medium text-gray-500">Example</label>
            <p className="text-gray-800 italic">&ldquo;{word.example}&rdquo;</p>
          </div>
        )}
        
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500">Synonyms</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {word.synonyms.map((synonym) => (
              <span 
                key={synonym} 
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {synonym}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500">Antonyms</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {word.antonyms.map((antonym) => (
              <span 
                key={antonym} 
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {antonym}
              </span>
            ))}
          </div>
        </div>
        
        {showMemoryTip && (
          <div className="mb-4 animate-fade-in bg-badge/40 p-3 rounded-md">
            <label className="text-sm font-medium text-primary">Memory Tip</label>
            <p className="text-gray-800">{word.memoryTip}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowExample(!showExample)}
            className="text-xs"
          >
            {showExample ? 'Hide Example' : 'Show Example'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowMemoryTip(!showMemoryTip)}
            className="text-xs"
          >
            {showMemoryTip ? 'Hide Memory Tip' : 'Show Memory Tip'}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 border-t">
        <Button
          onClick={onPractice}
          variant="default"
          className={`flex-1 mr-2 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          <Mic className="mr-2 h-4 w-4" />
          {isListening ? 'Listening...' : 'Practice Pronunciation'}
        </Button>
      </CardFooter>
    </Card>
  );
};
