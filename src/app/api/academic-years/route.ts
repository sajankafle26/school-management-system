import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AcademicYear from '@/lib/models/AcademicYear';

export async function GET() {
  try {
    await connectDB();
    const academicYears = await AcademicYear.find().sort({ year: -1 }).lean();
    return NextResponse.json(academicYears);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch academic years' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const academicYear = await AcademicYear.create(body);
    return NextResponse.json(academicYear, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create academic year' }, { status: 500 });
  }
}
