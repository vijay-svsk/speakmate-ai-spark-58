
import React from "react";
import { SkillRadarChart } from "./SkillRadarChart";
import { WeeklyProgressChart } from "./WeeklyProgressChart";
import { ModuleCompletionSection } from "./ModuleCompletionSection";
import { ModulePerformanceChart } from "./ModulePerformanceChart";

export const OverviewTabContent = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillRadarChart />
        <WeeklyProgressChart />
      </div>
      <ModuleCompletionSection />
      <ModulePerformanceChart />
    </div>
  );
};
