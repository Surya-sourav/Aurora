import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const upstream = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await upstream.text();
  const data: { token?: string; user?: unknown; message?: string } = text
    ? JSON.parse(text)
    : {};

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  let token = data.token;
  if (!token) {
    const setCookieList =
      typeof (upstream.headers as Headers & {
        getSetCookie?: () => string[];
      }).getSetCookie === 'function'
        ? (upstream.headers as Headers & { getSetCookie: () => string[] }).getSetCookie()
        : [upstream.headers.get('set-cookie') ?? ''];
    for (const s of setCookieList) {
      const m = s.match(/aurora_token=([^;]+)/);
      if (m) {
        token = m[1];
        break;
      }
    }
  }

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'login succeeded but no token returned' },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ success: true, user: data.user });
  response.cookies.set('aurora_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  return response;
}
