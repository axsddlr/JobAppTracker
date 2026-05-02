import { getDB, saveDB, putAppDB, deleteAppDB, getAppDB } from './db/client';
import type { JobApplication } from '@/types/job-application';

export async function fetchApplications(): Promise<JobApplication[]> {
  try {
    const applications = await getDB();
    return applications.sort((a, b) => 
      new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
    );
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw new Error('Failed to fetch applications');
  }
}

export async function createApplication(
  application: Partial<JobApplication>
): Promise<JobApplication> {
  try {
    const now = new Date().toISOString();
    
    const newApplication: JobApplication = {
      id: Date.now(),
      companyName: application.companyName!,
      position: application.position,
      platform: application.platform,
      customPlatform: application.platform === 'other' ? application.customPlatform : undefined,
      jobUrl: application.jobUrl!,
      dateApplied: application.dateApplied!,
      status: application.status!,
      created_at: now,
      updated_at: now,
    };
    
    await putAppDB(newApplication);
    return newApplication;
  } catch (error) {
    console.error('Error creating application:', error);
    throw new Error('Failed to create application');
  }
}

export async function updateApplication(
  id: number,
  updates: Partial<JobApplication>
): Promise<JobApplication> {
  try {
    const existing = await getAppDB(id);
    if (!existing) throw new Error('Application not found');

    const updatedApplication: JobApplication = {
      ...existing,
      ...updates,
      id,
      position: updates.position || undefined,
      customPlatform: updates.platform === 'other' ? updates.customPlatform : undefined,
      updated_at: new Date().toISOString(),
    };

    await putAppDB(updatedApplication);
    return updatedApplication;
  } catch (error) {
    console.error('Error updating application:', error);
    throw new Error('Failed to update application');
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await deleteAppDB(id);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw new Error('Failed to delete application');
  }
}
