export type ApplicationStatus = 'pending' | 'rejected' | 'accepted' | 'never_responded' | 'interview';

export type Platform = 'google_jobs' | 'linkedin' | 'indeed' | 'glassdoor' | 'other';

export interface JobApplication {
  id: number;
  companyName: string;
  position?: string;
  platform?: Platform;
  customPlatform?: string; // For when platform is 'other'
  jobUrl: string;
  dateApplied: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}