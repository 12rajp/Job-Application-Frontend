"use client";

import AnalyticsComponent from "@/components/AnalyticsComponent";
import AllApplicationsPage from "@/app/dashboard/applications/page";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <AnalyticsComponent showCharts={true} />
      <div className="bg-white rounded-xl shadow-lg p-8">
        <AllApplicationsPage />
      </div>
    </div>
  );
}
