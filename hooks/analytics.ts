import { useEffect, useState } from "react";
import axios from "axios";
import { AnalyticsData } from "@/types/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAnalytics = () => {
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

      const res = await axios.get(`${API_URL}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setData(res.data.data);
    } catch (error) {
      console.error("Analytics fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
};
