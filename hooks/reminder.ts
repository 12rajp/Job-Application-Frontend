"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Reminder, Application } from "@/types/type";
import { API_URL } from '@/lib/constants';

export const useReminder = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5; 

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      toast.error("Please login first");
      router.push("/");
      return;
    }
    
    fetchReminders();
    fetchApplications();
  }, [currentPage]); 

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        fetchReminders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [loading, currentPage]);

  const fetchReminders = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${API_URL}/reminders?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }

      const data = await response.json();
      setReminders(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Fetch reminders error:", error);
      toast.error("Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(`${API_URL}/job-applications/my`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
        return;
      }
      
      if (!response.ok) {
        console.error("Applications fetch failed:", response.status);
        return;
      }
      
      const data = await response.json();
      setApplications(data.data || []);
    } catch (error) {
      console.error("Applications fetch error:", error);
    }
  };

  const handleAddReminder = async (reminderData: any) => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/");
        return;
      }

      const response = await fetch(`${API_URL}/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(reminderData),
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
        return;
      }

      if (response.ok) {
        toast.success("Reminder added successfully!");
        setCurrentPage(1);
        fetchReminders();
        setIsAddModalOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add reminder");
      }
    } catch (error) {
      console.error("Add reminder error:", error);
      toast.error("Error adding reminder");
    }
  };

  const handleEditReminder = async (reminderId: number, reminderData: any) => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/");
        return;
      }

      const response = await fetch(`${API_URL}/reminders/${reminderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(reminderData),
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
        return;
      }

      if (response.ok) {
        toast.success("Reminder updated successfully!");
        fetchReminders();
        setIsEditModalOpen(false);
        setSelectedReminder(null);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update reminder");
      }
    } catch (error) {
      console.error("Update reminder error:", error);
      toast.error("Error updating reminder");
    }
  };

  const handleDeleteReminder = async (reminderId: number) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;

    try {
      const token = getToken();
      
      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/");
        return;
      }

      const response = await fetch(`${API_URL}/reminders/${reminderId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
        return;
      }

      if (response.ok) {
        toast.success("Reminder deleted successfully!");
        
        if (reminders.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchReminders();
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete reminder");
      }
    } catch (error) {
      console.error("Delete reminder error:", error);
      toast.error("Error deleting reminder");
    }
  };

  const openEditModal = (reminder: Reminder) => {
    if (reminder.is_sent) {
      toast.warning("Reminder Already Sent", {
        description: "Editing will reschedule this reminder.",
        duration: 4000,
      });
    }
    
    setSelectedReminder(reminder);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    reminders,
    applications,
    loading,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedReminder,
    setSelectedReminder,
    handleAddReminder,
    handleEditReminder,
    handleDeleteReminder,
    openEditModal,
    currentPage,
    totalPages,
    total,
    handlePageChange,
  };
};
