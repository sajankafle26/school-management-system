import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Expense from '@/lib/models/Expense';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const expense = await Expense.findById(id).lean();
    if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const expense = await Expense.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const expense = await Expense.findByIdAndDelete(id).lean();
    if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}