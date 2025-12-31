"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddApplication } from "@/hooks/addApplications";
import { ApplicationForm } from "@/types/type";
import { useRouter } from "next/navigation";
import { Upload, FileText } from "lucide-react";

const focusStyle =
  "focus:outline-none focus:ring-2 focus:ring-[#1A2539] focus:border-[#1A2539] transition-all duration-200";

export default function AddApplicationPage() {
  const router = useRouter();
  const { companies, statuses, documents, addApplication } = useAddApplication();

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
  
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<"existing" | "new">("existing");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      setSelectedDocId(""); 
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDocId(e.target.value);
    setNewFile(null);
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

    console.log("Submitting application with:", {
      form,
      selectedDocId,
      newFile: newFile?.name,
    });

    const success = await addApplication(form, selectedDocId, newFile);
    if (success) {
      console.log("Application submitted successfully, redirecting...");
      setTimeout(() => {
        router.push("/dashboard/applications");
        window.location.href = "/dashboard/applications";
      }, 500);
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

        <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <Label className="mb-3 block text-base font-semibold">Attach Resume/Cover Letter</Label>
      
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setUploadMode("existing")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                uploadMode === "existing"
                  ? "bg-[#1A2539] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Select Existing Document
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("new")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                uploadMode === "new"
                  ? "bg-[#1A2539] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Upload New File
            </button>
          </div>

          {uploadMode === "existing" ? (
            <div>
              {documents.length > 0 ? (
                <select
                  value={selectedDocId}
                  onChange={handleDocumentSelect}
                  className={`w-full border rounded px-3 py-2 ${focusStyle}`}
                >
                  <option value="">Select a document</option>
                  {documents.map((doc) => (
                    <option key={doc.doc_id} value={doc.doc_id}>
                      {doc.doc_name} ({doc.doc_type})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No documents uploaded yet</p>
                  <p className="text-xs mt-1">Upload documents in the Documents section first</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="resume-input"
                accept=".pdf,.doc,.docx"
              />
              <label
                htmlFor="resume-input"
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Choose File
              </label>
              {newFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <span className="font-medium">{newFile.name}</span>
                </p>
              )}
            </div>
          )}
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
