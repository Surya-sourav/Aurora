import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchPersonal, fetchSeriesBySlug } from '@/lib/api';
import { ProseLayout, SectionLabel } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchSeriesBySlug(slug);
    return {
      title: data.series.name,
      description: data.series.description || undefined,
    };
  } catch {
    return { title: 'series not found' };
  }
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data;
  let personal;
  try {
    [data, personal] = await Promise.all([
      fetchSeriesBySlug(slug),
      fetchPersonal().catch(() => null),
    ]);
  } catch {
    notFound();
  }
  const { series, posts } = data;
  return (
    <>
      <SiteHeader name={personal?.name ?? 'aurora'} />
      <ProseLayout>
        <SectionLabel>series</SectionLabel>
        <h1 className="font-mono text-2xl md:text-3xl font-medium tracking-tight mt-4">
          {series.name}
        </h1>
        {series.description && (
          <div className="mt-4">
            <MarkdownRenderer>{series.description}</MarkdownRenderer>
          </div>
        )}
        <div className="mt-8">
          <div className="font-mono text-xs text-[--color-faint] mb-3 uppercase tracking-wider">
            ## posts in this series · {posts.length}
          </div>
          {posts.length === 0 ? (
            <p className="font-mono text-sm text-[--color-faint]">
              no posts yet
            </p>
          ) : (
            <ol className="space-y-2">
              {posts.map((p, i) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="flex items-baseline gap-3 group py-2 border-b border-[--color-border]/60"
                  >
                    <span className="font-mono text-xs text-[--color-faint] shrink-0 w-6">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm text-[--color-fg] group-hover:text-[--color-accent] transition-colors">
                        {p.heading}
                      </div>
                      {p.excerpt && (
                        <div className="font-serif text-[--color-muted] text-sm mt-1">
                          {p.excerpt}
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-xs text-[--color-faint] shrink-0">
                      {p.reading_time_minutes}m
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
