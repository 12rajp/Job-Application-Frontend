import { useState, useEffect } from "react";
import axios from "axios";
import { Company, Status, ApplicationForm } from "@/types/type";
import { API_URL } from '@/lib/constants';

export const useAddApplication = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    fetchCompanies();
    fetchStatuses();
  }, []);

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
  const addApplication = async (form: ApplicationForm) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return false; 
    }

    try {
      await axios.post(
        `${API_URL}/job-applications`,
        {
          ...form,
          company_id: Number(form.company_id),
          status_id: Number(form.status_id),
          salary_offered: form.salary_offered ? Number(form.salary_offered) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return true; 
    } catch (error: any) {
      console.error("Error adding application", error);
      return false; 
    }
  };

  return {companies,statuses,addApplication,};
};
