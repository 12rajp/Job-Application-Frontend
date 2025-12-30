"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddApplication } from "@/hooks/addApplications";
import { ApplicationForm } from "@/types/type";
import { useRouter } from "next/navigation";

const focusStyle =
  "focus:outline-none focus:ring-2 focus:ring-[#1A2539] focus:border-[#1A2539] transition-all duration-200";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.company_id) newErrors.company_id = "Please select a company";
    if (!form.status_id) newErrors.status_id = "Please select a status";
    if (!form.position_title)
      newErrors.position_title = "Position title is required";
    if (!form.date_applied)
      newErrors.date_applied = "Please select date applied";
    if (!form.job_type) newErrors.job_type = "Please select job type";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await addApplication(form);
    if (success) {
      router.push("/dashboard/applications");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Add Job Application
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2 block">Company</Label>
          <select
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${focusStyle}`}
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.company_id} value={c.company_id}>
                {c.company_name}
              </option>
            ))}
          </select>
          <div>
            <div>
              {errors.company_id && (
                <p className="text-red-600 text-sm mt-1">{errors.company_id}</p>
              )}
            </div>
            {errors.company_id && (
              <p className="text-red-600 text-sm mt-1">{errors.company_id}</p>
            )}
          </div>
          {errors.company_id && (
            <p className="text-red-600 text-sm mt-1">{errors.company_id}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block">Status</Label>
          <select
            name="status_id"
            value={form.status_id}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${focusStyle}`}
          >
            <option value="">Select Status</option>
            {statuses.map((s) => (
              <option key={s.status_id} value={s.status_id}>
                {s.status_name}
              </option>
            ))}
          </select>
          {errors.status_id && (
            <p className="text-red-600 text-sm mt-1">{errors.status_id}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block">Job Type</Label>
          <select
            name="job_type"
            value={form.job_type}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${focusStyle}`}
          >
            <option value="">Select Job Type</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
          {errors.job_type && (
            <p className="text-red-600 text-sm mt-1">{errors.job_type}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block">Position Title</Label>
          <Input
            name="position_title"
            value={form.position_title}
            onChange={handleChange}
            className={focusStyle}
          />
          {errors.position_title && (
            <p className="text-red-600 text-sm mt-1">{errors.position_title}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <Label className="mb-2 block">Job Description</Label>
          <Textarea
            name="job_description"
            value={form.job_description}
            onChange={handleChange}
            className={focusStyle}
          />
        </div>
        <div>
          <Label className="mb-2 block">Job Link</Label>
          <Input
            name="job_link"
            value={form.job_link}
            onChange={handleChange}
            className={focusStyle}
          />
        </div>
        <div>
          <Label className="mb-2 block">Location</Label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            className={focusStyle}
          />
        </div>
        <div>
          <Label className="mb-2 block">Date Applied</Label>
          <Input
            type="date"
            name="date_applied"
            value={form.date_applied}
            onChange={handleChange}
            className={focusStyle}
          />
          {errors.date_applied && (
            <p className="text-red-600 text-sm mt-1">{errors.date_applied}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block">Application Deadline</Label>
          <Input
            type="date"
            name="application_deadline"
            value={form.application_deadline}
            onChange={handleChange}
            className={focusStyle}
          />
        </div>
        <div>
          <Label className="mb-2 block">Salary Offered</Label>
          <Input
            name="salary_offered"
            value={form.salary_offered}
            onChange={handleChange}
            className={focusStyle}
          />
        </div>
      </div>
      <div className="flex justify-end mt-10">
        <Button
          onClick={handleSubmit}
          className="px-10 py-2 bg-[#1A2539] hover:bg-[#24324a] text-white rounded-lg cursor-pointer transition"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
