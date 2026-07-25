import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

// Read-only proxy for public backend endpoints — lets client components fetch
// without needing NEXT_PUBLIC_API_URL baked into the client bundle.
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const search = req.nextUrl.search ?? '';
  const url = `${API_URL}/${path.join('/')}${search}`;
  try {
    const upstream = await fetch(url, { cache: 'no-store' });
    const body = await upstream.text();
    return new NextResponse(body || null, {
      status: upstream.status,
      headers: {
        'Content-Type':
          upstream.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'upstream unreachable' },
      { status: 502 },
    );
  }
}
