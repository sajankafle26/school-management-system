import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AcademicYear from '@/lib/models/AcademicYear';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const year = await AcademicYear.findById(id).lean();
    if (!year) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(year);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch academic year' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const year = await AcademicYear.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!year) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(year);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update academic year' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const year = await AcademicYear.findByIdAndDelete(id).lean();
    if (!year) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete academic year' }, { status: 500 });
  }
}
