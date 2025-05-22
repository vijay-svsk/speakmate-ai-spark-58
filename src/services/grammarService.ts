
// Mock data for the radar chart
export const grammarData = [
  { category: "Grammar", score: 80, fullMark: 100 },
  { category: "Vocabulary", score: 70, fullMark: 100 },
  { category: "Coherence", score: 85, fullMark: 100 },
  { category: "Style", score: 65, fullMark: 100 },
  { category: "Punctuation", score: 90, fullMark: 100 },
];

// Daily challenge suggestions
export const dailyChallenges = [
  "Write a paragraph using 5 different tenses.",
  "Compose three sentences using passive voice correctly.",
  "Write a short story without using any forms of 'to be'.",
  "Create five questions using different question words.",
  "Write instructions for a simple task using imperative form."
];

export interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
  type: string;
}

export interface PosData {
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  adverbs: string[];
  prepositions: string[];
  pronouns: string[];
  conjunctions: string[];
}

export interface PosChartData {
  name: string;
  value: number;
  count: number;
}

export interface GrammarAnalysisResult {
  score: number;
  errors: GrammarError[];
  readabilityScore: number;
  suggestion: string;
  posData: PosData;
  posChartData: PosChartData[];
}

// This would be replaced with a proper API call in a real implementation
export const analyzeGrammar = (text: string): GrammarAnalysisResult => {
  // Placeholder for grammar errors 
  const errors = [
    {
      original: "She do not likes apples",
      corrected: "She does not like apples",
      explanation: "\"Do\" changes to \"does\" for third-person singular. The verb \"like\" stays in base form after \"does\".",
      type: "subject-verb agreement"
    },
    {
      original: "I has been there",
      corrected: "I have been there",
      explanation: "Use \"have\" with I, you, we, they and plural nouns. Use \"has\" with he, she, it and singular nouns.",
      type: "verb form"
    }
  ];

  // POS mock data based on input text
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  // In a real implementation, this would be replaced with a proper NLP library
  // Simple mock implementation for demo purposes
  const posData = {
    nouns: words.filter((_, i) => i % 5 === 0).map(w => w.replace(/[^\w]/g, '')),
    verbs: words.filter((_, i) => i % 4 === 0).map(w => w.replace(/[^\w]/g, '')),
    adjectives: words.filter((_, i) => i % 6 === 0).map(w => w.replace(/[^\w]/g, '')),
    adverbs: words.filter((_, i) => i % 7 === 0).map(w => w.replace(/[^\w]/g, '')),
    prepositions: words.filter((_, i) => i % 8 === 0).map(w => w.replace(/[^\w]/g, '')),
    pronouns: words.filter((_, i) => i % 9 === 0).map(w => w.replace(/[^\w]/g, '')),
    conjunctions: words.filter((_, i) => i % 10 === 0).map(w => w.replace(/[^\w]/g, '')),
  };
  
  // Calculate percentages for the donut chart
  const total = Object.values(posData).reduce((acc, arr) => acc + arr.length, 0) || 1;
  const posChartData = Object.entries(posData).map(([name, words]) => ({
    name,
    value: (words.length / total) * 100,
    count: words.length
  }));
  
  // Random score generation for demo
  const score = Math.floor(Math.random() * 30) + 70;
  
  // Return the analysis data
  return {
    score,
    errors: text.length > 10 ? errors.slice(0, Math.floor(Math.random() * 2) + 1) : [],
    readabilityScore: Math.floor(Math.random() * 50) + 50,
    suggestion: "Try to use more varied sentence structures to make your writing more engaging.",
    posData,
    posChartData
  };
};

