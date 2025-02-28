// types.ts
export interface Job {
  id: number;
  job_title: string;
  company_name: string;
  location: string | null;
  work_arrangement: string;
  job_type: string;
  salary_range: string;
  responsibilities: string[];
  requirements: string[];
  preferred_qualifications: string[];
  benefits: string[];
  application_link: string;
  company_description: string;
  posted_date: string | null;
  closing_date: string | null;
  tech_stack: string[];
  areas_of_focus: string[];
}
export interface ResponseJob {
  results: Job[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface JobsState {
  jobs: ResponseJob;
  loading: boolean;
  error: string | null;
}
export interface RegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Profile {
  id: number;
  user: User;
  country: string;
  city: string;
  phone_number: string;
  profile_image_uri: string;
  bio: string;
  prefered_tech_stacks: string[];
  resume_uri: string;
  preferred_job_types: string[];
  prefered_work_arrangement: string;
  summary_from_resume: string;
}

export interface ProfileState {
  refresh: string;
  access: string;
  user: User;
  profile: Profile;
}
export interface UserProfile {
  id?: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  phone_number?: string;
  title?: string;
  bio?: string;
  location?: string;
  country?: string;
  city?: string;
  profile_image_uri?: string;
  resume_uri?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
  prefered_tech_stacks?: string[];
  prefered_work_arrangement?: string;
  preferred_job_types?: string[];
  profile_does_not_exist?: boolean;
  summary_from_resume?: string;
  experiences?: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education?: {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
  skills?: string[];
}
