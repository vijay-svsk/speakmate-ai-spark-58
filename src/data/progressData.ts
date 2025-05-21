
// Mock data for the progress page
// In a real app, this would come from a database

export const overallProgress = {
  speaking: 65,
  pronunciation: 78,
  vocabulary: 62,
  grammar: 70,
  story: 55,
  reflex: 40,
};

export const weeklyData = [
  { name: "Mon", Speaking: 45, Pronunciation: 60, Vocabulary: 35, Grammar: 40, Story: 30, Reflex: 25 },
  { name: "Tue", Speaking: 50, Pronunciation: 65, Vocabulary: 40, Grammar: 45, Story: 35, Reflex: 30 },
  { name: "Wed", Speaking: 55, Pronunciation: 70, Vocabulary: 45, Grammar: 50, Story: 40, Reflex: 32 },
  { name: "Thu", Speaking: 58, Pronunciation: 72, Vocabulary: 50, Grammar: 55, Story: 45, Reflex: 35 },
  { name: "Fri", Speaking: 62, Pronunciation: 75, Vocabulary: 55, Grammar: 60, Story: 48, Reflex: 37 },
  { name: "Sat", Speaking: 63, Pronunciation: 76, Vocabulary: 60, Grammar: 65, Story: 52, Reflex: 38 },
  { name: "Sun", Speaking: 65, Pronunciation: 78, Vocabulary: 62, Grammar: 70, Story: 55, Reflex: 40 },
];

export const radarData = [
  { skill: "Speaking", value: 65, fullMark: 100 },
  { skill: "Pronunciation", value: 78, fullMark: 100 },
  { skill: "Vocabulary", value: 62, fullMark: 100 },
  { skill: "Grammar", value: 70, fullMark: 100 },
  { skill: "Story", value: 55, fullMark: 100 },
  { skill: "Reflex", value: 40, fullMark: 100 },
];

export const moduleCompletionData = [
  { name: "Speaking", completion: 65, color: "#9b87f5" },
  { name: "Pronunciation", completion: 78, color: "#33C3F0" },
  { name: "Vocabulary", completion: 62, color: "#F06292" },
  { name: "Grammar", completion: 70, color: "#AED581" },
  { name: "Story", completion: 55, color: "#FFD54F" },
  { name: "Reflex", completion: 40, color: "#FF7043" },
];

export const activityLog = [
  { date: "2025-05-20", module: "Vocabulary", activity: "Learned 5 new words", score: 85 },
  { date: "2025-05-20", module: "Grammar", activity: "Completed passive voice exercise", score: 78 },
  { date: "2025-05-19", module: "Speaking", activity: "Practiced introductions", score: 82 },
  { date: "2025-05-19", module: "Story", activity: "Created a short story", score: 90 },
  { date: "2025-05-18", module: "Pronunciation", activity: "Practiced vowel sounds", score: 75 },
  { date: "2025-05-17", module: "Reflex", activity: "Completed basic challenge", score: 65 },
  { date: "2025-05-17", module: "Grammar", activity: "Practiced using articles", score: 88 },
  { date: "2025-05-16", module: "Vocabulary", activity: "Reviewed 10 words", score: 92 },
];
