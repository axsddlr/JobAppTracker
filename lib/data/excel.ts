import { utils, writeFile } from 'xlsx';
import { getDB } from '@/lib/db/client';

export async function exportToExcel(): Promise<void> {
  try {
    const applications = await getDB();
    
    const worksheet = utils.json_to_sheet(applications.map(app => ({
      'Company Name': app.companyName,
      'Position': app.position || '',
      'Platform': app.platform === 'other' ? app.customPlatform || 'Other' : 
                 app.platform ? app.platform.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '',
      'Job URL': app.jobUrl,
      'Date Applied': new Date(app.dateApplied).toLocaleDateString(),
      'Status': app.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
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