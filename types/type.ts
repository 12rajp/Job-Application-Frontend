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

export interface ApplicationForm {
  company_id: string;
  status_id: string;
  position_title: string;
  job_description: string;
  job_link: string;
  location: string;
  job_type: string;
  date_applied: string;
  application_deadline: string;
  salary_offered: string;
}

export interface Document {
  doc_id: number;
  doc_name: string;
  doc_type: string;
  createdAt: string;
  size: number;
  file_path?: string;
}

export interface UploadForm {
  doc_name: string;
  doc_type: string;
  app_id: string;
}

export interface User {
  user_id: number;
  user_name: string;
  email: string;
  full_name?: string;
  phone?: string;
  profile_photo?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  createdAt: string;
}

export interface ProfileForm {
  user_name: string;
  email: string;
  full_name: string;
  phone: string;
  profile_photo: string;
  city: string;
  country: string;
  date_of_birth: string;
  gender: string;
}

export interface PasswordForm {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface Reminder {
  rem_id: number;
  reminder_at: string;
  method: "EMAIL" | "INAPP" | "BOTH";
  message: string;
  is_sent: boolean;
  application: {
    position_title: string;
    company: {
      company_name: string;
    };
  };
}

export type AnalyticsData = {
  status_id: number;
  status_name: string;
  total: number;
};

export type AnalyticsComponentProps = {
  showCharts?: boolean;
};

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface SignupData {
  user_name: string;
  email: string;
  password: string;
}

export interface SecurityTabProps {
  passwordForm: {
    oldPassword: string;
    password: string;
    confirmPassword: string;
  };
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordUpdate: () => void;
   handleDeleteAccount: () => void;
}
