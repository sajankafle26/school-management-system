import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Parent from '@/lib/models/Parent';

export async function GET() {
  try {
    await connectDB();
    const parents = await Parent.find().sort({ name: 1 }).lean();
    return NextResponse.json(parents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch parents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parent = await Parent.create(body);
    return NextResponse.json(parent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create parent' }, { status: 500 });
  }
}
