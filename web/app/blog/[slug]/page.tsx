import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  fetchBlogBySlug,
  fetchBlogList,
  fetchCategories,
  fetchPersonal,
  fetchSeriesList,
} from '@/lib/api';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ProseLayout } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { TagChip } from '@/components/blog/TagChip';
import { CategoryChip } from '@/components/blog/CategoryChip';
import { ReadingTime } from '@/components/blog/ReadingTime';
import { ViewCountBadge } from '@/components/layout/ViewCountBadge';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CopyAsMarkdown } from '@/components/blog/CopyAsMarkdown';
import { SocialShare } from '@/components/blog/SocialShare';
import { SeriesNav } from '@/components/blog/SeriesNav';
import { MastodonComments } from '@/components/blog/MastodonComments';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

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
  let categories;
  let allSeries;
  let allBlogs;
  try {
    [blog, personal, categories, allSeries, allBlogs] = await Promise.all([
      fetchBlogBySlug(slug),
      fetchPersonal().catch(() => null),
      fetchCategories().catch(() => []),
      fetchSeriesList().catch(() => []),
      fetchBlogList({ pageSize: 50 })
        .then((r) => r.items)
        .catch(() => []),
    ]);
  } catch {
    notFound();
  }
  const category = blog.category_id
    ? categories.find((c) => c.id === blog.category_id)
    : undefined;
  const series = blog.series_id
    ? allSeries.find((s) => s.id === blog.series_id)
    : undefined;
  const siblings = series
    ? allBlogs.filter((b) => b.series_id === series.id)
    : [];

  const date = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const postUrl = `${SITE_URL}/blog/${blog.slug}`;

  return (
    <>
      <ReadingProgress />
      <SiteHeader name={personal?.name ?? 'aurora'} />
      <div className="mx-auto max-w-[1100px] px-4 grid gap-8 md:grid-cols-[1fr_minmax(200px,_240px)] py-12">
        <article className="min-w-0 max-w-[680px] mx-auto md:mx-0 w-full">
          <Link
            href="/blog"
            className="font-mono text-xs text-[--color-muted] hover:text-[--color-accent] inline-flex items-center gap-1 mb-6"
          >
            ← all posts
          </Link>

          {series && (
            <SeriesNav
              series={series}
              siblings={siblings}
              currentSlug={blog.slug}
            />
          )}

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
              {category && <CategoryChip category={category} />}
              {blog.tags.map((t) => (
                <TagChip key={t} tag={t} />
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <SocialShare url={postUrl} title={blog.heading} />
              <CopyAsMarkdown text={blog.body} />
            </div>
          </header>

          <div>
            <MarkdownRenderer>{blog.body}</MarkdownRenderer>
          </div>

          {blog.signature && (
            <footer className="mt-12 pt-6 border-t border-[--color-border] font-mono text-sm text-[--color-muted]">
              {blog.signature}
            </footer>
          )}

          <RelatedPosts
            current={{
              id: blog.id,
              tags: blog.tags,
              category_id: blog.category_id,
            }}
            all={allBlogs}
          />

          {blog.mastodon_post_url && (
            <MastodonComments postUrl={blog.mastodon_post_url} />
          )}
        </article>

        <aside className="hidden md:block">
          <div className="sticky top-20">
            <TableOfContents body={blog.body} />
          </div>
        </aside>
      </div>
      <SiteFooter />
    </>
  );
}
