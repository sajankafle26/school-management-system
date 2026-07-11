import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Book from '@/lib/models/Book';

export async function GET(request: Request) {
  try {
    await connectDB();
    const items = await Book.find().lean();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const item = await Book.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
