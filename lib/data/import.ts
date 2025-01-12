import { getDB, saveDB } from '@/lib/db/client';
import type { JobApplication, Platform } from '@/types/job-application';

export async function importFromJSON(jsonData: string): Promise<void> {
  try {
    const parsedData = JSON.parse(jsonData);
    
    if (!Array.isArray(parsedData)) {
      throw new Error('Invalid JSON format: expected an array');
    }

    // Validate and format the imported data
    const applications: JobApplication[] = parsedData.map((app: any) => {
      // Ensure all required fields are present
      if (!app.companyName || !app.jobUrl || !app.dateApplied || !app.status) {
        throw new Error('Missing required fields in import data');
      }

      // Validate status
      const validStatuses = ['pending', 'rejected', 'accepted', 'never_responded', 'interview'];
      if (!validStatuses.includes(app.status)) {
        throw new Error(`Invalid status: ${app.status}`);
      }

      // Validate platform if present
      const validPlatforms: Platform[] = ['google_jobs', 'linkedin', 'indeed', 'glassdoor', 'other'];
      if (app.platform && !validPlatforms.includes(app.platform)) {
        throw new Error(`Invalid platform: ${app.platform}`);
      }

      // Preserve the original ID and timestamps if they exist
      return {
        id: app.id || Date.now(),
        companyName: app.companyName,
        position: app.position || undefined,
        platform: app.platform || undefined,
        customPlatform: app.platform === 'other' ? app.customPlatform : undefined,
        jobUrl: app.jobUrl,
        dateApplied: app.dateApplied,
        status: app.status,
        created_at: app.created_at || new Date().toISOString(),
        updated_at: app.updated_at || new Date().toISOString()
      };
    });

    // Validate all applications
    const isValid = applications.every(app => 
      typeof app.id === 'number' &&
      typeof app.companyName === 'string' &&
      (!app.position || typeof app.position === 'string') &&
      (!app.platform || ['google_jobs', 'linkedin', 'indeed', 'glassdoor', 'other'].includes(app.platform)) &&
      (!app.customPlatform || typeof app.customPlatform === 'string') &&
      typeof app.jobUrl === 'string' &&
      typeof app.dateApplied === 'string' &&
      ['pending', 'rejected', 'accepted', 'never_responded', 'interview'].includes(app.status)
    );

    if (!isValid) {
      throw new Error('Invalid data format in import file');
    }

    // Save the imported applications
    await saveDB(applications);
  } catch (error) {
    console.error('Error importing from JSON:', error);
    throw error;
  }
}