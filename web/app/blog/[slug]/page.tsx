import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchBlogBySlug, fetchPersonal } from '@/lib/api';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ProseLayout } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { TagChip } from '@/components/blog/TagChip';
import { ReadingTime } from '@/components/blog/ReadingTime';
import { ViewCountBadge } from '@/components/layout/ViewCountBadge';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await fetchBlogBySlug(slug);
    return {
      title: blog.heading,
      description: blog.excerpt,
      openGraph: {
        title: blog.heading,
        description: blog.excerpt,
        type: 'article',
        publishedTime: blog.published_at ?? undefined,
        tags: blog.tags,
      },
      twitter: { card: 'summary_large_image' },
    };
  } catch {
    return { title: 'post not found' };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let blog;
  let personal;
  try {
    [blog, personal] = await Promise.all([
      fetchBlogBySlug(slug),
      fetchPersonal().catch(() => null),
    ]);
  } catch {
    notFound();
  }

  const date = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <ReadingProgress />
      <SiteHeader name={personal?.name ?? 'aurora'} />
      <ProseLayout>
        <Link
          href="/blog"
          className="font-mono text-xs text-[--color-muted] hover:text-[--color-accent] inline-flex items-center gap-1 mb-6"
        >
          ← all posts
        </Link>
        <header className="space-y-4 mb-8 pb-6 border-b border-[--color-border]">
          <h1 className="font-mono text-2xl md:text-3xl font-medium tracking-tight">
            {blog.heading}
          </h1>
          {blog.subheading && (
            <p className="font-serif text-lg text-[--color-muted]">
              {blog.subheading}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs text-[--color-faint]">
            {date && <time>{date}</time>}
            {date && <span>·</span>}
            <ReadingTime minutes={blog.reading_time_minutes} />
            <ViewCountBadge count={blog.view_count} />
            {blog.tags.map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </div>
        </header>
        <article>
          <MarkdownRenderer>{blog.body}</MarkdownRenderer>
        </article>
        {blog.signature && (
          <footer className="mt-12 pt-6 border-t border-[--color-border] font-mono text-sm text-[--color-muted]">
            {blog.signature}
          </footer>
        )}
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
