import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const upstreamUrl = `${API_URL}/${path.join('/')}`;
  try {
    const upstream = await fetch(upstreamUrl, { cache: 'no-store' });
    if (!upstream.ok) {
      return new NextResponse('not found', { status: upstream.status });
    }
    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type':
          upstream.headers.get('content-type') ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('[/api/img] fetch failed:', e);
    return new NextResponse('upstream unreachable', { status: 502 });
  }
}
