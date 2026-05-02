'use client';

import { initDB } from './init';
import { DB_CONFIG } from './config';
import type { JobApplication } from '@/types/job-application';

export async function getAllApplications(): Promise<JobApplication[]> {
  try {
    const db = await initDB();
    const applications = await db.getAll(DB_CONFIG.stores.applications);
    return applications.sort((a, b) => 
      new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
    );
  } catch (error) {
    console.error('Error accessing IndexedDB:', error);
    return [];
  }
}

export async function getApplication(id: number): Promise<JobApplication | undefined> {
  try {
    const db = await initDB();
    return await db.get(DB_CONFIG.stores.applications, id);
  } catch (error) {
    console.error('Error getting application from IndexedDB:', error);
    throw new Error('Failed to read from database');
  }
}

export async function putApplication(application: JobApplication): Promise<void> {
  try {
    const db = await initDB();
    await db.put(DB_CONFIG.stores.applications, application);
  } catch (error) {
    console.error('Error writing to IndexedDB:', error);
    throw new Error('Failed to write to database');
  }
}

export async function deleteApplication(id: number): Promise<void> {
  try {
    const db = await initDB();
    await db.delete(DB_CONFIG.stores.applications, id);
  } catch (error) {
    console.error('Error deleting from IndexedDB:', error);
    throw new Error('Failed to delete from database');
  }
}

export async function saveApplications(applications: JobApplication[]): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(DB_CONFIG.stores.applications, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.stores.applications);
    
    await store.clear();
    
    for (const app of applications) {
      await store.put(app);
    }
    
    await tx.done;
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    throw new Error('Failed to save to database');
  }
}