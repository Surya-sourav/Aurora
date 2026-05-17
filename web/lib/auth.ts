import 'server-only';
import { cookies } from 'next/headers';
import { API_URL } from './api';

export interface ServerSession {
  user: { id: string; email: string };
}

export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token');
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token.value}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[getServerSession] /auth/me ${res.status}: ${body}`);
      return null;
    }
    const data = (await res.json()) as {
      success: boolean;
      user: { sub: string; email: string };
    };
    return { user: { id: data.user.sub, email: data.user.email } };
  } catch (e) {
    console.error('[getServerSession] fetch failed:', e);
    return null;
  }
}
