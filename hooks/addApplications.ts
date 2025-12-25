import { useState, useEffect } from "react";
import axios from "axios";
import { Company, Status, ApplicationForm } from "@/types/type";

export const useAddApplication = () => { 
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    fetchCompanies();
    fetchStatuses();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:4000/companies");
      setCompanies(res.data.data || res.data || []);
    } catch (err) {
      setCompanies([]);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get("http://localhost:4000/status");
      setStatuses(res.data.data || res.data || []);
    } catch (err) {
      setStatuses([]);
    }
  };

  const addApplication = async (form: ApplicationForm) => {
    if (!form.company_id || !form.status_id || !form.position_title || !form.date_applied || !form.job_type) {
      alert("Please fill all required fields!");
      return;
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      alert("User not authenticated. Please login first!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/job-applications",
        {
          ...form,
          company_id: Number(form.company_id),
          status_id: Number(form.status_id),
          salary_offered: form.salary_offered ? Number(form.salary_offered) : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Application Submitted");
      return true;
    } catch (error: any) {
      alert(error.response?.data?.message || "Error adding application");
      return false;
    }
  };

  return { companies, statuses, addApplication };
};
