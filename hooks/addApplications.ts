import { useState, useEffect } from "react";
import axios from "axios";
import { Company, Status, ApplicationForm, Document } from "@/types/type";
import { API_URL } from '@/lib/constants';

export const useAddApplication = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetchCompanies();
    fetchStatuses();
    fetchDocuments();
  }, []);

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API_URL}/companies`);
      setCompanies(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Error fetching companies", error);
      setCompanies([]);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`${API_URL}/status`);
      setStatuses(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Error fetching statuses", error);
      setStatuses([]);
    }
  };

  const fetchDocuments = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/document`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching documents", error);
      setDocuments([]);
    }
  };
  
  const addApplication = async (
    form: ApplicationForm,
    selectedDocId?: string,
    newFile?: File | null
  ) => {
    const token = getToken();

    if (!token) {
      alert("Please login first!");
      return false;
    }

    try {
      const formData = new FormData();
      
      formData.append("company_name", form.company_name);
      if (form.company_id !== null && form.company_id !== undefined && form.company_id !== "") {
        formData.append("company_id", String(form.company_id));
        console.log("Sending existing company_id:", form.company_id);
      } else {
        console.log("Creating new company:", form.company_name);
      }
      
      formData.append("status_id", String(form.status_id));
      formData.append("position_title", form.position_title);
      formData.append("job_type", form.job_type);
      formData.append("date_applied", form.date_applied);
      
      if (form.job_description) formData.append("job_description", form.job_description);
      if (form.job_link) formData.append("job_link", form.job_link);
      if (form.location) formData.append("location", form.location);
      if (form.application_deadline) formData.append("application_deadline", form.application_deadline);
      if (form.salary_offered) formData.append("salary_offered", String(form.salary_offered));

      if (selectedDocId) {
        formData.append("doc_id", selectedDocId);
      } else if (newFile) {
        formData.append("file", newFile);
      }

      console.log("Sending form data:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post(
        `${API_URL}/job-applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      console.log("Application created:", response.data);
      alert("Application submitted successfully!");
      return true;
    } catch (error: any) {
      console.error("Error adding application", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to submit application";
      alert(errorMessage);
      return false;
    }
  };

  return {
    companies,
    statuses,
    documents,
    addApplication,
  };
};
