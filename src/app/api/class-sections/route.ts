import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ClassSection from '@/lib/models/ClassSection';

export async function GET() {
  try {
    await connectDB();
    const sections = await ClassSection.find().sort({ className: 1, section: 1 }).lean();
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch class sections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const section = await ClassSection.create(body);
    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Class section already exists for this academic year' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create class section' }, { status: 500 });
  }
}