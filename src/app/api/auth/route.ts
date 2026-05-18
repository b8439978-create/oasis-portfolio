import { NextResponse } from 'next/server';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'oasis2024';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return NextResponse.json({ success: true, token: 'oasis-admin-token' });
    }
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch { return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 }); }
}
