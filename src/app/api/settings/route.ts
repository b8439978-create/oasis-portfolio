import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';

export async function GET() {
  try { return NextResponse.json(await DB.settings.get()); } catch { return NextResponse.json({ siteName: 'OASIS', tagline: 'Crafting futuristic digital experiences.', heroTitle: 'OASIS', primaryColor: '#00f0ff', theme: 'dark', language: 'en' }); }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const settings = await DB.settings.update(data);
    return NextResponse.json(settings);
  } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}
