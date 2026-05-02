import type { Platform, ApplicationStatus } from '@/types/job-application';
import { PLATFORMS, APPLICATION_STATUSES } from '@/types/job-application';
import { cleanOptionalField, customPlatformFor, generateId } from '@/lib/utils';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_RECORDS = 10_000;

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

function isValidDateString(str: string): boolean {
  const d = new Date(str);
  return d instanceof Date && !isNaN(d.getTime());
}

export function validateAndParseImport(jsonData: string): { applications: any[]; result: ImportResult } {
  if (jsonData.length > MAX_FILE_SIZE) {
    throw new Error(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }

  const parsedData = JSON.parse(jsonData);

  if (!Array.isArray(parsedData)) {
    throw new Error('Invalid JSON format: expected an array');
  }

  if (parsedData.length === 0) {
    throw new Error('Import file is empty. No data was imported.');
  }

  if (parsedData.length > MAX_RECORDS) {
    throw new Error(`Import file contains ${parsedData.length} records. Maximum is ${MAX_RECORDS}.`);
  }

  const applications: any[] = [];
  const errors: string[] = [];

  for (let i = 0; i < parsedData.length; i++) {
    const app = parsedData[i] as Record<string, unknown>;
    const rowNum = i + 1;

    if (!app.companyName || !app.jobUrl || !app.dateApplied || !app.status) {
      errors.push(`Row ${rowNum}: Missing required fields`);
      continue;
    }

    if (!APPLICATION_STATUSES.includes(app.status as ApplicationStatus)) {
      errors.push(`Row ${rowNum}: Invalid status "${app.status}"`);
      continue;
    }

    if (app.platform && !PLATFORMS.includes(app.platform as Platform)) {
      errors.push(`Row ${rowNum}: Invalid platform "${app.platform}"`);
      continue;
    }

    if (!isValidDateString(app.dateApplied as string)) {
      errors.push(`Row ${rowNum}: Invalid date "${app.dateApplied}"`);
      continue;
    }

    const platform = (app.platform || undefined) as Platform | undefined;

    applications.push({
      id: (typeof app.id === 'number' ? app.id : generateId()),
      companyName: app.companyName as string,
      position: cleanOptionalField(app.position as string),
      platform,
      customPlatform: customPlatformFor(platform, app.customPlatform as string),
      jobUrl: app.jobUrl as string,
      dateApplied: app.dateApplied as string,
      status: app.status as ApplicationStatus,
      created_at: (app.created_at as string) || new Date().toISOString(),
      updated_at: (app.updated_at as string) || new Date().toISOString(),
    });
  }

  if (applications.length === 0 && errors.length > 0) {
    throw new Error(`All ${parsedData.length} records failed validation. First error: ${errors[0]}`);
  }

  return { applications, result: { imported: applications.length, skipped: errors.length, errors } };
}

export async function importFromJSON(jsonData: string): Promise<ImportResult> {
  try {
    const parsed = validateAndParseImport(jsonData);

    const res = await fetch('/api/applications/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applications: parsed.applications }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Import failed');
    }

    return parsed.result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format. Please check the file is valid JSON.');
    }
    throw error;
  }
}
