import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Routine from '@/lib/models/Routine';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const routine = await Routine.findByIdAndUpdate(id, body, { new: true });
    if (!routine) return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
    return NextResponse.json(routine);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update routine' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const routine = await Routine.findByIdAndDelete(id);
    if (!routine) return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete routine' }, { status: 500 });
  }
}
