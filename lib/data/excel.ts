import { utils, writeFile } from 'xlsx';
import { getDB } from '@/lib/db/client';
import { formatSnakeCase, customPlatformFor, formatDate, formatDateTime } from '@/lib/utils';

export async function exportToExcel(): Promise<void> {
  try {
    const applications = await getDB();
    
    const worksheet = utils.json_to_sheet(applications.map(app => ({
      'Company Name': app.companyName,
      'Position': app.position || '',
      'Platform': customPlatformFor(app.platform, app.customPlatform) || 
                  (app.platform ? formatSnakeCase(app.platform) : ''),
      'Job URL': app.jobUrl,
      'Date Applied': formatDate(app.dateApplied, 'PP'),
      'Status': formatSnakeCase(app.status),
      'Created At': formatDateTime(app.created_at),
      'Updated At': formatDateTime(app.updated_at)
    })));
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Applications');
    
    writeFile(workbook, 'job-applications.xlsx');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
}