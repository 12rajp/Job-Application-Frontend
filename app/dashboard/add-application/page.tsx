"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddApplication } from "@/hooks/addApplications";
import { useRouter } from "next/navigation";
import { Upload, FileText } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

const focusStyle =
  "focus:outline-none focus:ring-2 focus:ring-[#1A2539] focus:border-[#1A2539] transition-all duration-200";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const validationSchema = Yup.object({
  company_id: Yup.string().required("Please select a company"),
  status_id: Yup.string().required("Please select a status"),
  position_title: Yup.string().required("Position title is required"),
  job_type: Yup.string().required("Please select job type"),
  date_applied: Yup.string().required("Please select date applied"),
  job_link: Yup.string().url("Please enter a valid URL (e.g., https://example.com)").nullable(),
  application_deadline: Yup.string().nullable(),
  salary_offered: Yup.string().nullable(),
  job_description: Yup.string().nullable(),
  location: Yup.string().nullable(),
});

export default function AddApplicationPage() {
  const router = useRouter();
  const { companies, statuses, documents, addApplication } = useAddApplication();

  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<"existing" | "new">("existing");

  const formik = useFormik({
    initialValues: {
      company_id: "",
      status_id: "",
      position_title: "",
      job_description: "",
      job_link: "",
      location: "",
      job_type: "",
      date_applied: getCurrentDate(), 
      application_deadline: "",
      salary_offered: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Submitting application with:", {
        values,
        selectedDocId,
        newFile: newFile?.name,
      });

      const success = await addApplication(values, selectedDocId, newFile);
      if (success) {
        console.log("Application submitted successfully, redirecting...");
        setTimeout(() => {
          router.push("/dashboard/applications");
          window.location.href = "/dashboard/applications";
        }, 500);
      }
    },
  });

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

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Add Job Application
      </h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Company</Label>
            <select
              name="company_id"
              value={formik.values.company_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded px-3 py-2 ${focusStyle}`}
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name}
                </option>
              ))}
            </select>
            {formik.touched.company_id && formik.errors.company_id && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.company_id}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Status</Label>
            <select
              name="status_id"
              value={formik.values.status_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded px-3 py-2 ${focusStyle}`}
            >
              <option value="">Select Status</option>
              {statuses.map((s) => (
                <option key={s.status_id} value={s.status_id}>
                  {s.status_name}
                </option>
              ))}
            </select>
            {formik.touched.status_id && formik.errors.status_id && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.status_id}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Job Type</Label>
            <select
              name="job_type"
              value={formik.values.job_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded px-3 py-2 ${focusStyle}`}
            >
              <option value="">Select Job Type</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
            {formik.touched.job_type && formik.errors.job_type && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.job_type}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Position Title</Label>
            <Input
              name="position_title"
              value={formik.values.position_title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={focusStyle}
            />
            {formik.touched.position_title && formik.errors.position_title && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.position_title}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label className="mb-2 block">Job Description</Label>
            <Textarea
              name="job_description"
              value={formik.values.job_description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={focusStyle}
            />
          </div>

          <div>
            <Label className="mb-2 block">Job Link</Label>
            <Input
              name="job_link"
              value={formik.values.job_link}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={focusStyle}
              placeholder="https://example.com/job"
            />
            {formik.touched.job_link && formik.errors.job_link && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.job_link}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Location</Label>
            <Input
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={focusStyle}
            />
          </div>

          <div>
            <Label className="mb-2 block">Date Applied</Label>
            <Input
              type="date"
              name="date_applied"
              value={formik.values.date_applied}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={focusStyle}
            />
            {formik.touched.date_applied && formik.errors.date_applied && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.date_applied}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Application Deadline</Label>
            <Input
              type="date"
              name="application_deadline"
              value={formik.values.application_deadline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={focusStyle}
            />
          </div>

          <div>
            <Label className="mb-2 block">Salary Offered</Label>
            <Input
              name="salary_offered"
              value={formik.values.salary_offered}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={focusStyle}
            />
          </div>

          <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <Label className="mb-3 block text-base font-semibold">
              Attach Resume/Cover Letter
            </Label>

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
                    <p className="text-xs mt-1">
                      Upload documents in the Documents section first
                    </p>
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
            type="submit"
            className="px-10 py-2 bg-[#1A2539] hover:bg-[#24324a] text-white rounded-lg cursor-pointer transition"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
