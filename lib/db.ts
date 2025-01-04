import { getDB, saveDB } from './db/client';
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

type CreateApplicationInput = Pick<JobApplication, 'companyName' | 'jobUrl' | 'dateApplied' | 'status'>;

export async function createApplication(
  application: CreateApplicationInput
): Promise<JobApplication> {
  try {
    const applications = await getDB();
    const now = new Date().toISOString();
    const newApplication = {
      ...application,
      id: Date.now(),
      created_at: now,
      updated_at: now,
    };
    
    await saveDB([...applications, newApplication]);
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
    const applications = await getDB();
    const index = applications.findIndex(app => app.id === id);
    if (index === -1) throw new Error('Application not found');

    const updatedApplication = {
      ...applications[index],
      ...updates,
      id, // Ensure ID doesn't change
      updated_at: new Date().toISOString(),
    };

    applications[index] = updatedApplication;
    await saveDB(applications);
    return updatedApplication;
  } catch (error) {
    console.error('Error updating application:', error);
    throw new Error('Failed to update application');
  }
}

export async function deleteApplication(id: number): Promise<void> {
  try {
    const applications = await getDB();
    const updatedApplications = applications.filter(app => app.id !== id);
    await saveDB(updatedApplications);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw new Error('Failed to delete application');
  }
}