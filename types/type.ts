export interface Application {
  app_id: number;
  position_title: string;
  company_id: number;
  status_id: number;
  date_applied: string;
  job_description?: string;
  job_link?: string;
  location?: string;
  job_type?: string;
  application_deadline?: string;
  salary_offered?: number;
  user_id?: number;
}

export interface Company {
  company_id: number;
  company_name: string;
}

export interface Status {
  status_id: number;
  status_name: string;
}
