import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Parent from '@/lib/models/Parent';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const parent = await Parent.findById(id).lean();
    if (!parent) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(parent);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch parent' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parent = await Parent.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!parent) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(parent);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update parent' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const parent = await Parent.findByIdAndDelete(id).lean();
    if (!parent) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete parent' }, { status: 500 });
  }
}
