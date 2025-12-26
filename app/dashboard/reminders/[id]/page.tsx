"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditReminderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    reminder_at: "",
    message: "",
    method: "",
  });

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  useEffect(() => {
    fetchReminder();
  }, []);

  const fetchReminder = async () => {
    const token = getToken();
    if (!token) return;

    const res = await axios.get(`http://localhost:4000/reminders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const r = res.data.reminder;
    setForm({
      reminder_at: r.reminder_at.slice(0, 16),
      message: r.message || "",
      method: r.method,
    });
  };

  const handleUpdate = async () => {
    const token = getToken();
    if (!token) return;

    await axios.put(
      `http://localhost:4000/reminders/${id}`,
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    router.push("/reminders");
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Edit Reminder</h1>

      <input
        type="datetime-local"
        className="border p-2 w-full mb-3"
        value={form.reminder_at}
        onChange={(e) => setForm({ ...form, reminder_at: e.target.value })}
      />

      <input
        placeholder="Message"
        className="border p-2 w-full mb-3"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-3"
        value={form.method}
        onChange={(e) => setForm({ ...form, method: e.target.value })}
      >
        <option value="email">Email</option>
        <option value="sms">SMS</option>
      </select>

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update Reminder
      </button>
    </div>
  );
}
