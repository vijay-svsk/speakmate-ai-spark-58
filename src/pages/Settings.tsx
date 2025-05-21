
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default function Settings() {
  return (
    <AppLayout>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <SettingsForm />
        </div>
      </div>
    </AppLayout>
  );
}
