// SpeakMate Dashboard v1

import React from "react";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getRandomMotivationalTip } from "@/lib/motivation";
import { BarChart, Mic, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// Placeholder chart for progress
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis, Legend } from "recharts";

const progressData = [
  { name: "Day 1", Grammar: 60, Vocabulary: 55, Pronunciation: 77, Fluency: 65 },
  { name: "Day 2", Grammar: 67, Vocabulary: 58, Pronunciation: 80, Fluency: 73 },
  { name: "Day 3", Grammar: 72, Vocabulary: 60, Pronunciation: 81, Fluency: 74 },
  { name: "Day 4", Grammar: 75, Vocabulary: 65, Pronunciation: 85, Fluency: 70 },
];
const radarData = [
  { subject: "Grammar", A: 75, fullMark: 100 },
  { subject: "Vocabulary", A: 65, fullMark: 100 },
  { subject: "Pronunciation", A: 85, fullMark: 100 },
  { subject: "Fluency", A: 70, fullMark: 100 },
];

const quickStarts = [
  {
    label: "Speaking Practice",
    icon: Mic,
    route: "/speaking",
    color: "bg-primary text-white",
  },
  {
    label: "Conversation AI",
    icon: MessageSquare,
    route: "/conversation",
    color: "bg-accent text-white",
  },
  {
    label: "Progress Report",
    icon: BarChart,
    route: "/progress",
    color: "bg-gradient-to-r from-primary to-accent text-white",
  },
];

function WelcomeCard() {
  return (
    <Card className="w-full shadow-xl rounded-2xl animate-fade-in mb-4 bg-white">
      <CardHeader>
        <h2 className="font-playfair text-2xl font-bold text-primary">Welcome back, Speaker!</h2>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base">{getRandomMotivationalTip()}</p>
      </CardContent>
    </Card>
  );
}

function QuickStartPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6">
      {quickStarts.map((item, i) => (
        <a
          key={item.label}
          href={item.route}
          className={`rounded-2xl flex flex-col items-center justify-center p-6 h-36 shadow-lg hover:scale-105 transition-all ${item.color}`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <item.icon className="w-9 h-9 mb-2" />
          <span className="font-semibold">{item.label}</span>
        </a>
      ))}
    </div>
  );
}

function ProgressSummary() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <Card className="flex-1 rounded-2xl shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary font-playfair text-lg">This Week</span>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={progressData}>
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="Grammar" stroke="#9b87f5" strokeWidth={2}/>
              <Line type="monotone" dataKey="Fluency" stroke="#33C3F0" strokeDasharray="5 5" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="flex-1 rounded-2xl shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary font-playfair text-lg">Skill Radar</span>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={140}>
            <RadarChart outerRadius={50} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="You" dataKey="A" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.4} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function TipOfTheDayCard() {
  return (
    <Card className="mt-6 w-full animate-fade-in rounded-2xl bg-badge/70 border-0">
      <CardHeader>
        <label className="font-semibold font-playfair text-primary">Gemini Tip of the Day</label>
      </CardHeader>
      <CardContent>
        <div className="italic text-gray-700">"Remember to stress the main verbs in each sentence for clearer communication!"</div>
      </CardContent>
    </Card>
  );
}

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-2 py-8 md:p-12">
          <WelcomeCard />
          <QuickStartPanel />
          <ProgressSummary />
          <TipOfTheDayCard />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
