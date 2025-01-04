export const DB_CONFIG = {
  name: 'job-applications-db',
  version: 3, // Match the existing database version
  stores: {
    applications: 'applications'
  }
} as const;