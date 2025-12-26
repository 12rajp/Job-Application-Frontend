"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useAddApplication } from "@/hooks/addApplications";
import { ApplicationForm } from "@/types/type";

export default function AddApplicationPage() {
  const router = useRouter();
  const { companies, statuses, addApplication } = useAddApplication();

  const [form, setForm] = useState<ApplicationForm>({
    company_id: "",
    status_id: "",
    position_title: "",
    job_description: "",
    job_link: "",
    location: "",
    job_type: "",
    date_applied: "",
    application_deadline: "",
    salary_offered: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const success = await addApplication(form);
    if (success) {
      setForm({
        company_id: "",
        status_id: "",
        position_title: "",
        job_description: "",
        job_link: "",
        location: "",
        job_type: "",
        date_applied: "",
        application_deadline: "",
        salary_offered: "",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add Job Application</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Company</Label>
          <select name="company_id" value={form.company_id} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1">
            <option value="">Select Company</option>
            {companies.map(c => <option key={c.company_id} value={c.company_id}>{c.company_name}</option>)}
          </select>
        </div>

        <div>
          <Label>Status</Label>
          <select name="status_id" value={form.status_id} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1">
            <option value="">Select Status</option>
            {statuses.map(s => <option key={s.status_id} value={s.status_id}>{s.status_name}</option>)}
          </select>
        </div>

        <div>
          <Label>Job Type</Label>
          <select name="job_type" value={form.job_type} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1">
            <option value="">Select Job Type</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <Label>Position Title</Label>
          <Input name="position_title" value={form.position_title} onChange={handleChange} />
        </div>

        <div className="md:col-span-2">
          <Label>Job Description</Label>
          <Textarea name="job_description" value={form.job_description} onChange={handleChange} />
        </div>

        <div>
          <Label>Job Link</Label>
          <Input name="job_link" value={form.job_link} onChange={handleChange} />
        </div>

        <div>
          <Label>Location</Label>
          <Input name="location" value={form.location} onChange={handleChange} />
        </div>

        <div>
          <Label>Date Applied</Label>
          <Input type="date" name="date_applied" value={form.date_applied} onChange={handleChange} />
        </div>

        <div>
          <Label>Application Deadline</Label>
          <Input type="date" name="application_deadline" value={form.application_deadline} onChange={handleChange} />
        </div>

        <div>
          <Label>Salary Offered</Label>
          <Input name="salary_offered" value={form.salary_offered} onChange={handleChange} />
        </div>
      </div>

      <Button className="w-full mt-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2" onClick={handleSubmit}>
        <Check className="w-5 h-5" /> Submit Application
      </Button>
    </div>
  );
}
