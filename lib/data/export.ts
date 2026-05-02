import { fetchApplicationsAPI } from '@/lib/data/api';

export async function exportToJSON(): Promise<string> {
  try {
    const applications = await fetchApplicationsAPI();
    return JSON.stringify(applications, null, 2);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export to JSON');
  }
}
