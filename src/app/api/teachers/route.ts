import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Teacher from '@/lib/models/Teacher';

export async function GET() {
  try {
    await connectDB();
    const teachers = await Teacher.find().sort({ name: 1 }).lean();
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const teacher = await Teacher.create(body);
    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
  }
}
