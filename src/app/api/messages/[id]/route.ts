import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try { await DB.messages.markRead(Number(params.id)); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { await DB.messages.delete(Number(params.id)); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}
