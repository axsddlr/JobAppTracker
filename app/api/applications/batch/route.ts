import { NextRequest, NextResponse } from 'next/server';
import { bulkUpdateStatus, bulkDelete } from '@/lib/db/sqlite';
import { APPLICATION_STATUSES } from '@/types/job-application';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ids, status } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    if (action === 'update-status') {
      if (!status) {
        return NextResponse.json({ error: 'No status provided' }, { status: 400 });
      }
      if (!APPLICATION_STATUSES.includes(status)) {
        return NextResponse.json({ error: `Invalid status '${status}'. Valid values: ${APPLICATION_STATUSES.join(', ')}` }, { status: 400 });
      }
      bulkUpdateStatus(ids, status);
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (action === 'delete') {
      bulkDelete(ids);
      return NextResponse.json({ success: true, count: ids.length });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in batch operation:', error);
    return NextResponse.json({ error: 'Batch operation failed' }, { status: 500 });
  }
}
