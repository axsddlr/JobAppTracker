import { utils, writeFile } from 'xlsx';
import { getDB } from '@/lib/db/client';

export async function exportToExcel(): Promise<void> {
  try {
    const applications = await getDB();
    
    const worksheet = utils.json_to_sheet(applications.map(app => ({
      'Company Name': app.companyName,
      'Job URL': app.jobUrl,
      'Date Applied': new Date(app.dateApplied).toLocaleDateString(),
      'Status': app.status.charAt(0).toUpperCase() + app.status.slice(1),
      'Created At': new Date(app.created_at).toLocaleString(),
      'Updated At': new Date(app.updated_at).toLocaleString()
    })));
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Applications');
    
    writeFile(workbook, 'job-applications.xlsx');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
}