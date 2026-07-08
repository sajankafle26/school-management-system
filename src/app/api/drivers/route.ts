import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Driver from '@/lib/models/Driver';

export async function GET() {
  try {
    await connectDB();
    const drivers = await Driver.find().sort({ name: 1 }).lean();
    return NextResponse.json(drivers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const driver = await Driver.create(body);
    return NextResponse.json(driver, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
  }
}
