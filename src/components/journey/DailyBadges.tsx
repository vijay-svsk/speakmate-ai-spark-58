
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Zap, Target } from "lucide-react";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  earned: boolean;
  date?: string;
}

export const DailyBadges: React.FC = () => {
  // Get badges from localStorage
  const getBadges = (): BadgeItem[] => {
    const badges = JSON.parse(localStorage.getItem('dailyBadges') || '[]');
    const defaultBadges: BadgeItem[] = [
      {
        id: 'vocabulary-explorer',
        name: 'Vocabulary Explorer',
        description: 'Completed Vocabulary Garden',
        emoji: '🌱',
        earned: false
      },
      {
        id: 'reflex-master',
        name: 'Reflex Master',
        description: 'Crossed the Reflex Bridge',
        emoji: '⚡',
        earned: false
      },
      {
        id: 'grammar-guru',
        name: 'Grammar Guru',
        description: 'Walked through Grammar Lane',
        emoji: '📚',
        earned: false
      },
      {
        id: 'pronunciation-pro',
        name: 'Pronunciation Pro',
        description: 'Mastered Pronunciation Pond',
        emoji: '🔊',
        earned: false
      },
      {
        id: 'story-teller',
        name: 'Story Teller',
        description: 'Climbed the Story Tree',
        emoji: '📖',
        earned: false
      },
      {
        id: 'fluent-resident',
        name: 'Fluent Resident',
        description: 'Unlocked the Fluent House',
        emoji: '🏡',
        earned: false
      }
    ];
    
    // Merge with saved progress
    return defaultBadges.map(badge => {
      const saved = badges.find((b: BadgeItem) => b.id === badge.id);
      return saved ? { ...badge, ...saved } : badge;
    });
  };

  const badges = getBadges();
  const earnedBadges = badges.filter(badge => badge.earned);
  const streakDays = parseInt(localStorage.getItem('streakDays') || '0');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Daily Badges & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Info */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span className="font-medium">Daily Streak</span>
          </div>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            {streakDays} days 🔥
          </Badge>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                badge.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-center space-y-2">
                <div className={`text-2xl ${badge.earned ? 'animate-bounce' : 'grayscale'}`}>
                  {badge.emoji}
                </div>
                <div>
                  <h4 className={`font-semibold text-xs ${badge.earned ? 'text-yellow-800' : 'text-gray-500'}`}>
                    {badge.name}
                  </h4>
                  <p className={`text-xs ${badge.earned ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {badge.description}
                  </p>
                </div>
                {badge.earned && (
                  <div className="flex items-center justify-center">
                    <Star className="h-3 w-3 text-yellow-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Progress Today</span>
          </div>
          <span className="text-sm font-bold text-primary">
            {earnedBadges.length}/{badges.length} zones completed
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
