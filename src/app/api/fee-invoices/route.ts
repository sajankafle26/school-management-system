import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FeeInvoice from '@/lib/models/FeeInvoice';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const academicYear = searchParams.get('academicYear');
    const query: any = {};
    if (academicYear) query.academicYear = academicYear;
    const invoices = await FeeInvoice.find(query).sort({ dueDate: 1 }).lean();
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fee invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const invoice = await FeeInvoice.create(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create fee invoice' }, { status: 500 });
  }
}
