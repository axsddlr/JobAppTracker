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

export async function saveApplications(applications: JobApplication[]): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(DB_CONFIG.stores.applications, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.stores.applications);
    
    // Clear existing data
    await store.clear();
    
    // Add all applications in a single transaction
    for (const app of applications) {
      await store.put(app); // Use put instead of add to handle existing IDs
    }
    
    await tx.done;
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    throw new Error('Failed to save to database');
  }
}