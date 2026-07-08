import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Result from '@/lib/models/Result';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const academicYear = searchParams.get('academicYear');
    const studentId = searchParams.get('studentId');
    const query: any = {};
    if (academicYear) query.academicYear = academicYear;
    if (studentId) query.studentId = parseInt(studentId);
    const results = await Result.find(query).sort({ studentId: 1 }).lean();
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const result = await Result.create(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create result' }, { status: 500 });
  }
}
