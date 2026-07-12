import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Routine from '@/lib/models/Routine';

export async function GET() {
  try {
    await connectDB();
    const routines = await Routine.find().sort({ className: 1, section: 1, day: 1 }).lean();
    return NextResponse.json(routines);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch routines' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const routine = await Routine.create(body);
    return NextResponse.json(routine, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create routine' }, { status: 500 });
  }
}
