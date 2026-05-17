import { ImageResponse } from 'next/og';
import { fetchBlogBySlug } from '@/lib/api';

export const runtime = 'nodejs';
export const alt = 'blog post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let blog;
  try {
    blog = await fetchBlogBySlug(slug);
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a1d24',
            color: '#f0e9d5',
            fontFamily: 'monospace',
            fontSize: 48,
          }}
        >
          aurora
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#1a1d24',
          color: '#f0e9d5',
          padding: 60,
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#7bc885',
            fontSize: 18,
            marginBottom: 32,
          }}
        >
          <span style={{ marginRight: 8 }}>~/blog/</span>
          <span style={{ color: '#9aa0aa' }}>{slug}</span>
        </div>
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.15,
            fontWeight: 600,
            marginBottom: 24,
            display: 'flex',
          }}
        >
          {blog.heading}
        </div>
        {blog.subheading && (
          <div
            style={{
              fontSize: 28,
              color: '#9aa0aa',
              marginBottom: 24,
              display: 'flex',
            }}
          >
            {blog.subheading}
          </div>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ color: '#7bc885' }}>$</span>
          <span style={{ color: '#9aa0aa', fontSize: 20 }}>
            {blog.reading_time_minutes} min read · {blog.view_count} views
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
