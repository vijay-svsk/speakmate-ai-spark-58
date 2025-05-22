
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Label } from "recharts";

// Colors for the donut chart
const COLORS = ['#9b87f5', '#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de', '#a879e0', '#67c7a8'];

interface PosData {
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  adverbs: string[];
  prepositions: string[];
  pronouns: string[];
  conjunctions: string[];
}

interface PosChartData {
  name: string;
  value: number;
  count: number;
}

interface PartsOfSpeechAnalysisProps {
  posData: PosData;
  posChartData: PosChartData[];
}

const PartsOfSpeechAnalysis = ({ posData, posChartData }: PartsOfSpeechAnalysisProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Parts of Speech Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[250px] flex items-center justify-center">
            <ChartContainer 
              config={{
                nouns: { color: COLORS[0] },
                verbs: { color: COLORS[1] },
                adjectives: { color: COLORS[2] },
                adverbs: { color: COLORS[3] },
                prepositions: { color: COLORS[4] },
                pronouns: { color: COLORS[5] },
                conjunctions: { color: COLORS[6] },
              }}
            >
              <PieChart width={250} height={250}>
                <Pie
                  data={posChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {posChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox as any;
                      return (
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#333">
                          Parts of Speech
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          <div>
            <Tabs defaultValue="nouns">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="nouns">Nouns</TabsTrigger>
                <TabsTrigger value="verbs">Verbs</TabsTrigger>
                <TabsTrigger value="adjectives">Adjectives</TabsTrigger>
                <TabsTrigger value="others">Others</TabsTrigger>
              </TabsList>
              <TabsContent value="nouns" className="p-4 border rounded-md bg-gray-50">
                <h3 className="mb-2 text-sm font-medium">Nouns ({posData.nouns.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {posData.nouns.length > 0 ? posData.nouns.map((noun, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">{noun}</span>
                  )) : <span className="text-gray-500 text-sm">No nouns detected</span>}
                </div>
              </TabsContent>
              <TabsContent value="verbs" className="p-4 border rounded-md bg-gray-50">
                <h3 className="mb-2 text-sm font-medium">Verbs ({posData.verbs.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {posData.verbs.length > 0 ? posData.verbs.map((verb, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{verb}</span>
                  )) : <span className="text-gray-500 text-sm">No verbs detected</span>}
                </div>
              </TabsContent>
              <TabsContent value="adjectives" className="p-4 border rounded-md bg-gray-50">
                <h3 className="mb-2 text-sm font-medium">Adjectives ({posData.adjectives.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {posData.adjectives.length > 0 ? posData.adjectives.map((adj, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">{adj}</span>
                  )) : <span className="text-gray-500 text-sm">No adjectives detected</span>}
                </div>
              </TabsContent>
              <TabsContent value="others" className="p-4 border rounded-md bg-gray-50">
                <h3 className="mb-2 text-sm font-medium">Adverbs ({posData.adverbs.length})</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {posData.adverbs.length > 0 ? posData.adverbs.map((adv, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">{adv}</span>
                  )) : <span className="text-gray-500 text-sm">No adverbs detected</span>}
                </div>
                
                <h3 className="mb-2 text-sm font-medium">Prepositions ({posData.prepositions.length})</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {posData.prepositions.length > 0 ? posData.prepositions.map((prep, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{prep}</span>
                  )) : <span className="text-gray-500 text-sm">No prepositions detected</span>}
                </div>
                
                <h3 className="mb-2 text-sm font-medium">Pronouns ({posData.pronouns.length})</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {posData.pronouns.length > 0 ? posData.pronouns.map((pron, index) => (
                    <span key={index} className="bg-violet-100 text-violet-800 px-2 py-1 rounded text-sm">{pron}</span>
                  )) : <span className="text-gray-500 text-sm">No pronouns detected</span>}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartsOfSpeechAnalysis;
