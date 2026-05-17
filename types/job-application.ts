export type ApplicationStatus = 'pending' | 'rejected' | 'accepted' | 'never_responded' | 'interview' | 'denied' | 'pass';

export type Platform = 'google_jobs' | 'linkedin' | 'indeed' | 'glassdoor' | 'other';

export const PLATFORMS: Platform[] = ['google_jobs', 'linkedin', 'indeed', 'glassdoor', 'other'];

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'pending', 'rejected', 'accepted', 'never_responded', 'interview', 'denied', 'pass',
];

export interface FilterState {
  status: ApplicationStatus | 'all';
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export interface JobApplication {
  id: number;
  companyName: string;
  position?: string;
  platform?: Platform;
  customPlatform?: string;
  jobUrl: string;
  dateApplied: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}
