"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Application = {
  app_id: number;
  position_title: string;
  company: { company_name: string };
};

export default function AddReminderPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [form, setForm] = useState({
    app_id: "",
    reminder_at: "",
    message: "",
    method: "email",
  });

  // Helper to get token from cookies
  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  // Fetch user's applications for dropdown
  useEffect(() => {
    const fetchApplications = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await axios.get(
          "http://localhost:4000/job-applications/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch your applications");
      }
    };
    fetchApplications();
  }, []);

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      alert("You must be logged in");
      return;
    }
    if (!form.app_id || !form.reminder_at || !form.method) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/reminders",
        {
          app_id: Number(form.app_id), // Convert string to number
          reminder_at: new Date(form.reminder_at).toISOString(),
          message: form.message,
          method: form.method,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Reminder added successfully!");
      router.push("/reminders");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add reminder");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Reminder</h1>

      <select
        className="border p-2 w-full mb-3"
        value={form.app_id}
        onChange={(e) => setForm({ ...form, app_id: e.target.value })}
      >
        <option value="">Select Application</option>
        {applications.map((app) => (
          <option key={app.app_id} value={app.app_id}>
            {app.position_title} @ {app.company.company_name}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        className="border p-2 w-full mb-3"
        value={form.reminder_at}
        onChange={(e) => setForm({ ...form, reminder_at: e.target.value })}
      />

      <input
        placeholder="Message (optional)"
        className="border p-2 w-full mb-3"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

     <select
  className="border p-2 w-full mb-3"
  value={form.method}
  onChange={(e) => setForm({ ...form, method: e.target.value })}
>
  <option value="EMAIL">Email</option>
  <option value="SMS">SMS</option>
</select>


      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Save Reminder
      </button>
    </div>
  );
}
