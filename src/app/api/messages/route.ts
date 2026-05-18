import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';

export async function GET() {
  try { return NextResponse.json(await DB.messages.all()); } catch { return NextResponse.json([]); }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const msg = await DB.messages.add(data);
    return NextResponse.json(msg);
  } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await DB.messages.delete(id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}
