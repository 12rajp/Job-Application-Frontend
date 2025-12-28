"use client";

import AnalyticsComponent from "@/components/AnalyticsComponent";
import AllApplicationsPage from "@/app/dashboard/applications/page";

export default function DashboardPage() {
  return (
    <div className="w-full max-w-12xl xl:max-w-400 mx-auto px-4 sm:px-8 space-y-3">
      <AnalyticsComponent showCharts={true} />
      <div className="bg-white rounded-xl shadow-lg p-3">
        <AllApplicationsPage />
      </div>
    </div>
  );
}
