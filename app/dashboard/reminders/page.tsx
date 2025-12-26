"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Reminder = {
  rem_id: number;
  reminder_at: string;
  message: string;
  method: string;
  is_sent: boolean;
  application?: {
    position_title: string;
  };
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  const fetchReminders = async () => {
    const token = getToken();
    if (!token) return;

    const res = await axios.get("http://localhost:4000/reminders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setReminders(res.data.data);
    setLoading(false);
  };

  const deleteReminder = async (id: number) => {
    const token = getToken();
    if (!token) return;

    await axios.delete(`http://localhost:4000/reminders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchReminders();
  };

  if (loading) return <div className="p-8">Loading reminders...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reminders</h1>
        <Link
          href="/reminders/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Reminder
        </Link>
      </div>

      {reminders.length === 0 ? (
        <p>No reminders found.</p>
      ) : (
        <div className="space-y-4">
          {reminders.map((r) => (
            <div
              key={r.rem_id}
              className="bg-white shadow rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {r.application?.position_title}
                </p>
                <p>{r.message}</p>
                <p className="text-sm text-gray-500">
                  {new Date(r.reminder_at).toLocaleString()} • {r.method}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/reminders/${r.rem_id}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteReminder(r.rem_id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
