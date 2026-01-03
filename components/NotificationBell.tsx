"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  noti_id: number;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const fetchUnreadCount = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (noti_id: number) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${API_URL}/notifications/${noti_id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.noti_id === noti_id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${API_URL}/notifications/mark-all-read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (noti_id: number) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${API_URL}/notifications/${noti_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const wasUnread = notifications.find(
          (n) => n.noti_id === noti_id && !n.is_read
        );
        
        setNotifications((prev) => prev.filter((n) => n.noti_id !== noti_id));
        
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const formatTime = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-gray-700 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 max-h-128 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-lg">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="font-medium">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    You'll see reminders here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.noti_id}
                      className={`p-4 transition-all ${
                        !notification.is_read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : "bg-white opacity-70 hover:opacity-100"
                      } hover:bg-gray-50`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`text-sm font-medium ${
                                !notification.is_read
                                  ? "text-gray-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1 shrink-0">
                              {!notification.is_read && (
                                <button
                                  onClick={() =>
                                    markAsRead(notification.noti_id)
                                  }
                                  className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-100 transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  deleteNotification(notification.noti_id)
                                }
                                className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p
                            className={`text-sm ${
                              !notification.is_read
                                ? "text-gray-700"
                                : "text-gray-500"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
