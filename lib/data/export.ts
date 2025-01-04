import { getDB } from '@/lib/db/client';

export async function exportToJSON(): Promise<string> {
  try {
    const applications = await getDB();
    return JSON.stringify(applications, null, 2);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export to JSON');
  }
}