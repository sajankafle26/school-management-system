import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Teacher from '@/lib/models/Teacher';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const teacher = await Teacher.findById(id).lean();
    if (!teacher) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teacher' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const teacher = await Teacher.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!teacher) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const teacher = await Teacher.findByIdAndDelete(id).lean();
    if (!teacher) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}