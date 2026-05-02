import { saveDB } from '@/lib/db/client';
import type { JobApplication, Platform, ApplicationStatus } from '@/types/job-application';
import { PLATFORMS, APPLICATION_STATUSES } from '@/types/job-application';
import { cleanOptionalField, customPlatformFor, generateId } from '@/lib/utils';

export async function importFromJSON(jsonData: string): Promise<void> {
  try {
    const parsedData = JSON.parse(jsonData);
    
    if (!Array.isArray(parsedData)) {
      throw new Error('Invalid JSON format: expected an array');
    }

    if (parsedData.length === 0) {
      throw new Error('Import file is empty. No data was imported.');
    }

    // Validate and format the imported data
    const applications: JobApplication[] = parsedData.map((app: Record<string, unknown>) => {
      if (!app.companyName || !app.jobUrl || !app.dateApplied || !app.status) {
        throw new Error('Missing required fields in import data');
      }

      if (!APPLICATION_STATUSES.includes(app.status as ApplicationStatus)) {
        throw new Error(`Invalid status: ${app.status}`);
      }

      if (app.platform && !PLATFORMS.includes(app.platform as Platform)) {
        throw new Error(`Invalid platform: ${app.platform}`);
      }

      const platform = (app.platform || undefined) as Platform | undefined;

      return {
        id: (typeof app.id === 'number' ? app.id : generateId()),
        companyName: app.companyName as string,
        position: cleanOptionalField(app.position as string),
        platform,
        customPlatform: customPlatformFor(platform, app.customPlatform as string),
        jobUrl: app.jobUrl as string,
        dateApplied: app.dateApplied as string,
        status: app.status as ApplicationStatus,
        created_at: (app.created_at as string) || new Date().toISOString(),
        updated_at: (app.updated_at as string) || new Date().toISOString()
      };
    });

    // Validate all applications
    const isValid = applications.every(app => 
      typeof app.id === 'number' &&
      typeof app.companyName === 'string' &&
      (!app.position || typeof app.position === 'string') &&
      (!app.platform || PLATFORMS.includes(app.platform as Platform)) &&
      (!app.customPlatform || typeof app.customPlatform === 'string') &&
      typeof app.jobUrl === 'string' &&
      typeof app.dateApplied === 'string' &&
      APPLICATION_STATUSES.includes(app.status as ApplicationStatus)
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