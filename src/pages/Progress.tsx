
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { BarChart, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from "recharts";
import { Award, Calendar, BarChart2 } from "lucide-react";

// Mock data - in a real app, this would come from a database
const overallProgress = {
  speaking: 65,
  pronunciation: 78,
  vocabulary: 62,
  grammar: 70,
  story: 55,
  reflex: 40,
};

const weeklyData = [
  { name: "Mon", Speaking: 45, Pronunciation: 60, Vocabulary: 35, Grammar: 40, Story: 30, Reflex: 25 },
  { name: "Tue", Speaking: 50, Pronunciation: 65, Vocabulary: 40, Grammar: 45, Story: 35, Reflex: 30 },
  { name: "Wed", Speaking: 55, Pronunciation: 70, Vocabulary: 45, Grammar: 50, Story: 40, Reflex: 32 },
  { name: "Thu", Speaking: 58, Pronunciation: 72, Vocabulary: 50, Grammar: 55, Story: 45, Reflex: 35 },
  { name: "Fri", Speaking: 62, Pronunciation: 75, Vocabulary: 55, Grammar: 60, Story: 48, Reflex: 37 },
  { name: "Sat", Speaking: 63, Pronunciation: 76, Vocabulary: 60, Grammar: 65, Story: 52, Reflex: 38 },
  { name: "Sun", Speaking: 65, Pronunciation: 78, Vocabulary: 62, Grammar: 70, Story: 55, Reflex: 40 },
];

const radarData = [
  { skill: "Speaking", value: 65, fullMark: 100 },
  { skill: "Pronunciation", value: 78, fullMark: 100 },
  { skill: "Vocabulary", value: 62, fullMark: 100 },
  { skill: "Grammar", value: 70, fullMark: 100 },
  { skill: "Story", value: 55, fullMark: 100 },
  { skill: "Reflex", value: 40, fullMark: 100 },
];

const moduleCompletionData = [
  { name: "Speaking", completion: 65, color: "#9b87f5" },
  { name: "Pronunciation", completion: 78, color: "#33C3F0" },
  { name: "Vocabulary", completion: 62, color: "#F06292" },
  { name: "Grammar", completion: 70, color: "#AED581" },
  { name: "Story", completion: 55, color: "#FFD54F" },
  { name: "Reflex", completion: 40, color: "#FF7043" },
];

const activityLog = [
  { date: "2025-05-20", module: "Vocabulary", activity: "Learned 5 new words", score: 85 },
  { date: "2025-05-20", module: "Grammar", activity: "Completed passive voice exercise", score: 78 },
  { date: "2025-05-19", module: "Speaking", activity: "Practiced introductions", score: 82 },
  { date: "2025-05-19", module: "Story", activity: "Created a short story", score: 90 },
  { date: "2025-05-18", module: "Pronunciation", activity: "Practiced vowel sounds", score: 75 },
  { date: "2025-05-17", module: "Reflex", activity: "Completed basic challenge", score: 65 },
  { date: "2025-05-17", module: "Grammar", activity: "Practiced using articles", score: 88 },
  { date: "2025-05-16", module: "Vocabulary", activity: "Reviewed 10 words", score: 92 },
];

const Progress = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col items-center px-2 py-8 md:p-12">
          <header className="w-full max-w-6xl mb-8">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">Progress Report</h1>
            <p className="text-gray-600">Track your English learning journey across all modules</p>
          </header>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full max-w-6xl"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Activity Log</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Achievements</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-medium">Skill Radar</h2>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart outerRadius={90} data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Skills" dataKey="value" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.5} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-medium">Weekly Progress</h2>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Speaking" stroke="#9b87f5" />
                        <Line type="monotone" dataKey="Pronunciation" stroke="#33C3F0" />
                        <Line type="monotone" dataKey="Vocabulary" stroke="#F06292" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-medium">Module Completion</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {moduleCompletionData.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-500">{item.completion}%</span>
                        </div>
                        <ProgressBar value={item.completion} className="h-2" style={{ backgroundColor: `${item.color}40` }}>
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ width: `${item.completion}%`, backgroundColor: item.color }}
                          />
                        </ProgressBar>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-medium">Module Performance</h2>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={moduleCompletionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completion" name="Completion">
                        {moduleCompletionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-medium">Recent Activity</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLog.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.module}</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{entry.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{entry.activity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.score}</span>
                          <span className="text-xs text-gray-500">/ 100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-medium">Your Achievements</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Wordsmith", description: "Learned 50+ vocabulary words", achieved: true },
                      { name: "Grammar Guru", description: "Completed 10 grammar exercises", achieved: true },
                      { name: "Fluent Speaker", description: "Practiced speaking for 5 hours", achieved: false },
                      { name: "Storyteller", description: "Created 3 complete stories", achieved: true },
                      { name: "Pronunciation Pro", description: "Mastered 20 difficult sounds", achieved: false },
                      { name: "Quick Thinker", description: "Completed advanced reflex challenge", achieved: false },
                    ].map((achievement, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${achievement.achieved ? 'bg-primary/10 border-primary/20' : 'bg-gray-100 border-gray-200'}`}
                      >
                        <div className="flex items-center gap-2">
                          <Award className={`w-5 h-5 ${achievement.achieved ? 'text-primary' : 'text-gray-400'}`} />
                          <h3 className={`font-medium ${achievement.achieved ? 'text-primary' : 'text-gray-500'}`}>
                            {achievement.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
                        <div className={`text-xs mt-3 ${achievement.achieved ? 'text-primary' : 'text-gray-500'}`}>
                          {achievement.achieved ? 'Achieved' : 'In Progress'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Progress;
