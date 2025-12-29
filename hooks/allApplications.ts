"use client";

import { useState, useEffect } from "react";
import { Application, Company, Status } from "@/types/type";
import { API_URL } from '@/lib/constants';

export const allApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      return payload.userId || payload.id || payload.user_id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const id = getUserIdFromToken();
    setUserId(id);

    if (id) fetchApplications(id);
    fetchCompanies();
    fetchStatuses();
  }, []);

  const fetchApplications = async (uid: number) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/job-applications/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplications(data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Error loading applications. Please try again.");
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_URL}/companies`);
      const data = await res.json();
      setCompanies(data.data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await fetch(`${API_URL}/status`);
      const data = await res.json();
      setStatuses(data.data || []);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const deleteApplication = async (appId: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/job-applications/${appId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error deleting application");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting application");
    }
  };

  const updateApplication = async (appId: number, updateData: any) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/job-applications/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error updating application");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating application");
    }
  };

  return {
    applications,
    companies,
    statuses,
    userId,
    fetchApplications,
    deleteApplication,
    updateApplication,
  };
};
