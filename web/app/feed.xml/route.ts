import { API_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/rss.xml`, { cache: 'no-store' });
    const xml = await res.text();
    return new Response(xml, {
      status: res.status,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>aurora</title><link>/</link><description>backend offline</description></channel></rss>',
      {
        status: 503,
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
      },
    );
  }
}
