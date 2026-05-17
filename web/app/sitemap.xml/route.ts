import { API_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/sitemap.xml`, { cache: 'no-store' });
    const xml = await res.text();
    return new Response(xml, {
      status: res.status,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        status: 503,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      },
    );
  }
}
