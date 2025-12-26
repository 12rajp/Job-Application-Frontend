"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, BarChart3 } from "lucide-react";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend,} from "recharts";

type AnalyticsData = {
  status_id: number;
  status_name: string;
  total: number;
};

type AnalyticsComponentProps = {
  showCharts?: boolean;
};

export default function AnalyticsComponent({
  showCharts = false,
}: AnalyticsComponentProps) {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      const res = await axios.get("http://localhost:4000/analytics", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setData(res.data.data);
    } catch (error) {
      console.error("Analytics fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const getAnalyticsColor = (statusName: string) => {
    const colors: Record<string, string> = {
      Applied: "bg-gray-500",
      Interview: "bg-orange-500",
      Offer: "bg-green-500",
      Rejected: "bg-red-500",
      Hired: "bg-pink-500",
    };
    return colors[statusName] || "";
  };

  const CHART_COLORS: Record<string, string> = {
    Applied: "#6b7280",   
    Interview: "#f97316", 
    Offer: "#22c55e",     
    Rejected: "#ef4444",  
    Hired: "#ec4899",    
  };

  const chartData = data
    .filter((item) => CHART_COLORS[item.status_name])
    .map((item) => ({
      name: item.status_name,
      value: item.total,
      fill: CHART_COLORS[item.status_name],
    }));

  const totalApplications = data.reduce((sum, item) => sum + item.total, 0);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading analytics...</div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Applications Analytics
          </h2>
        </div>

        {data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No analytics data found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {data.map((item) => (
                <div
                  key={item.status_id}
                  className="bg-linear-to-br from-gray-50 to-white border-2 border-gray-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 ${getAnalyticsColor(
                      item.status_name
                    )} rounded-full mx-auto mb-3 flex items-center justify-center`}
                  >
                    <span className="text-white text-xl font-bold">
                      {item.total}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {item.status_name}
                  </h3>
                </div>
              ))}
            </div>

            {totalApplications > 0 && (
              <div className="mt-6 text-center">
                <p className="text-lg text-gray-700">
                  Total Applications:{" "}
                  <span className="font-bold text-blue-600 text-2xl">
                    {totalApplications}
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {showCharts && chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Visual Analytics
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Applications by Status
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#4b5563", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    label={{
                      position: "top",
                      fill: "#4b5563",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
