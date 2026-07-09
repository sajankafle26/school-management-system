import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ClassSection from '@/lib/models/ClassSection';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const section = await ClassSection.findById(id).lean();
    if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch class section' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const section = await ClassSection.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update class section' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const section = await ClassSection.findByIdAndDelete(id).lean();
    if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete class section' }, { status: 500 });
  }
}