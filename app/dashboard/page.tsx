"use client";

import AnalyticsComponent from "@/components/AnalyticsComponent";
import AllApplicationsPage from "@/app/dashboard/applications/page";

export default function DashboardPage() {
  return (
    <div className="ml-10 max-w-7xl mx-auto p-8 space-y-8 mt-10">
      <AnalyticsComponent showCharts={true} />
      <div className="bg-white rounded-xl shadow-lg p-8">
        <AllApplicationsPage />
      </div>
    </div>
  );
}
