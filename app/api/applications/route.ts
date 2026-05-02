import { NextRequest, NextResponse } from 'next/server';
import { getAllApplications, createApplication } from '@/lib/db/sqlite';

export async function GET() {
  try {
    const applications = getAllApplications();
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const app = createApplication(body);
    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
