import Link from 'next/link';
import { fetchPersonal, fetchBlogList } from '@/lib/api';
import { Hero } from '@/components/home/Hero';
import { PortfolioGallery } from '@/components/home/PortfolioGallery';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ProseLayout, SectionLabel } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BlogCard } from '@/components/blog/BlogCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let personal;
  let recent: Awaited<ReturnType<typeof fetchBlogList>> | null = null;
  let error: string | null = null;

  try {
    personal = await fetchPersonal();
    recent = await fetchBlogList({ pageSize: 3 });
  } catch (e) {
    error = e instanceof Error ? e.message : 'unknown error';
  }

  if (error || !personal) {
    return (
      <>
        <SiteHeader />
        <ProseLayout>
          <pre className="font-mono text-sm text-[--color-danger]">
            $ aurora: backend unavailable
            {error ? `\n  → ${error}` : ''}
            {'\n  → check NEXT_PUBLIC_API_URL and that the backend is running'}
          </pre>
        </ProseLayout>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader name={personal.name} />
      <ProseLayout>
        <Hero personal={personal} />
        <PortfolioGallery images={personal.images} />
        {personal.content && (
          <>
            <SectionLabel>about</SectionLabel>
            <MarkdownRenderer>{personal.content}</MarkdownRenderer>
          </>
        )}
        {personal.information && (
          <>
            <SectionLabel>elsewhere</SectionLabel>
            <MarkdownRenderer>{personal.information}</MarkdownRenderer>
          </>
        )}
        {recent && recent.items.length > 0 && (
          <>
            <SectionLabel>recent writing</SectionLabel>
            <div>
              {recent.items.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/blog"
                className="font-mono text-xs text-[--color-muted] hover:text-[--color-accent]"
              >
                → all posts
              </Link>
            </div>
          </>
        )}
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
