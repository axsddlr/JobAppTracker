import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, updateApplication, deleteApplication } from '@/lib/db/sqlite';
import { APPLICATION_STATUSES } from '@/types/job-application';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = getApplicationById(Number(params.id));
    if (!app) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(app);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (body.status && !APPLICATION_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: `Invalid status '${body.status}'. Valid values: ${APPLICATION_STATUSES.join(', ')}` }, { status: 400 });
    }
    const app = updateApplication(Number(params.id), body);
    return NextResponse.json(app);
  } catch (error: any) {
    if (error.message === 'Application not found') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    deleteApplication(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
