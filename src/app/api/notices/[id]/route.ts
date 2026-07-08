import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notice from '@/lib/models/Notice';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const notice = await Notice.findById(id).lean();
    if (!notice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(notice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const notice = await Notice.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!notice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(notice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const notice = await Notice.findByIdAndDelete(id).lean();
    if (!notice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
  }
}
