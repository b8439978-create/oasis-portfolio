import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';

export async function GET() {
  try { return NextResponse.json(await DB.orders.all()); } catch { return NextResponse.json([]); }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const order = await DB.orders.add(data);
    return NextResponse.json(order);
  } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();
    const order = await DB.orders.update(id, data);
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}
