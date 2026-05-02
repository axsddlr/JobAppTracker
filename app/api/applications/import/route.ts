import { NextRequest, NextResponse } from 'next/server';
import { saveAllApplications } from '@/lib/db/sqlite';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applications } = body;

    if (!Array.isArray(applications) || applications.length === 0) {
      return NextResponse.json({ error: 'No applications provided' }, { status: 400 });
    }

    saveAllApplications(applications);

    return NextResponse.json({ success: true, count: applications.length });
  } catch (error) {
    console.error('Error importing applications:', error);
    return NextResponse.json({ error: 'Failed to import applications' }, { status: 500 });
  }
}
