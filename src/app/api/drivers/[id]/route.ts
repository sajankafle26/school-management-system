import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Driver from '@/lib/models/Driver';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const driver = await Driver.findById(id).lean();
    if (!driver) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch driver' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const driver = await Driver.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!driver) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const driver = await Driver.findByIdAndDelete(id).lean();
    if (!driver) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 });
  }
}