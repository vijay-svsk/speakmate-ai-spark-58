
// Enhanced progress data with daily tracking and analytics
// In a real app, this would come from a database

export const overallProgress = {
  speaking: 65,
  pronunciation: 78,
  vocabulary: 62,
  grammar: 70,
  story: 55,
  reflex: 40,
};

// Daily performance data for the last 30 days
export const generateDailyData = () => {
  const days = 30;
  const today = new Date();
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      speaking: Math.max(0, Math.min(100, 45 + Math.random() * 30 + i * 0.5)),
      pronunciation: Math.max(0, Math.min(100, 60 + Math.random() * 25 + i * 0.6)),
      vocabulary: Math.max(0, Math.min(100, 35 + Math.random() * 35 + i * 0.4)),
      grammar: Math.max(0, Math.min(100, 40 + Math.random() * 40 + i * 0.5)),
      story: Math.max(0, Math.min(100, 30 + Math.random() * 35 + i * 0.4)),
      reflex: Math.max(0, Math.min(100, 25 + Math.random() * 25 + i * 0.3)),
      totalTime: Math.floor(Math.random() * 60) + 30, // minutes spent
      sessionsCompleted: Math.floor(Math.random() * 8) + 2,
    });
  }
  
  return data;
};

export const dailyData = generateDailyData();

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

// Performance analytics
export const getPerformanceAnalytics = () => {
  const recent7Days = dailyData.slice(-7);
  const previous7Days = dailyData.slice(-14, -7);
  
  const modules = ['speaking', 'pronunciation', 'vocabulary', 'grammar', 'story', 'reflex'];
  
  const analytics = modules.map(module => {
    const recentAvg = recent7Days.reduce((sum, day) => sum + day[module], 0) / 7;
    const previousAvg = previous7Days.reduce((sum, day) => sum + day[module], 0) / 7;
    const improvement = recentAvg - previousAvg;
    const trend = improvement > 2 ? 'improving' : improvement < -2 ? 'declining' : 'stable';
    
    return {
      module: module.charAt(0).toUpperCase() + module.slice(1),
      current: Math.round(recentAvg),
      previous: Math.round(previousAvg),
      improvement: Math.round(improvement * 10) / 10,
      trend,
      color: moduleCompletionData.find(m => m.name.toLowerCase() === module)?.color || '#gray'
    };
  });
  
  return analytics;
};

// Intelligent feedback system
export const generateIntelligentFeedback = () => {
  const analytics = getPerformanceAnalytics();
  const recentData = dailyData.slice(-7);
  const totalStudyTime = recentData.reduce((sum, day) => sum + day.totalTime, 0);
  const avgDailyTime = totalStudyTime / 7;
  
  const strongestModule = analytics.reduce((max, module) => 
    module.current > max.current ? module : max
  );
  
  const weakestModule = analytics.reduce((min, module) => 
    module.current < min.current ? module : min
  );
  
  const improvingModules = analytics.filter(m => m.trend === 'improving');
  const decliningModules = analytics.filter(m => m.trend === 'declining');
  
  const feedback = {
    overall: {
      grade: calculateOverallGrade(analytics),
      message: generateOverallMessage(analytics, avgDailyTime),
      studyTime: Math.round(avgDailyTime),
      consistency: calculateConsistency(recentData)
    },
    strengths: [
      `Excellent progress in ${strongestModule.module} (${strongestModule.current}%)`,
      ...(improvingModules.length > 0 ? [`Improving trend in ${improvingModules.map(m => m.module).join(', ')}`] : [])
    ],
    improvements: [
      `Focus more on ${weakestModule.module} (${weakestModule.current}%)`,
      ...(decliningModules.length > 0 ? [`Address declining performance in ${decliningModules.map(m => m.module).join(', ')}`] : []),
      ...(avgDailyTime < 30 ? ['Increase daily study time for better results'] : [])
    ],
    recommendations: generateRecommendations(analytics, avgDailyTime)
  };
  
  return feedback;
};

const calculateOverallGrade = (analytics) => {
  const average = analytics.reduce((sum, m) => sum + m.current, 0) / analytics.length;
  if (average >= 85) return 'A';
  if (average >= 75) return 'B+';
  if (average >= 65) return 'B';
  if (average >= 55) return 'C+';
  if (average >= 45) return 'C';
  return 'D';
};

const generateOverallMessage = (analytics, avgDailyTime) => {
  const average = analytics.reduce((sum, m) => sum + m.current, 0) / analytics.length;
  
  if (average >= 80) {
    return "Outstanding performance! You're excelling across all modules.";
  } else if (average >= 70) {
    return "Great job! You're showing strong progress in your English learning journey.";
  } else if (average >= 60) {
    return "Good progress! Keep up the consistent practice to see even better results.";
  } else {
    return "You're on the right track! Focus on consistent practice to improve your skills.";
  }
};

const calculateConsistency = (recentData) => {
  const dailyTotals = recentData.map(day => 
    (day.speaking + day.pronunciation + day.vocabulary + day.grammar + day.story + day.reflex) / 6
  );
  
  const average = dailyTotals.reduce((sum, total) => sum + total, 0) / dailyTotals.length;
  const variance = dailyTotals.reduce((sum, total) => sum + Math.pow(total - average, 2), 0) / dailyTotals.length;
  const consistency = Math.max(0, 100 - Math.sqrt(variance));
  
  return Math.round(consistency);
};

const generateRecommendations = (analytics, avgDailyTime) => {
  const recommendations = [];
  
  // Time-based recommendations
  if (avgDailyTime < 20) {
    recommendations.push("Aim for at least 20-30 minutes of daily practice");
  } else if (avgDailyTime > 90) {
    recommendations.push("Great dedication! Consider shorter, more focused sessions");
  }
  
  // Module-specific recommendations
  const weakModules = analytics.filter(m => m.current < 60);
  if (weakModules.length > 0) {
    recommendations.push(`Prioritize practice in: ${weakModules.map(m => m.module).join(', ')}`);
  }
  
  // Trend-based recommendations
  const decliningModules = analytics.filter(m => m.trend === 'declining');
  if (decliningModules.length > 0) {
    recommendations.push("Review fundamentals in modules showing decline");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Maintain your excellent practice routine!");
  }
  
  return recommendations;
};
