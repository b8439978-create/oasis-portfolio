import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    await DB.visitors.add(ip);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: true }); }
}

export async function GET() {
  try { return NextResponse.json(await DB.visitors.count()); } catch { return NextResponse.json({ total: 0, today: 0, unique: 0 }); }
}
