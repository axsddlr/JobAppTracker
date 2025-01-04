import { DBSchema } from 'idb';
import { JobApplication } from '@/types/job-application';

export interface JobApplicationDB extends DBSchema {
  applications: {
    key: number;
    value: JobApplication;
    indexes: { 'by-date': string };
  };
}