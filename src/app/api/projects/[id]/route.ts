import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const project = await DB.projects.update(Number(params.id), data);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { await DB.projects.delete(Number(params.id)); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
}
