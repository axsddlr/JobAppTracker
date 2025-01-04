export type ApplicationStatus = 'pending' | 'rejected' | 'accepted';

export interface JobApplication {
  id: number;
  companyName: string;
  jobUrl: string;
  dateApplied: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}