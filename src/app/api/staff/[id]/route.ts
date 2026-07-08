import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Staff from '@/lib/models/Staff';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const staff = await Staff.findById(id).lean();
    if (!staff) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const staff = await Staff.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!staff) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const staff = await Staff.findByIdAndDelete(id).lean();
    if (!staff) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}
