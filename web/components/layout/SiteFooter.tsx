import Link from 'next/link';
import { Rss } from 'lucide-react';
import { HelpHint } from './HelpHint';

export function SiteFooter() {
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local';
  return (
    <footer className="mt-24 border-t border-[--color-border]">
      <div className="mx-auto max-w-[760px] px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[--color-faint]">
        <div>
          <span className="text-[--color-muted]">$</span> uptime · curious{' '}
          <span className="text-[--color-border]">·</span> built{' '}
          <span className="text-[--color-muted]">{buildId}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/feed.xml"
            className="inline-flex items-center gap-1 hover:text-[--color-accent] transition-colors"
            title="RSS feed"
          >
            <Rss size={12} /> rss
          </Link>
          <Link href="/sitemap.xml" className="hover:text-[--color-fg]">
            sitemap
          </Link>
          <HelpHint />
        </div>
      </div>
    </footer>
  );
}
